import SkipLink from "@/components/SkipLink";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ClientTypes from "@/components/ClientTypes";
import Services from "@/components/Services";
import Process from "@/components/Process";
import CaseStudies from "@/components/CaseStudies";
import Scope from "@/components/Scope";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <ClientTypes />
        <Services />
        <Process />
        <CaseStudies />
        <Scope />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
