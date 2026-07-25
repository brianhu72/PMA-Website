import React, { useState, useEffect, useRef } from "react";
import { pageZoom }    from "../lib/scale";
import SharedNav       from "../components/layout/Nav";
import ChapterRail     from "../components/ui/ChapterRail";
import { useIsMobile } from "../lib/useIsMobile";
import Cornell_Logo    from "../assets/Cornell_Logo.png";
import DrummondFront   from "../assets/Drummond Front.png";
import LyceumImg       from "../assets/lyceum.jpg";
import WillardImg      from "../assets/WSH.jpeg";
import CDC1            from "../assets/Cornell Dramatic Club img01.png";

const ESPRESSO      = "#1b1b1e";
const ESPRESSO_SOFT = "#4c4c52";
const MUTED         = "#8a8a90";
const CARNELIAN     = "#b31b1b";
const SERIF = "'Newsreader', Georgia, serif";
const PAPER         = "#ffffff";
const TAN           = "#ffffff";
const DARK          = "#141418";


const scan = (prefix: string, n: number, caption: string, start = 1) =>
  Array.from({ length: n }, (_, k) => ({
    src: `/scans/${prefix}_${String(start + k).padStart(2, "0")}.jpg`,
    caption,
  }));

const productions80sSlides = [
  ...scan("hay_fever", 4, "Hay Fever, dir. Stephen Cole, 1982–83 season."),
  { src: "/scans/tii_01.jpg", caption: "The Imaginary Invalid, dir. John Rainey, 1982–83 season." },
  ...scan("aydm", 2, "As You Desire Me, dir. Robert Gross, 1984–85 season. Photo: Jon Crispin."),
  ...scan("three_sisters", 2, "Three Sisters, dir. Tony Cronin, 1984–85 season. Photo: Jon Crispin."),
  { src: "/scans/misc8485_01.jpg", caption: "Backstage, c. 1984–85, possibly David Feldshuh." },
];

const midsummerSlides = scan("midsummer", 10,
  "A Midsummer Night's Dream on tour, dir. David Feldshuh, 1984.");

const scriptInHandSlides = [
  ...scan("lilacs", 3, "Now That Lilacs Are in Bloom, Script in Hand reading, November 19, 1984. Photo: Jon Crispin."),
  ...scan("tovah", 1, "Tovah Feldshuh in Now That Lilacs Are in Bloom, 1984. Photo: Jon Crispin."),
  ...scan("payback", 1, "Edward Payson Call, director, at the Payback reading, February 11, 1985. Photo: Jon Crispin."),
  ...scan("payback", 1, "Paul D'Andrea, author of Payback, February 11, 1985. Photo: Jon Crispin.", 3),
  ...scan("summerwinds", 1, "Summer Winds, Script in Hand reading, April 15, 1985. Photo: Jon Crispin."),
  ...scan("summerwinds", 1, "Summer Winds, Script in Hand reading, April 15, 1985. Photo: Patricia Reynolds.", 4),
  ...scan("horseplay", 2, "Horseplay & Disease, Script in Hand reading, April 29, 1985. Photo: Jon Crispin."),
];

const jeroSlides = scan("jero", 10, "The Jero Plays, dir. David Feldshuh, 1985–86 season. Photo: Jon Crispin.");

const looseEndsSlides = scan("loose_ends", 10, "Loose Ends, dir. Bruce Levitt, 1986–87 season. Photo: Patricia Reynolds.");

const danceSlides = [
  ...scan("springdance85", 2, "Spring Dance '85. Photo: Jon Crispin."),
  ...scan("springdance85", 1, "Spring Dance '85, in rehearsal. Photo: Jon Crispin.", 3),
  ...scan("springdance87", 3, "Spring Dance, 1986–87. Photo: Jon Crispin."),
  ...scan("springdance87", 2, "Spring Dance, 1986–87. Photo: Patricia Reynolds.", 11),
  ...scan("baroque", 1, "The New York Baroque Dance Company, on the Cornell Dance Series, 1986–87."),
  { src: "/scans/baroque_poster.jpg", caption: "Poster for the New York Baroque Dance Company engagement, 1986–87." },
];

const ARCHIVE_8687_CAPTIONS: Record<number, string> = {
  12: "Poster for The Deal by Matthew Witten, Script in Hand series, Drummond Studio, Lincoln Hall.",
  13: "\"When the Date Turns into Rape\", press coverage of Theatre Cornell Outreach's acquaintance-rape project.",
  15: "\"Professor, Director, Doctor\", a press profile of David Feldshuh.",
  19: "Poster for Best of British Acting, the National Theatre of Great Britain summer program at Cornell.",
  21: "Poster for Pleasure & Repentance, a Resident Professional Theatre Associates anthology performance.",
  23: "Poster for The Visionary, presented by the Cornell Dramatic Club.",
};

const archiveSlides = [
  ...[1, 5, 11, 12, 13, 15, 19, 21, 23]
    .map(n => ({
      src: `/scans/misc8687_${String(n).padStart(2, "0")}.jpg`,
      caption: ARCHIVE_8687_CAPTIONS[n] ?? (
        n <= 10 ? "Photograph by Jon Crispin, 1986–87." :
        n === 11 ? "Photograph by Patricia Reynolds, subject unidentified, c. 1987–89." :
        "From the department archive, c. 1986–87."
      ),
    })),
  { src: "/scans/misc87_03.jpg", caption: "Outside the Drummond Studio, Lincoln Hall, c. 1987. Photo: Patricia Reynolds." },
];


function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}


interface AsideNote { label: string; text: string; image?: string }

