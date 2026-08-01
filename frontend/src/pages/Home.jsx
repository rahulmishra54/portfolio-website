import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Projects from "../components/sections/Projects";
import CertificatesSection from "../components/sections/Certificates";
import BlogsSection from "../components/sections/Blogs";
import ContactSection from "../components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <CertificatesSection />
      <BlogsSection />
      <ContactSection />
    </>
  );
}