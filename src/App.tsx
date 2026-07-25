import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import EraSection from "./components/sections/EraSection";
import { eras } from "./data/eras";
import { useState, useEffect } from "react";
import Intro from "./components/sections/Intro";
import { pageZoom } from "./lib/scale";
import PreSchwartzPage from "./pages/PreSchwartzPage";
import SchwartzPage from "./pages/SchwartzPage";
import EmergencePage from "./pages/EmergencePage";
import DirectoryPage from "./pages/DirectoryPage";
import AboutPage from "./pages/AboutPage";
import RepertoryPage from "./pages/RepertoryPage";
import GuestsPage from "./pages/GuestsPage";

type Page = "home" | "pre-schwartz" | "schwartz" | "emergence" | "directory" | "about" | "repertory" | "guests";


export default function App() {
  const [introDone, setIntroDone] = useState(() => sessionStorage.getItem("pma-intro-seen") === "1");
  const [page, setPage] = useState<Page>("home");
  const [scrollToEras, setScrollToEras] = useState(false);
  const [atHero, setAtHero] = useState(true);

  useEffect(() => {
    if (page === "home" && scrollToEras) {
      const timer = setTimeout(() => {
        document.getElementById("eras")?.scrollIntoView({ behavior: "smooth" });
        setScrollToEras(false);
      }, 80);
      return () => clearTimeout(timer);
    }
    if (page === "home" && !scrollToEras) {
      window.scrollTo(0, 0);
    }
  }, [page, scrollToEras]);

  useEffect(() => {
    const onScroll = () => {
      const z = pageZoom();
      setAtHero(window.scrollY < Math.max(window.innerHeight - 60 * z, 240 * z));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!introDone) {
    return <Intro onComplete={() => { sessionStorage.setItem("pma-intro-seen", "1"); setIntroDone(true); }} />;
  }

  const navProps = {
    onHome:        () => setPage("home"),
    onDirectory:   () => setPage("directory"),
    onPreSchwartz: () => setPage("pre-schwartz"),
    onSchwartz:    () => setPage("schwartz"),
    onEmergence:   () => setPage("emergence"),
    onAbout:       () => setPage("about"),
    onRepertory:   () => setPage("repertory"),
    onGuests:      () => setPage("guests"),
  };

  if (page === "pre-schwartz") {
    return <PreSchwartzPage onHome={() => setPage("home")} navProps={navProps} />;
  }

  if (page === "schwartz") {
    return <SchwartzPage onHome={() => setPage("home")} navProps={navProps} />;
  }

  if (page === "emergence") {
    return <EmergencePage onHome={() => setPage("home")} navProps={navProps} />;
  }

  if (page === "about") {
    return <AboutPage onHome={() => setPage("home")} navProps={navProps} />;
  }

  if (page === "repertory") {
    return <RepertoryPage onHome={() => setPage("home")} navProps={navProps} />;
  }

  if (page === "guests") {
    return <GuestsPage onHome={() => setPage("home")} navProps={navProps} />;
  }

  if (page === "directory") {
    return (
      <DirectoryPage
        onHome={() => setPage("home")}
        navProps={navProps}
      />
    );
  }

  return (
    <>
      <Nav
        {...navProps}
        transparent={atHero}
        light={!atHero}
      />
      <main>
        <Hero onExplore={() => document.getElementById("eras")?.scrollIntoView({ behavior: "smooth" })} />
        <div id="eras" />
        {eras.map((era) => (
          <EraSection
            key={era.numeral}
            era={era}
            image={
              era.numeral === "I" ? "/godot_front.png" :
              era.numeral === "II" ? "/schwartzcenterlong.webp" :
              era.numeral === "III" ? "/scans-sz/lgd13_01.jpg" :
              undefined
            }
            imageCaption={
              era.numeral === "I" ? "Christopher Reeve 1972" :
              era.numeral === "II" ? "Schwartz Center" :
              era.numeral === "III" ? "Locally Grown Dance, 2013" :
              undefined
            }
            onClick={
              era.numeral === "I" ? () => setPage("pre-schwartz") :
              era.numeral === "II" ? () => setPage("schwartz") :
              era.numeral === "III" ? () => setPage("emergence") :
              undefined
            }
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