function NotesGrid({ notes, isDark = false }: { notes: AsideNote[]; isDark?: boolean }) {
  const topRule  = `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`;
  const labelClr = isDark ? "#6b6b70" : MUTED;
  const textClr  = isDark ? "#9a9aa4" : ESPRESSO_SOFT;

  if (notes.length === 1) {
    const n = notes[0];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", marginTop: 44, paddingTop: 26, borderTop: topRule }}>
        {n.image && (
          <img
            src={n.image}
            alt={n.label}
            style={{ width: 138, flexShrink: 0, objectFit: "cover", objectPosition: "center top", borderRadius: 2, display: "block" }}
          />
        )}
        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: labelClr, marginBottom: 8, lineHeight: "15px" }}>
            {n.label}
          </p>
          <p style={{ fontSize: 12, lineHeight: "19px", letterSpacing: "-0.027px", color: textClr, maxWidth: 560 }}>
            {n.text}
          </p>
        </div>
      </div>
    );
  }

  const cols = notes.length === 4 ? 2 : Math.min(Math.max(notes.length, 2), 3);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "30px 44px",
      marginTop: 44,
      paddingTop: 26,
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
    }}>
      {notes.map((n, i) => (
        <div key={i}>
          {n.image && (
            <img
              src={n.image}
              alt={n.label}
              style={{ width: "100%", maxWidth: 220, objectFit: "cover", objectPosition: "center top", borderRadius: 2, marginBottom: 12, display: "block" }}
            />
          )}
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: isDark ? "#6b6b70" : MUTED, marginBottom: 8, lineHeight: "15px" }}>
            {n.label}
          </p>
          <p style={{ fontSize: 12, lineHeight: "19px", letterSpacing: "-0.027px", color: isDark ? "#9a9aa4" : ESPRESSO_SOFT }}>
            {n.text}
          </p>
        </div>
      ))}
    </div>
  );
}


interface Sub { label: string; labelColor?: string; title: string; body: string; bodyWidth?: number }

function Subsection({ title, body, bodyWidth = 900 }: Sub) {
  return (
    <div style={{ marginTop: 46, paddingTop: 28, borderTop: `1px solid rgba(0,0,0,0.08)` }}>
      <p style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, letterSpacing: "-0.15px", lineHeight: "24px", color: ESPRESSO, marginBottom: 10 }}>
        {title}
      </p>
      <p style={{ fontSize: 13, lineHeight: "20px", letterSpacing: "-0.027px", color: ESPRESSO_SOFT, textAlign: "justify", maxWidth: bodyWidth }}>
        {body}
      </p>
    </div>
  );
}


interface ChapterProps {
  chapterLabel: string;
  title: string;
  dates: string;
  leadParagraph?: string;
  paragraphs?: string[];
  pullQuote?: { text: string; attribution: string };
  subsections?: Sub[];
  aside?: AsideNote[];
  bg?: string;
  inlineImage?: { src: string; caption: string };
  beforeSubsections?: React.ReactNode;
  id?: string;
}

function ChapterSection({ chapterLabel, title, dates, leadParagraph, paragraphs = [], pullQuote, subsections = [], aside, bg = TAN, inlineImage, beforeSubsections, id }: ChapterProps) {
  const isDark   = bg === DARK;
  const bodyClr  = isDark ? "#b8b8c2" : ESPRESSO;
  const muteClr  = isDark ? "#6b6b70" : MUTED;
  const ruleClr  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <section id={id} style={{ background: bg, paddingTop: 120, paddingBottom: 80, borderTop: `1px solid ${ruleClr}` }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.84px", textTransform: "uppercase", color: muteClr, lineHeight: "16px", marginBottom: 15 }}>
            {chapterLabel}
          </p>
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: "32px", color: isDark ? "#fff" : ESPRESSO, marginBottom: 15 }}>
            {title}
          </h2>
          <p style={{ fontSize: 10, letterSpacing: "0.13px", lineHeight: "17px", color: muteClr, marginBottom: inlineImage ? 36 : 32 }}>
            {dates}
          </p>
          {inlineImage && (
            <figure style={{ margin: "0 0 36px 0" }}>
              <img
                src={inlineImage.src}
                alt={inlineImage.caption}
                style={{ width: "100%", maxHeight: 480, objectFit: "cover", objectPosition: "center", borderRadius: 2, display: "block" }}
              />
              <figcaption style={{ fontFamily: SERIF, fontSize: 11, letterSpacing: "0.02em", color: muteClr, marginTop: 10, fontStyle: "italic" }}>
                {inlineImage.caption}
              </figcaption>
            </figure>
          )}
          {leadParagraph && (
            <p style={{ fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: isDark ? "#fff" : ESPRESSO, textAlign: "justify", marginBottom: 18 }}>
              {leadParagraph}
            </p>
          )}
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: bodyClr, textAlign: "justify", marginBottom: 18 }}>
              {p}
            </p>
          ))}
          {pullQuote && (
            <div style={{ marginTop: 48, marginBottom: 48 }}>
              <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, fontWeight: 400, lineHeight: "31px", letterSpacing: "-0.2px", color: isDark ? "#fff" : ESPRESSO, textAlign: "justify", marginBottom: 12 }}>
                {pullQuote.text}
              </p>
              <p style={{ fontSize: 9, letterSpacing: "0.125px", color: muteClr }}>
                {pullQuote.attribution}
              </p>
            </div>
          )}

          {beforeSubsections}
          {subsections.map(sub => (
            <Subsection
              key={sub.label}
              {...sub}
              labelColor={sub.labelColor ?? (isDark ? "#c47070" : CARNELIAN)}
              bodyWidth={sub.bodyWidth ?? 900}
            />
          ))}
          {aside && aside.length > 0 && <NotesGrid notes={aside} isDark={isDark} />}
      </div>
    </section>
  );
}



function Hero() {
  const mobile = useIsMobile();
  return (
    <div style={{ position: "relative", width: "100%", height: mobile ? 320 : 440, overflow: "hidden", backgroundColor: "#0b0b0e" }}>
      <img
        src={CDC1}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(9,9,12,0.93) 0%, rgba(9,9,12,0.55) 44%, rgba(9,9,12,0.30) 100%)",
      }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: mobile ? "0 20px 38px" : "0 0 54px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 26, height: 2, background: CARNELIAN, flexShrink: 0 }} />
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", margin: 0, fontFamily: "Inter, sans-serif" }}>
              Section I of III · 1880–1989
            </p>
          </div>
          <h1 style={{
            fontFamily: "Saira Condensed, sans-serif",
            fontSize: mobile ? 33 : 58, fontWeight: 800, lineHeight: mobile ? "34px" : "54px",
            letterSpacing: "0.3px", color: "#fff",
            textTransform: "uppercase", margin: 0, maxWidth: 860,
          }}>
            Before the Center
          </h1>
        </div>
      </div>
    </div>
  );
}




