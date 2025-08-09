package com.rudnam.note.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rudnam.note.AbstractIntegrationTest;
import com.rudnam.note.models.Post;
import com.rudnam.note.models.User;
import com.rudnam.note.repository.PostRepository;
import com.rudnam.note.repository.UserRepository;
import com.rudnam.note.service.PasswordService;
import com.rudnam.note.service.JwtService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc()
@Testcontainers
@Transactional
public class PostControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private JwtService jwtService;

    private String jwtToken;

    @BeforeEach
    void registerAndLoginUser() throws Exception {
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "username": "john",
                                    "email": "john@example.com",
                                    "password": "pass123"
                                }
                                """))
                .andExpect(status().isCreated());

        var loginResult = mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "email": "john@example.com",
                                    "password": "pass123"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        var responseJson = loginResult.getResponse().getContentAsString();
        var tokenResponse = objectMapper.readTree(responseJson);
        jwtToken = tokenResponse.get("token").asText();
        assertThat(jwtToken).isNotBlank();
    }

    @Test
    void createPost_authenticatedUser_shouldSaveAndReturnPost() throws Exception {
        var postRequest = """
                {
                  "title": "My First Post",
                  "slug": "my-first-post",
                  "summary": "Short summary",
                  "content": "Hello **Markdown** world!",
                  "status": "PUBLISHED"
                }
                """;

        var result = mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(postRequest))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("My First Post"))
                .andExpect(jsonPath("$.author.username").value("john"))
                .andReturn();

        System.out.println("Created Post Response: " + result.getResponse().getContentAsString());
    }

    @Test
    @WithAnonymousUser
    void createPost_unauthenticated_shouldReturnUnauthorized() throws Exception {
        var postRequest = """
                {
                  "title": "My First Post",
                  "slug": "my-first-post",
                  "summary": "Short summary",
                  "content": "Hello **Markdown** world!",
                  "status": "PUBLISHED"
                }
                """;

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postRequest))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllPublishedPosts_shouldReturnPage() throws Exception {
        var user = createTestUser("alice");
        createTestPost("Post A", "post-a", user, Post.Status.PUBLISHED);
        createTestPost("Post B", "post-b", user, Post.Status.PUBLISHED);
        createTestPost("Draft Post", "draft-post", user, Post.Status.DRAFT);

        mockMvc.perform(get("/api/posts")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].status").value("PUBLISHED"));
    }

    @Test
    void getPublishedPostsByUser_shouldReturnOnlyUserPublishedPosts() throws Exception {
        var alice = createTestUser("alice");
        var bob = createTestUser("bob");

        createTestPost("Alice Post", "alice-post", alice, Post.Status.PUBLISHED);
        createTestPost("Bob Post", "bob-post", bob, Post.Status.PUBLISHED);
        createTestPost("Alice Draft", "alice-draft", alice, Post.Status.DRAFT);

        mockMvc.perform(get("/api/posts/@alice")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].slug").value("alice-post"));
    }

    @Test
    void getMyPosts_authenticated_shouldReturnOwnPosts() throws Exception {
        var user = getUserFromJwtToken(jwtToken);
        createTestPost("My Published", "my-pub", user, Post.Status.PUBLISHED);
        createTestPost("My Draft", "my-draft", user, Post.Status.DRAFT);

        mockMvc.perform(get("/api/posts/me")
                        .header("Authorization", "Bearer " + jwtToken)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].author.username").value(user.getUsername()));
    }

    @Test
    void getMyPosts_unauthenticated_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/posts/me")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getPostByUsernameAndSlug_published_shouldReturnPost() throws Exception {
        var user = createTestUser("carol");
        createTestPost("Carol Post", "carol-post", user, Post.Status.PUBLISHED);

        mockMvc.perform(get("/api/posts/@carol/carol-post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("carol-post"))
                .andExpect(jsonPath("$.author.username").value("carol"));
    }

    @Test
    void getPostByUsernameAndSlug_draft_unauthorizedShouldFail() throws Exception {
        var user = createTestUser("dave");
        createTestPost("Dave Draft", "dave-draft", user, Post.Status.DRAFT);

        mockMvc.perform(get("/api/posts/@dave/dave-draft"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getPostByUsernameAndSlug_draft_authorizedShouldReturnPost() throws Exception {
        var user = createTestUser("ellen");
        createTestPost("Ellen Draft", "ellen-draft", user, Post.Status.DRAFT);

        String token = loginAndGetJwtToken("ellen");

        mockMvc.perform(get("/api/posts/@ellen/ellen-draft")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("ellen-draft"));
    }

    @Test
    void updatePost_authorized_shouldUpdatePost() throws Exception {
        var user = getUserFromJwtToken(jwtToken);
        var post = createTestPost("Old Title", "old-slug", user, Post.Status.DRAFT);

        var updateRequest = """
                {
                    "title": "New Title",
                    "slug": "new-slug",
                    "summary": "Updated summary",
                    "content": "Updated content",
                    "status": "PUBLISHED"
                }
                """;

        System.out.println(post.getId());

        mockMvc.perform(put("/api/posts/" + post.getId())
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Title"))
                .andExpect(jsonPath("$.status").value("PUBLISHED"));
    }

    @Test
    void updatePost_unauthorized_shouldReturnUnauthorized() throws Exception {
        var user = createTestUser("frank");
        var post = createTestPost("Title", "slug", user, Post.Status.DRAFT);

        var updateRequest = """
                {
                    "title": "Changed",
                    "slug": "changed-slug",
                    "summary": "Summary",
                    "content": "Content",
                    "status": "DRAFT"
                }
                """;

        mockMvc.perform(put("/api/posts/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updatePost_notAuthor_shouldReturnForbidden() throws Exception {
        var author = createTestUser("george");
        createTestUser("harry");
        var post = createTestPost("Title", "slug", author, Post.Status.DRAFT);

        var token = loginAndGetJwtToken("harry");

        var updateRequest = """
                {
                    "title": "Changed",
                    "slug": "changed-slug",
                    "summary": "Summary",
                    "content": "Content",
                    "status": "DRAFT"
                }
                """;

        mockMvc.perform(put("/api/posts/" + post.getId())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest))
                .andExpect(status().isForbidden());
    }

    @Test
    void deletePost_authorized_shouldDeletePost() throws Exception {
        var user = getUserFromJwtToken(jwtToken);
        var post = createTestPost("Title to Delete", "slug-delete", user, Post.Status.PUBLISHED);

        mockMvc.perform(delete("/api/posts/" + post.getId())
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void deletePost_unauthorized_shouldReturnUnauthorized() throws Exception {
        var post = createTestPost("Some Title", "slug-some", createTestUser("ian"), Post.Status.PUBLISHED);

        mockMvc.perform(delete("/api/posts/" + post.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deletePost_notAuthor_shouldReturnForbidden() throws Exception {
        var author = createTestUser("jane");
        createTestUser("kyle");
        var post = createTestPost("Delete Me", "slug-delete", author, Post.Status.PUBLISHED);

        var token = loginAndGetJwtToken("kyle");

        mockMvc.perform(delete("/api/posts/" + post.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    private User createTestUser(String username) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(username + "@example.com");
        user.setPasswordHash(passwordService.hash("password"));
        user.setDisplayName("Display " + username);
        return userRepository.save(user);
    }

    private Post createTestPost(String title, String slug, User author, Post.Status status) {
        Post post = new Post();
        post.setTitle(title);
        post.setSlug(slug);
        post.setAuthor(author);
        post.setStatus(status);
        post.setContent("Sample content");
        post.setSummary("Sample summary");
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        if (status == Post.Status.PUBLISHED) {
            post.setPublishedAt(Instant.now());
        }
        return postRepository.save(post);
    }

    private User getUserFromJwtToken(String token) {
        try {
            UUID userId = jwtService.validateTokenAndGetUserId(token);
            return userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found for ID: " + userId));
        } catch (Exception e) {
            return null;
        }
    }

    private String loginAndGetJwtToken(String username) throws Exception {
        var loginRequest = String.format("""
                {
                    "email": "%s@example.com",
                    "password": "%s"
                }
                """, username, "password");

        var loginResult = mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())
                .andReturn();

        var responseJson = loginResult.getResponse().getContentAsString();
        var tokenResponse = objectMapper.readTree(responseJson);
        return tokenResponse.get("token").asText();
    }
}
