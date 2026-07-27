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

function ArchiveNote({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-note-title"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        background: "rgba(14,14,18,0.42)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        animation: "archiveNoteFadeIn 260ms ease-out both",
      }}
    >
      <section
        onClick={event => event.stopPropagation()}
        style={{
          width: "min(100%, 580px)",
          background: "#ffffff",
          color: "#1b1b1e",
          padding: "clamp(28px, 5vw, 48px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
          animation: "archiveNoteRise 360ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <div style={{ width: 36, height: 2, background: "#b31b1b", marginBottom: 22 }} />
        <h2 id="archive-note-title" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 20px" }}>
          Archival Note
        </h2>
        <p style={{ fontSize: 15, lineHeight: "24px", color: "#4c4c52", margin: 0 }}>
          This archival website is based on the contents of twenty-six boxes of material previously stored in the department’s warehouse.
        </p>
        <p style={{ fontSize: 15, lineHeight: "24px", color: "#4c4c52", margin: "16px 0 0" }}>
          We know there are gaps and omissions in this collection of photographs, articles, programs, historical documents, and records of the people associated with the department.
        </p>
        <button
          onClick={onClose}
          autoFocus
          style={{ marginTop: 30, background: "#b31b1b", color: "#ffffff", padding: "13px 20px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}
        >
          Continue to the archive
        </button>
      </section>
    </div>
  );
}


export default function App() {
  const [introDone, setIntroDone] = useState(() => sessionStorage.getItem("pma-intro-seen") === "1");
  const [fontsReady, setFontsReady] = useState(() =>
    typeof document === "undefined" || document.fonts.check("800 66px 'Saira Condensed'")
  );
  const [page, setPage] = useState<Page>("home");
  const [scrollToEras, setScrollToEras] = useState(false);
  const [atHero, setAtHero] = useState(true);
  const [archiveNoteOpen, setArchiveNoteOpen] = useState(false);

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

  useEffect(() => {
    if (fontsReady || typeof document === "undefined") return;
    let mounted = true;

    Promise.all([
      document.fonts.load("800 66px 'Saira Condensed'"),
      document.fonts.load("400 16px Inter"),
    ]).finally(() => {
      if (mounted) setFontsReady(true);
    });

    return () => { mounted = false; };
  }, [fontsReady]);

  useEffect(() => {
    if (!introDone || !fontsReady || page !== "home" || sessionStorage.getItem("pma-archive-note-seen") === "1") return;
    const timer = window.setTimeout(() => setArchiveNoteOpen(true), 550);
    return () => window.clearTimeout(timer);
  }, [introDone, fontsReady, page]);

  const closeArchiveNote = () => {
    sessionStorage.setItem("pma-archive-note-seen", "1");
    setArchiveNoteOpen(false);
  };

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

  if (!introDone) {
    return <Intro onComplete={() => { sessionStorage.setItem("pma-intro-seen", "1"); setIntroDone(true); }} />;
  }

  if (!fontsReady) {
    return <div style={{ minHeight: "100svh", background: "#0a0a0a" }} />;
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
      {archiveNoteOpen && <ArchiveNote onClose={closeArchiveNote} />}
    </>
  );
}
