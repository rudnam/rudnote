import { Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import Home from "./components/Home";
import { Footer } from "./components/Footer";
import { Auth } from "./components/Auth";
import { Studio } from "./components/Studio";
import { BlogPostPage } from "./components/BlogPostPage";
import { About } from "./components/About";
import { Contact } from "./components/Contact";

export default function App() {

  return (
    <div className="App container min-h-dvh min-w-full bg-gray-50 flex flex-col justify-between items-center text-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/posts/:slug" element={<BlogPostPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      <Footer />
    </div>
  );
}
