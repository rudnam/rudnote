import { Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import Home from "./pages/Home";
import { Auth } from "./pages/Auth";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { UserPage } from "./pages/UserPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { StudioHome } from "./pages/StudioHome";
import { StudioEditor } from "./pages/StudioEditor";

export default function App() {
  return (
    <div className="App min-h-dvh w-full bg-zinc-50 text-zinc-800 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/studio" element={<StudioHome />} />
          <Route path="/studio/:id" element={<StudioEditor />} />
          <Route path="/:userSlug" element={<UserPage />} />
          <Route path="/:userSlug/:slug" element={<BlogPostPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
