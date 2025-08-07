import { Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import { Footer } from "./components/Footer";
import { Auth } from "./pages/Auth";
import { BlogPostPage } from "./pages/BlogPostPage";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { UserPage } from "./pages/UserPage";
import { StudioHome } from "./pages/StudioHome";
import { StudioEditor } from "./pages/StudioEditor";

export default function App() {

  return (
    <div className="App container min-h-dvh min-w-full bg-gray-50 flex flex-col justify-between items-center text-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/studio" element={<StudioHome />} />
        <Route path="/studio/:id" element={<StudioEditor />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:userSlug" element={<UserPage />} />
        <Route path="/:userSlug/:slug" element={<BlogPostPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