function DanceArrow({ dir, onClick, integrated = false }: { dir: "prev" | "next"; onClick: () => void; integrated?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dir === "prev" ? "Previous photograph" : "Next photograph"}
      style={{
        width: 26, height: 26, borderRadius: "50%",
        border: "none", padding: 0,
        background: hovered ? (integrated ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.12)") : "transparent",
        color: integrated ? (hovered ? ESPRESSO : MUTED) : (hovered ? "#ffffff" : "rgba(255,255,255,0.5)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, lineHeight: 1, cursor: "pointer",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      {dir === "prev" ? "\u2039" : "\u203a"}
    </button>
  );
}

function DanceFeature({ title, description, note, slides, integrated = false }: {
  title: string; description: string; note?: string; slides: Slide[]; integrated?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const count = slides.length;
  const current = slides[idx];

  return (
    <div style={{ background: integrated ? "transparent" : DARK, paddingTop: integrated ? 0 : 96, paddingBottom: integrated ? 0 : 96, marginTop: integrated ? 38 : 64, borderTop: integrated ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {!integrated && <>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ width: 26, height: 2, background: CARNELIAN, flexShrink: 0 }} />
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: CARNELIAN, margin: 0 }}>
              Dance archive
            </p>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: "38px", color: "#f2f2f4", margin: "0 0 12px" }}>
            {title}
          </h2>
          <p style={{ fontSize: 13, lineHeight: "21px", letterSpacing: "-0.027px", color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: 640 }}>
            {description}
          </p>
          {note && (
            <p style={{ fontFamily: SERIF, fontSize: 13, fontStyle: "italic", lineHeight: "20px", color: "rgba(255,255,255,0.45)", margin: "10px 0 0", maxWidth: 640 }}>
              {note}
            </p>
          )}
        </>}
        <div
          onClick={() => setIdx(i => (i + 1) % count)}
          style={{ height: integrated ? 420 : 520, marginTop: integrated ? 26 : 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          {current.src && (
            <img
              src={current.src}
              alt={current.caption}
              style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto", display: "block", boxShadow: integrated ? "0 4px 22px rgba(0,0,0,0.14)" : "0 8px 40px rgba(0,0,0,0.5)" }}
            />
          )}
        </div>
        <div style={{ marginTop: 20, paddingTop: 14, borderTop: integrated ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 32 }}>
          <p style={{ fontFamily: SERIF, fontSize: 12.5, lineHeight: "19px", color: integrated ? ESPRESSO_SOFT : "rgba(255,255,255,0.55)", fontStyle: "italic", margin: 0 }}>
            {current.caption}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <DanceArrow dir="prev" integrated={integrated} onClick={() => setIdx(i => (i - 1 + count) % count)} />
            <span style={{ fontSize: 10, color: CARNELIAN, letterSpacing: "0.06em", whiteSpace: "nowrap", minWidth: 54, textAlign: "center" }}>
              {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <DanceArrow dir="next" integrated={integrated} onClick={() => setIdx(i => (i + 1) % count)} />
          </div>
        </div>
      </div>
    </div>
  );
}

const CHAPTERS = [
  { n: "I",    title: "Origins, From Cascadilla to the Dramatic Club",           dates: "1880–1925", id: "chapter-i"    },
  { n: "II",   title: "The Drummond Era at Willard Straight",                    dates: "1925–1947", id: "chapter-ii"   },
  { n: "III",  title: "Mid-Century Consolidation",                               dates: "1947–1967", id: "chapter-iii"  },
  { n: "IV",   title: "The Department of Theatre Arts",                          dates: "1967–1984", id: "chapter-iv"   },
  { n: "V",    title: "The New Home: Planning, Construction & Arrival",          dates: "1979–1989", id: "chapter-v"    },
  { n: "VI",   title: "The Program Before the Center",                            dates: "c. 1980s",  id: "chapter-vi"   },
];

function CuratorIntro() {
  const toc = CHAPTERS;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76 * pageZoom(), behavior: "smooth" });
  };

  return (
    <section style={{ background: PAPER, paddingTop: 92, paddingBottom: 64 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 20, lineHeight: "31px", letterSpacing: "-0.16px", color: ESPRESSO, marginBottom: 20, maxWidth: 720 }}>
            This section follows theatre at Cornell from student productions in downtown Ithaca to the 1989 opening of the Center for Theatre Arts.
          </p>
          <p style={{ fontSize: 16, lineHeight: "26px", letterSpacing: "-0.05px", color: ESPRESSO_SOFT, marginBottom: 56, maxWidth: 720 }}>
            It is the story of a program that grew through borrowed and improvised spaces, built an academic and producing base, and eventually made a permanent home possible.
          </p>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: 2 }}>
            Contents
          </p>
          <div style={{ borderBottom: "1px solid rgba(0,0,0,0.09)" }}>
            {toc.map(item => (
              <TocRow key={item.n} n={item.n} title={item.title} dates={item.dates} onClick={() => scrollTo(item.id)} />
            ))}
          </div>
          <div style={{ marginTop: 36, maxWidth: 640 }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, lineHeight: "15px", marginBottom: 8 }}>
              A note on the record
            </p>
            <p style={{ fontSize: 12, lineHeight: "19px", letterSpacing: "-0.027px", color: ESPRESSO_SOFT }}>
              Much of this history is preserved in materials at the Schwartz Center and Cornell's Division of Rare and Manuscript Collections.
            </p>
          </div>
        </div>
    </section>
  );
}


interface Slide { src?: string; caption: string }

function NavArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dir === "prev" ? "Previous plate" : "Next plate"}
      style={{
        width: 26, height: 26, borderRadius: "50%",
        border: "none", padding: 0,
        background: hovered ? "rgba(0,0,0,0.06)" : "transparent",
        color: hovered ? ESPRESSO : MUTED,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, lineHeight: 1, cursor: "pointer",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}

function GallerySlideshow({ galleryLabel, title, description, slides, bg = PAPER }: {
  galleryLabel: string; title: string; description: string; slides: Slide[]; bg?: string;
}) {
  const [idx, setIdx] = useState(0);
  const count = slides.length;
  const current = slides[idx];

  return (
    <section style={{ background: bg, paddingTop: 80, paddingBottom: 80, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, lineHeight: "15px", marginBottom: 16 }}>{galleryLabel}</p>
      <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.3px", color: ESPRESSO, marginBottom: 16 }}>{title}</h2>
      <p style={{ fontSize: 11, lineHeight: "17px", color: ESPRESSO_SOFT, marginBottom: 40, maxWidth: 780 }}>{description}</p>
      <div
        onClick={() => setIdx(i => (i + 1) % count)}
        style={{ height: 520, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        {current.src ? (
          <img
            src={current.src}
            alt={current.caption}
            style={{
              maxHeight: "100%", maxWidth: "100%",
              width: "auto", height: "auto",
              display: "block",
              boxShadow: "0 2px 22px rgba(0,0,0,0.13)",
            }}
          />
        ) : (
          <span style={{ fontFamily: SERIF, fontSize: 11, color: MUTED, fontStyle: "italic" }}>Archival photograph</span>
        )}
      </div>
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 32 }}>
        <p style={{ fontFamily: SERIF, fontSize: 12.5, lineHeight: "19px", color: ESPRESSO_SOFT, fontStyle: "italic", margin: 0 }}>
          {current.caption}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <NavArrow dir="prev" onClick={() => setIdx(i => (i - 1 + count) % count)} />
          <span style={{ fontSize: 10, color: MUTED, letterSpacing: "0.06em", whiteSpace: "nowrap", minWidth: 54, textAlign: "center" }}>
            {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <NavArrow dir="next" onClick={() => setIdx(i => (i + 1) % count)} />
        </div>
      </div>

      {count <= 20 && (
        <div style={{ display: "flex", gap: 7, marginTop: 16 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: 6, height: 6, borderRadius: "50%", background: i === idx ? CARNELIAN : "rgba(0,0,0,0.14)", padding: 0, border: "none", cursor: "pointer" }} />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}


interface GridImage { src?: string; caption: string }

function GalleryGrid({ galleryLabel, title, description, images, bg = PAPER }: {
  galleryLabel: string; title: string; description: string; images: GridImage[]; bg?: string;
}) {
  return (
    <section style={{ background: bg, paddingTop: 80, paddingBottom: 80, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, lineHeight: "15px", marginBottom: 16 }}>{galleryLabel}</p>
      <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.3px", color: ESPRESSO, marginBottom: 16 }}>{title}</h2>
      <p style={{ fontSize: 11, lineHeight: "17px", color: ESPRESSO_SOFT, marginBottom: 40, maxWidth: 780 }}>{description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 900 }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              background: "rgba(0,0,0,0.05)",
              aspectRatio: i === 0 ? "16/7" : "4/3",
              gridColumn: i === 0 ? "1 / -1" : "auto",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {img.src ? (
              <>
                <img
                  src={img.src}
                  alt={img.caption}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", bottom: 12, left: 12, fontFamily: SERIF, fontSize: 10, color: "rgba(255,255,255,0.78)", fontStyle: "italic" }}>{img.caption}</span>
              </>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: SERIF, fontSize: 11, color: MUTED, fontStyle: "italic", textAlign: "center", padding: "0 16px" }}>{img.caption}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}


function TocRow({ n, title, dates, onClick }: { n: string; title: string; dates: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "42px 1fr auto",
        alignItems: "baseline",
        gap: 22,
        width: "100%",
        padding: "17px 14px 17px 6px",
        textAlign: "left",
        background: hovered ? "rgba(0,0,0,0.025)" : "transparent",
        border: "none",
        borderTop: "1px solid rgba(0,0,0,0.09)",
        cursor: "pointer",
        transition: "background 0.18s ease",
      }}
    >
      <span style={{
        fontFamily: "'Saira Condensed', sans-serif",
        fontSize: 19, fontWeight: 700, letterSpacing: "0.02em",
        color: hovered ? CARNELIAN : "rgba(0,0,0,0.26)",
        transition: "color 0.18s ease",
      }}>{n}</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
        <span style={{
          fontSize: 15, fontWeight: 500, letterSpacing: "-0.1px",
          color: hovered ? CARNELIAN : ESPRESSO,
          transform: hovered ? "translateX(3px)" : "translateX(0)",
          transition: "color 0.18s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}>{title}</span>
        <span style={{
          fontSize: 12, color: CARNELIAN,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-5px)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}>→</span>
      </span>
      <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{dates}</span>
    </button>
  );
}

function BoxCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        border: `1px solid ${hovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 4,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.07)" : "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}


function ChapterIVSection() {
  const topStats = [
    { num: "4th",   label: "In the nation, 1978 Gourman Report ranking of theatre departments" },
    { num: "≈100",  label: "Actors trained by the MFA in Acting in its first fourteen years" },
    { num: "250+",  label: "Advanced graduate degrees granted by the early 1980s" },
  ];
  const funnelItems = [
    { num: "2,000–3,000", label: "National applicants each year, through URTA", color: ESPRESSO },
    { num: "≈550",        label: "Finalists",                                   color: ESPRESSO },
    { num: "6–7",         label: "Admitted to Cornell, per year",               color: CARNELIAN },
  ];
  const productions = [
    "The Taming of the Shrew", "Man and Superman", "A Day in the Death of Joe Egg", "Tango",
    "An Italian Straw Hat", "The House of Blue Leaves", "Old Times", "The Dragon",
    "No Place to Be Somebody", "Penthesilea", "Staircase", "Count Dracula", "Buried Child",
  ];

  const BT: React.CSSProperties = { fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: ESPRESSO, textAlign: "justify", marginBottom: 18 };
  const SH: React.CSSProperties = { fontFamily: SERIF, fontSize: 17, fontWeight: 600, letterSpacing: "-0.15px", lineHeight: "24px", color: ESPRESSO, marginBottom: 10 };

  return (
    <section id="chapter-iv" style={{ background: TAN, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 0 80px" }}>
            <p style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.84px", textTransform: "uppercase", color: MUTED, lineHeight: "16px", marginBottom: 15 }}>
              Chapter IV
            </p>
            <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: "32px", color: ESPRESSO, marginBottom: 15 }}>
              The Department of Theatre Arts
            </h2>
            <p style={{ fontSize: 10, letterSpacing: "0.13px", lineHeight: "17px", color: MUTED, marginBottom: 32 }}>1967 – 1984</p>
            <p style={{ ...BT, marginBottom: 40 }}>
              The Department of Theatre Arts, established in 1967, brought academic study and production together within one unit. Within a decade, the program had gained national recognition.
            </p>
            <div style={{ display: "flex", gap: 34, marginBottom: 52, flexWrap: "wrap" }}>
              {topStats.map((s, i) => {
                const fs = s.num.length > 5 ? 28 : 40;
                return (
                  <div key={i} style={{ flex: 1, minWidth: 150, textAlign: "center" }}>
                    <div style={{ width: 128, height: 128, borderRadius: "50%", background: ESPRESSO, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "0 8px", boxSizing: "border-box" }}>
                      <span style={{ fontFamily: "Saira Condensed, sans-serif", fontSize: fs, fontWeight: 700, color: "#f5f1ea", letterSpacing: "-0.5px", lineHeight: 0.95, whiteSpace: "nowrap" }}>{s.num}</span>
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.11em", textTransform: "uppercase", color: MUTED, lineHeight: "15px", margin: "12px auto 0", maxWidth: 175 }}>{s.label}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ paddingTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                <p style={SH}>A conservatory programme takes shape</p>
                <span style={{ fontSize: 9, color: MUTED, letterSpacing: "0.6px", whiteSpace: "nowrap" }}>1968–1985</span>
              </div>
              <p style={BT}>
                In the fall of 1968, the department initiated a Master of Fine Arts in Acting, which was a small, intensive, conservatory-style program. Recruitment ran through national University Resident Theatre Association (URTA) auditions, and it was extremely selective.
              </p>
              <div style={{ display: "flex", alignItems: "center", margin: "28px 0", gap: 10 }}>
                {funnelItems.map((item, i) => (
                  <React.Fragment key={i}>
                    <div style={{ flex: 1, minWidth: 150, textAlign: "center" }}>
                      <div style={{ width: 128, height: 128, borderRadius: "50%", background: ESPRESSO, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "0 8px", boxSizing: "border-box" }}>
                        <span style={{ fontFamily: "Saira Condensed, sans-serif", fontSize: item.num.length > 8 ? 26 : 34, fontWeight: 700, letterSpacing: "-0.5px", color: item.color === CARNELIAN ? "#d34a40" : "#f5f1ea", lineHeight: 0.95, whiteSpace: "nowrap" }}>{item.num}</span>
                      </div>
                      <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, lineHeight: "14px", margin: "12px auto 0", maxWidth: 175 }}>{item.label}</p>
                    </div>
                    {i < funnelItems.length - 1 && (
                      <div style={{ fontSize: 13, color: "rgba(0,0,0,0.22)", flexShrink: 0 }}>→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p style={BT}>
                The curriculum was explicitly classical, with acting, voice, speech, dance, movement, and script analysis alongside American Mime, Aikido, fencing, and weaponry. The goal was to bring "the actor's self and technique" into a unified acting practice. The program reported that its refusal rate among accepted students was "virtually non-existent." It ran until 1985, after which professional graduate training shifted toward the Resident Professional Theatre Associates program, displayed in the Directory.
              </p>
            </div>
            <div style={{ marginTop: 46, paddingTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <p style={{ ...SH, marginBottom: 10 }}>The Stephen Cole years</p>
              <p style={BT}>
                Stephen Cole headed the MFA in Acting from its inception and was the principal directorial presence in the department through the late 1970s and into the early 1980s. His extensive list of Cornell productions gives a sense of the period's theatre landscape:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 6, marginBottom: 18 }}>
                {productions.map((title, i) => (
                  <React.Fragment key={i}>
                    <span style={{ fontSize: 13, color: ESPRESSO_SOFT, lineHeight: "22px", letterSpacing: "-0.027px" }}>{title}</span>
                    {i < productions.length - 1 && (
                      <span style={{ fontSize: 13, color: "rgba(0,0,0,0.18)", margin: "0 8px", lineHeight: "22px" }}>·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 46, paddingTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <p style={{ ...SH, marginBottom: 10 }}>Visiting artists</p>
              <p style={{ ...BT, marginBottom: 18 }}>
                The late 1970s and early 1980s saw a steady stream of guest artists: Marvin Carlson's Hamlet Festival (1978–79); Herbert Berghof's <em>Charlotte</em> (1980–81), starring his wife and longtime collaborator Uta Hagen; the playwright David Rabe directing his own <em>In the Boom Boom Room;</em> and Ray Aranha's <em>My Sister, My Sister.</em> The 1983–84 season, led by visiting artist George Touliatos, was celebrated as the seventy-fifth year of continuous dramatic activity at Cornell.
              </p>
              <p style={{ ...BT, marginBottom: 0 }}>
                The department's international reach was further demonstrated by <strong>Michelangelo Antonioni,</strong> who served as the Andrew D. White Professor-at-Large. Earlier visitors to the film program had included Stan Brakhage, D. A. Pennebaker, Al Maysles, and Elia Kazan.
              </p>
            </div>
            <div style={{ marginTop: 46, paddingTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <p style={{ ...SH, marginBottom: 10 }}>Christopher Reeve!</p>
              <p style={{ ...BT, marginBottom: 24 }}>
                Among the students of these years was <strong>Christopher Reeve '74,</strong> who worked through the repertory across four undergraduate seasons, playing Pozzo in <em>Waiting for Godot,</em> Segismundo in <em>Life Is a Dream,</em> and the lead in <em>Rosencrantz and Guildenstern Are Dead</em> before leaving for Juilliard and, three years later, the role of Superman. A decade on, his name would appear on the alumni committee that helped plan the Center for Theatre Arts.
              </p>
              <figure style={{ margin: 0 }}>
                <img
                  src="/scans/reeve_godot.jpg"
                  alt="Waiting for Godot in rehearsal, 1972"
                  style={{ display: "block", width: "100%", height: "auto", boxShadow: "0 4px 30px rgba(0,0,0,0.15)" }}
                />
                <figcaption style={{ fontFamily: SERIF, fontSize: 11, fontStyle: "italic", color: MUTED, marginTop: 12, letterSpacing: "0.02em" }}>
                  Waiting for Godot in rehearsal, Christopher Reeve '74 at right, 1972. From the department archive.
                </figcaption>
              </figure>
            </div>
            <NotesGrid notes={[
              { label: "A research library", text: "The graduate programs drew on one of the largest theatre research libraries in the United States, including the George Jean Nathan collection and the Wason collection of Oriental materials." },
              { label: "Dance arrives in series", text: "The Cornell Dance Series, inaugurated in 1978, brought the Mark Morris Dance Group, the Stars of the Canadian Ballet, and the Dan Wagoner Dancers to campus." },
              { label: "Companion programs", text: "An MFA in Directing admitted a single student per year toward a fully mounted thesis; an MFA in Design / Technology enrolled ten to twelve across set, costume, and lighting." },
            ]} />
      </div>

    </section>
  );
}


function Closing() {
  const mobile = useIsMobile();
  return (
    <>
      <section style={{ background: "#141417", paddingTop: 140, paddingBottom: 80, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ width: 48, height: 2, background: "#2c2c34", margin: "0 auto 28px" }} />
        <p style={{
          fontSize: 30,
          fontWeight: 500,
          lineHeight: "42px",
          letterSpacing: "-0.6px",
          color: "#eef0f2",
          margin: "0 auto 56px",
          maxWidth: 820,
          padding: "0 24px",
        }}>
          In spring 1989, after decades in borrowed and improvised spaces, the department moved into a home of its own.
        </p>
      </section>
      <section style={{ background: "#141417", padding: mobile ? "56px 20px" : "84px 90px 84px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 0.7fr", gap: mobile ? 40 : 80, maxWidth: 1320 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8a8a93", marginBottom: 16, lineHeight: "16px" }}>
              About this exhibition
            </p>
            <p style={{ fontSize: 12, lineHeight: "20px", letterSpacing: "-0.02px", color: "#eef0f2", marginBottom: 36, maxWidth: 520 }}>
              The first of three sections in a history of theatre at Cornell, drawn from the department's archives and the published record. A complete production chronology between 1930 and the late 1970s remains to be reconstructed.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
              <img src={Cornell_Logo} alt="Cornell seal" style={{ width: 48, height: 48, objectFit: "contain", opacity: 0.85 }} />
              <div>
                <p style={{ fontSize: 10, fontWeight: 400, color: "#8a8a93", lineHeight: "16px", letterSpacing: "0.02em" }}>Department of</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#eef0f2", lineHeight: "20px", letterSpacing: "-0.1px" }}>
                  Performing <span style={{ color: "#b31b1b" }}>&amp;</span> Media Arts
                </p>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "#8a8a93", letterSpacing: "0.48px", lineHeight: "21.84px" }}>
              430 College Avenue · Ithaca, New York · Established 1909
            </p>
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8a8a93", marginBottom: 16, lineHeight: "16px" }}>
              Principal sources
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                <><span>· </span><em>Dedication of the Center for Performing Arts</em><span> (commemorative pamphlet, April 1989)</span></>,
                <><span>· Morris Bishop, </span><em>A History of Cornell</em><span> (1962)</span></>,
                <><span>· </span><em>Theatre Cornell Focus</em><span>, Nos. 40–41 (1982–83)</span></>,
                <><span>· Cornell University News Services press releases, 1980–1984</span></>,
                <><span>· </span><em>Communiqué</em><span>, "Will Your Name Be in Lights?" (Summer 1984)</span></>,
                <><span>· Cornell planning documents, c. 1981–83</span></>,
                <><span>· James Stirling / Michael Wilford fonds, Canadian Centre for Architecture</span></>,
                <><span>· Department of Theatre Arts records &amp; the Alexander M. Drummond Papers, Division of Rare and Manuscript Collections</span></>,
              ].map((line, i) => (
                <p key={i} style={{ fontSize: 11, lineHeight: "20px", letterSpacing: "-0.02px", color: "#8a8a93" }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}


type NavConfig = { onHome?: () => void; onDirectory?: () => void; onPreSchwartz?: () => void; onSchwartz?: () => void };

export default function PreSchwartzPage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
  const [atHero, setAtHero] = useState(true);
  const mobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setAtHero(window.scrollY < 240 * pageZoom());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: PAPER, minHeight: "calc(100vh / var(--pz, 1))", fontFamily: "Inter, sans-serif" }}>
      <SharedNav {...(navProps ?? {})} onHome={onHome} transparent={atHero} light={!atHero} />
      <ChapterRail toc={CHAPTERS} />
      <Hero />
      <div>
       <div style={{ maxWidth: 1288, margin: "0 auto", padding: mobile ? "0 16px" : undefined }}>

        <Reveal><CuratorIntro /></Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-i"
          bg={TAN}
          chapterLabel="Chapter I"
          title="Origins, From Cascadilla to the Dramatic Club"
          dates="1880 – 1925"
          inlineImage={{ src: LyceumImg, caption: "The Lyceum Theatre, downtown Ithaca, site of the 1909 inaugural Cornell Dramatic Club production of An Enemy of the People." }}
          leadParagraph="In 1880, as Morris Bishop records in A History of Cornell, Professor Goldwin Smith bore the expense of establishing a theatre in Cascadilla, and the Cascadilla Dramatic Association was born with a production of She Stoops to Conquer. Faculty and students, including women, took part."
          paragraphs={[
            "Ten years later, a new student organization called the Masque was organized; its early members, in Bishop's phrase, \"found the formula of the all-male college musical,\" producing original works with titles such as Anno 1992, Popocaterpillar, The Misfit Man, and The President of Oolong. Women of the campus, impelled by their exclusion from these productions, organized their own work, including a dramatization of Tennyson's The Princess under the Sage Dramatic Club.",
            "Other clubs multiplied in the first decade of the twentieth century. A French-language club staged two farces in Barnes Hall in 1903, and a full-length comedy downtown Ithaca at the Lyceum Theatre the following year, \"a financial as well as artistic success.\" A German society staged Alt Heidelberg in 1908 and, the next year, obtained $10,000 of scenery, costumes, and equipment from a New York theatre to mount Schiller's Wilhelm Tell at the Lyceum.",
            "The Cornell Dramatic Club emerged in 1909 against this background. James A. Winans, chairman of Public Speaking, and Smiley Blanton, M.D. '14, later a famous psychiatrist and writer, organized a production of Henrik Ibsen's An Enemy of the People at the Lyceum in what Cornell's own commemorative materials describe as \"remarkably energetic and fruitful.\" The independent Cornell Women's Dramatic Club would formally merge with the CDC in 1925.",
            "The club introduced American audiences to plays they could see nowhere else, including Giuseppe Giacosa's Like Falling Leaves, Jacques Copeau's The House into Which We Are Born, Jules Romains' Doctor Knock, and Luigi Pirandello's Right You Are, If You Think So (1927). Its policy was \"to present important European plays seldom or never before offered on the American stage.\" The Cornell Dramatic Club admitted men and women on terms of complete equality, identified in the department's own records as the first Cornell organization to do so.",
          ]}
        />
        </Reveal>

        <Reveal>
        <GalleryGrid
          galleryLabel="Gallery 01"
          title="The Cornell Dramatic Club"
          description="Production photographs from the club's early decades."
          images={[
            { src: "/scans/cdc_01.jpg", caption: "" },
            { src: "/scans/cdc_02.jpg", caption: "The Adventurer" },
            { src: "/scans/cdc_03.jpg", caption: "The Adventurer" },
            { src: "/scans/cdc_04.jpg", caption: "The Adventurer" },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-ii"
          chapterLabel="Chapter II"
          title="The Drummond Era at Willard Straight"
          dates="1925 – 1947"
          inlineImage={{ src: WillardImg, caption: "Willard Straight Hall, described as the first purpose-built campus theatre in the country, opened 1925." }}
          aside={[
            { label: "Alexander M. Drummond · Director of Cornell theatre, 1912–1947", image: DrummondFront, text: "A thirty-five-year tenure whose reach extended well beyond Ithaca: Drummond's correspondence, preserved in his papers at Cornell, includes exchanges with Eugene O'Neill, George Bernard Shaw, Oscar Hammerstein II, and Hendrik Van Loon." },
          ]}
          leadParagraph="The completion of Willard Straight Hall in 1925 transformed the material situation of theatre at Cornell. The Willard Straight Theatre was described as the first true campus theater in the country, built specifically for campus drama activities."
          paragraphs={[
            "The artist J. Monroe Hewlett was commissioned to decorate the walls with murals depicting scenes from classical theatre and Shakespeare; those murals remained, decades later, \"among the most-cherished features of the Cornell campus.\" The inaugural production, Royal Tyler's The Contrast, which Bishop calls \"the first social comedy written and produced in America,\" starred Franchot Tone '27, who within a decade would become a major Broadway, Hollywood, and Group Theatre figure.",
            "Professor Blanton directed the club until 1911, when Lew D. Fallis assumed the post for a single year. In 1912, Alexander M. Drummond became director, a position he would hold until his retirement in 1947. His thirty-five-year tenure shaped the institutional, pedagogical, and creative character of theatre at Cornell so thoroughly that, for decades afterward, his name was described as synonymous with the enterprise: his contributions were both intellectual and structural.",
            "Those contributions began in the classroom. Drummond had started teaching theatre as early as 1919; in 1922 the university granted academic credit for drama for the first time, and regular playwriting courses followed in 1931. The graduate programs were among the earliest of their kind in the country: a Master of Arts in dramatic production from 1925–26 and a Doctor of Philosophy in drama from 1929–30. The scale of the enterprise was considerable: in an average year the club drew on roughly four hundred students to stage a dozen full-length plays and as many as thirty-six one-acts before audiences of some fifteen thousand.",
            "This activity fed a growing culture of new work. In 1932, Samuel French published the first volume of Cornell Plays, a collection of dramas by students and faculty; among the recipients of the Drummond Playwriting Prize was Sidney Kingsley '28, whose Men in White (1934 Pulitzer), Dead End, The Patriots, and Darkness at Noon would carry the Cornell tradition to the most visible American stages. Drummond's ambitions reached past the campus as well: with the Rockefeller Foundation's sponsorship he founded the New York State Plays Project, sending students into upstate communities to make community-centered performances. His work places him, in the history of American educational theatre, alongside Frederick H. Koch of the Carolina Playmakers and E. C. Mabie of Iowa as a founder of the discipline.",
            "Other arts took root alongside the drama program: dance festivals were staged at least as early as 1926, and in the 1930s Cornell was among the first research universities to draw on the Museum of Modern Art's circulating film library. The institutional structure caught up with the ambition in 1930, when the Board of Trustees formally established Cornell University Theatre as an umbrella body, with Drummond continuing as director.",
            "This era also marked a milestone with key significance. In 1943, Thomas Poag completed his dissertation, The Negro in Drama and Theatre, and departmental records identify him as the first Black scholar in the United States to earn a PhD in theatre studies.",
          ]}
          pullQuote={{ text: "Under Drummond, \"drama blossomed… his productions in the beautiful Willard Straight Theatre were regarded as supreme in the world of academic drama.\"", attribution: "Morris Bishop, A History of Cornell" }}
        />
        </Reveal>

        <Reveal>
        <GalleryGrid
          bg={TAN}
          galleryLabel="Gallery 02"
          title="Inside Willard Straight Theatre"
          description="The program's principal house from 1925 to 1988."
          images={[
            { src: "/scans/jero_01.jpg", caption: "The Jero Plays, dir. David Feldshuh, 1985–86 season. Photo: Jon Crispin." },
            { src: "/scans/hay_fever_01.jpg", caption: "Hay Fever, dir. Stephen Cole, 1982–83 season." },
            { src: "/scans/tii_01.jpg", caption: "The Imaginary Invalid, dir. John Rainey, 1982–83 season." },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-iii"
          chapterLabel="Chapter III"
          title="Mid-Century Consolidation"
          dates="1947 – 1967"
          leadParagraph={'Drummond\'s retirement in 1947 inaugurated a period of transition. Walter H. Stainton, who had been Drummond\'s "closest aide and theater technician," and who had been teaching film during Drummond\'s later years, directed Cornell University Theatre from 1947 to 1952. George McCalmon followed, serving until his death in 1965. McCalmon’s contributions continued to be remembered through the Heermans–McCalmon Playwriting Competition, which was named in his honor.'}
          paragraphs={[
            "A film program entered the curriculum in 1953. In 1967 the Department of Theatre Arts was formally established as an independent academic unit, bringing together the producing functions of Cornell Theatre with the academic programs in dramatic literature, theatre history, criticism, and theory.",
            "The film program that had entered the curriculum in 1953 found its defining figures in the decades that followed. Donald Fredericksen arrived in 1971 as a professor of film and became the founding figure of film studies in the department, teaching for more than forty years until his death in 2015; the department and Cornell Cinema later marked his life with a memorial screening of Ingmar Bergman's Persona. Marilyn Rivchin joined in 1979 to teach filmmaking, anchoring the production side of the program through 2012, so that film was studied at Cornell both as an object of scholarship and as a practice.",
            "Production records for this period are uneven, and a comprehensive chronology of CDC and CU Theatre productions between roughly 1947 and 1978 has not been constructed. The graduate programs benefited from one of the largest theatre research libraries in the country, with extensive resources including the George Jean Nathan and Wason collections."
          ]}
        />
        </Reveal>
        <Reveal><ChapterIVSection /></Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-v"
          chapterLabel="Chapter V"
          title="The New Home: Planning, Construction & Arrival"
          dates="1979 – 1989"
          leadParagraph="The Center for Theatre Arts took a decade to move from a fundraising ambition to a working home in Collegetown. In September 1984, David Feldshuh was appointed the first Artistic Director of Theatre Cornell, a position created as part of the institutional preparation for the building."
          paragraphs={[
            "Between 1984 and the opening of the new building, Feldshuh directed the productions that defined the late pre-Schwartz years.",
            "Stephen Kanee's production of Molière's Scapin in spring 1988 was the last production mounted in the department's traditional performance spaces before the move to the Center for Theatre Arts.",
            "By the early 1980s, drama was confined to the aging Willard Straight Theatre and a makeshift Lincoln Hall studio, with no connected rehearsal, costume, or construction facilities. President Frank Rhodes made a new theatre-arts building a top fundraising priority in 1979; every dollar would have to be raised externally.",
            "James Stirling, Michael Wilford & Associates received the commission in 1982. Construction began in October 1984 on the Cascadilla Gorge site and the building was formally dedicated on April 10, 1989, after a longer-than-projected build.",
            "The completed center united a 500-seat proscenium theatre, flexible theatre, black box, film forum, studios, shops, and a production environment for theatre, dance, and film under one roof.",
          ]}
          subsections={[
            { label: "Planning and funding", title: "A project built by a wide coalition", body: "Austin Kiplinger '39, Gordon Davidson '56, Christopher Reeve '74, Beatrice Straight, Jennifer Tipton, and other alumni helped guide the campaign. Named gifts supported the Pavilion, Garden, Ames Film Production Studio, Greenroom, Gannett Plaza, and Flexible Theatre." },
          ]}
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          bg={TAN}
          galleryLabel="Gallery 03 · Slideshow"
          title="Productions of the 1980s"
          description="Mainstage work of the final pre-Center decade, 1982–85."
          slides={productions80sSlides}
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          galleryLabel="Gallery 04 · Slideshow"
          title="The Jero Plays"
          description="Feldshuh's 1985–86 production of Wole Soyinka's The Jero Plays, photographed by Jon Crispin. The full set is in Productions."
          slides={jeroSlides}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-vi"
          chapterLabel="Chapter VI"
          title="The Program Before the Center"
          dates="c. 1980s"
          aside={[
            { label: "800+", text: "Students from engineering, economics, biology, ILR, and other fields taking courses and taking part in dramatic activity each year, President Frank Rhodes, 1989." },
          ]}
          leadParagraph={'Theatre Cornell was the producing arm of the Department of Theatre Arts. Its planners described the available facilities as inadequate, but productions continued to serve as laboratories for learning and performance.'}
          paragraphs={[
            "The academic program was built on a liberal-arts model. Undergraduates studied theatre arts or dance alongside broad courses in theatre, acting, design, film, and criticism; graduate study ranged from interdisciplinary MA and PhD work to focused MFAs in acting, directing, and design/technology.",
            "Dance and film extended that range. Dance offered modern, ballet, jazz, composition, history, anatomy, and global forms; film combined a two-year foundation course, independent majors by petition, and an international partnership in Paris.",
            "The Cornell Dance Series, established in 1978, brought professional companies to campus each season, including the Mark Morris Dance Group, the Stars of the Canadian Ballet, the Dan Wagoner Dancers, and the New York Baroque Dance Company. Spring Dance concerts gave students a parallel performance platform before the Center opened.",
            "The program remained physically scattered: drama in Willard Straight Hall and Lincoln Hall, dance in Helen Newman Hall, and film in improvised space. That fragmentation, and the lack of dedicated rehearsal and production facilities, made the new center necessary.",
          ]}
          subsections={[
            { label: "Theatre Cornell Outreach", title: "Three streams of outreach", body: "Under Janet Salmons-Rue, Theatre Cornell used theatre as an educational resource on campus and in the community through school residencies, dramatizations of social issues, and improvisational training. How to Get What You Want, But Not More Than You Bargained For, developed with Andrea L. Parrot and John Simon of the Ithaca Men's Network, used an acquaintance-rape scenario followed by discussion." },
          ]}
          beforeSubsections={
            <DanceFeature
              title="Dance Before the Center"
              description="Spring Dance concerts of 1985 and 1987, and the New York Baroque Dance Company on the Cornell Dance Series."
              note="The Cornell Dance Series, begun in 1978, brought professional companies to campus every season."
              slides={danceSlides}
              integrated
            />
          }
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          galleryLabel="Gallery 10 · Slideshow"
          title="From the Archive"
          description="Posters, press clippings, portraits, and photographs from the department's files, c. 1986–1989."
          slides={archiveSlides}
        />
        </Reveal>
       </div>

        <Reveal><Closing /></Reveal>
      </div>
    </div>
  );
}
