import React, { useState, useEffect, useRef } from "react";
import { pageZoom } from "../lib/scale";
import SharedNav from "../components/layout/Nav";
import ChapterRail from "../components/ui/ChapterRail";
import { useIsMobile } from "../lib/useIsMobile";
import Cornell_Logo   from "../assets/Cornell_Logo.png";

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
    src: `/scans-sz/${prefix}_${String(start + k).padStart(2, "0")}.jpg`,
    caption,
  }));

const inauguralSlides = [
  ...scan("marat", 3, "Marat/Sade, dir. Bruce Levitt, Proscenium Theatre, 1989–90. Photo: Patricia Reynolds."),
  ...scan("cyrano", 2, "Cyrano de Bergerac, 1989–90. Photo: Patricia Reynolds."),
  ...scan("alice", 2, "A… My Name Is Alice, 1989–90. Photo: Patricia Reynolds."),
  ...scan("railroad", 1, "The Dance and the Railroad, 1989–90. Photo: Patricia Reynolds."),
  ...scan("frogprince", 1, "The Frog Prince, 1989–90. Photo: Patricia Reynolds."),
  ...scan("dance90", 1, "Dance Concert '90, Proscenium Theatre. Photo: Patricia Reynolds."),
];

const earlyNinetiesSlides = [
  ...scan("westside", 3, "West Side Story, dir. & choreo. Keith Grant, 1990–91. Photo: Patricia Reynolds."),
  ...scan("streetcar", 2, "A Streetcar Named Desire, dir. Bruce Levitt, 1990–91. Photo: Patricia Reynolds."),
  ...scan("noisesoff", 2, "Noises Off, 1990–91. Photo: Patricia Reynolds."),
  ...scan("vinegartom", 1, "Caryl Churchill's Vinegar Tom, 1990–91. Photo: Patricia Reynolds."),
  ...scan("talespinners", 1, "Talespinners, 1990–91. Photo: Patricia Reynolds."),
  ...scan("beehive", 1, "Dance Concert with Jim Self and Frank Moore's Beehive, 1990–91."),
];

const tenthAnniversarySlides = [
  ...scan("salesman", 2, "Death of a Salesman (with Harold Gould '48), dir. David Feldshuh, 1997–98."),
  ...scan("ynct", 1, "You Never Can Tell, 1997–98. Photo: Charles Harrington."),
  ...scan("flea", 1, "A Flea in Her Ear, 1998–99. Photo: Charles Harrington."),
  ...scan("equus", 2, "Equus, 1998–99. Photo: Charles Harrington and others."),
  ...scan("twelfthnight", 1, "Twelfth Night, 1998–99. Photo: Nicola Kountoupes and others."),
  ...scan("brecht", 1, "The Brecht Project, 1998–99. Photo: Charles Harrington and others."),
  ...scan("clink", 1, "The Clink, 1998–99. Photo: Charles Harrington and others."),
  ...scan("twilight", 1, "Twilight: Los Angeles, 1992, dir. Benny Sato Ambush, 1998–99."),
];

const twoThousandsSlides = [
  ...scan("merchant", 4, "The Merchant of Venice, dir. Robert Kalfin, 2004–05."),
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
  inlineImage?: { src: string; caption: string; position?: string };
  afterParagraphs?: React.ReactNode;
  id?: string;
}

function ChapterSection({ chapterLabel, title, dates, leadParagraph, paragraphs = [], pullQuote, subsections = [], aside, bg = TAN, inlineImage, afterParagraphs, id }: ChapterProps) {
  const isDark  = bg === DARK;
  const bodyClr = isDark ? "#b8b8c2" : ESPRESSO;
  const muteClr = isDark ? "#6b6b70" : MUTED;
  const ruleClr = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

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
                style={{ width: "100%", maxHeight: 480, objectFit: "cover", objectPosition: inlineImage.position ?? "center", borderRadius: 2, display: "block" }}
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
          {afterParagraphs}
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
        src="/schwartzinside.jpg"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 62%" }}
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
              Section II of III · 1988–2010
            </p>
          </div>
          <h1 style={{
            fontFamily: "Saira Condensed, sans-serif",
            fontSize: mobile ? 33 : 58, fontWeight: 800, lineHeight: mobile ? "34px" : "54px",
            letterSpacing: "0.3px", color: "#fff",
            textTransform: "uppercase", margin: 0, maxWidth: 860,
          }}>
            Theatre at Cornell, The Schwartz Years
          </h1>
        </div>
      </div>
    </div>
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



const CHAPTERS = [
  { n: "I",    title: "A New Home and a New Era",                   dates: "1988 – 1989",  id: "chapter-i"   },
  { n: "II",   title: "The Inaugural Season",                       dates: "1989 – 1990",  id: "chapter-ii"  },
  { n: "III",  title: "The Producing Model and the Working Company", dates: "1988 – 1999",  id: "chapter-iii" },
  { n: "IV",   title: "Repertoire and Range",                       dates: "1988 – 1999",  id: "chapter-iv"  },
  { n: "V",    title: "Dance and Film in the New Building",          dates: "1988 – 2000",  id: "chapter-v"   },
  { n: "VI",   title: "Outreach and Applied Theatre",               dates: "1988 – 2010",  id: "chapter-vi"  },
  { n: "VII",  title: "National Profile, Feldshuh and Miss Evers",  dates: "1989 – 1997",  id: "chapter-vii" },
  { n: "VIII", title: "The Schwartz Naming and the New Century",    dates: "2001",         id: "chapter-viii" },
  { n: "IX",   title: "Production in the 2000s and the Close of an Era", dates: "2001 – 2010", id: "chapter-ix"  },
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
            This section follows the first two decades in the Center for Theatre Arts, from its opening in 1989 to the budget reductions of 2010.
          </p>
          <p style={{ fontSize: 16, lineHeight: "26px", letterSpacing: "-0.05px", color: ESPRESSO_SOFT, marginBottom: 56, maxWidth: 720 }}>
            With a dedicated home, the department brought production, teaching, dance, film, and visiting artists together. It also established the conditions that the next section examines: a large operation shaped by later cuts.
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
              The account through 1998–99 is based on production playbills in the project collection. The 2000s draw on the Cornell Chronicle and the Cornell Daily Sun and will be expanded as archival materials are added.
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


function ChapterIIISection() {
  const BT: React.CSSProperties = { fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: ESPRESSO, textAlign: "justify", marginBottom: 18 };
  const SH: React.CSSProperties = { fontFamily: SERIF, fontSize: 17, fontWeight: 600, letterSpacing: "-0.15px", lineHeight: "24px", color: ESPRESSO, marginBottom: 10 };

  const topStats = [
    { num: "120+",   label: "Public performances per year, 1992-93 season" },
    { num: "54",     label: "Faculty and staff in the department" },
    { num: "50,000+", label: "Student work hours per season" },
  ];

  return (
    <section id="chapter-iii" style={{ background: TAN, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 0 80px" }}>
            <p style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.84px", textTransform: "uppercase", color: MUTED, lineHeight: "16px", marginBottom: 15 }}>
              Chapter III
            </p>
            <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: "32px", color: ESPRESSO, marginBottom: 15 }}>
              The Producing Model and the Working Company
            </h2>
            <p style={{ fontSize: 10, letterSpacing: "0.13px", lineHeight: "17px", color: MUTED, marginBottom: 32 }}>1988 – 1999</p>
            <p style={{ ...BT, marginBottom: 40 }}>
              {`A central feature of theatre at Cornell in this era was its hybrid producing ` +
              `model, in which undergraduates worked beside professional artists in residence. The ` +
              `Resident Professional Theatre Associates were, generally, Equity actors who came to ` +
              `campus to teach, mentor, and perform in mainstage productions, sharing the stage with ` +
              `students cast in major roles.`}
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
              <p style={{ ...SH, marginBottom: 10 }}>The Faculty, A Stable Core</p>
              <p style={BT}>
                {`The faculty rosters across the period show how little the ` +
                `production core changed. From the opening through the 2000s, the playbills list, ` +
                `season after season, the same nucleus of artist-teachers: David Feldshuh as professor ` +
                `and artistic director, Bruce Levitt (directing and acting), Ron Wilson (acting, and later ` +
                `playwriting and screenwriting), Keith Grant (acting, movement, and musical theatre), and ` +
                `the later-arriving Stephen R. Cole (acting and directing).`}
              </p>
              <p style={BT}>
                {`The production and design faculty were equally constant: Daniel C. Hall (production ` +
                `supervisor and technical director), Richard Archer (technical director), Judith Johnson ` +
                `(resident costume designer), Chuck Hatcher (resident sound designer), Pamela Guion and ` +
                `later Pamela Lillard in production stage management, and Alison Van Dyke (speech and ` +
                `acting, and director of undergraduate studies). The dance faculty held steady around ` +
                `Joyce Morgenroth as program coordinator, with Jim Self, Jumay Chu, Janice Kovar, June ` +
                `Finch, Peter Saul, and the composer and accompanist Allen Fogelsanger; film rested ` +
                `throughout with Marilyn Rivchin and Don Fredricksen.`}
              </p>
              <p style={BT}>
                {`Around this stable core, three kinds of change are visible. The first is in departmental ` +
                `leadership, which passed through several hands while the artistic directorship never ` +
                `changed: Levitt was chair at the start of the 1990s; by the 1995-96 season the ` +
                `chairmanship had moved to David Bathrick (theatre and film studies), who held it through ` +
                `the 2001 naming; and by November 2002 the chair was the scenic designer Kent Goetz.`}
              </p>
              <p style={BT}>
                {`The second change is a generational turnover in design, as the early resident designers ` +
                `Jill Moon (scenery) and Patrick Gill (lighting), with Cyndi Orr in the costume shop, gave ` +
                `way by the mid-1990s to Goetz as resident scenic designer, E. D. Intemann as resident ` +
                `lighting designer, and Cynthia Orr Brookhouse as costume shop manager. The third, and ` +
                `important for the department's intellectual identity, is a turnover among the ` +
                `theatre-studies faculty: the early rosters list nationally prominent scholars including ` +
                `the dance historian Sally Banes, the philosopher and aesthetician Noel Carroll, and the ` +
                `theatre scholars Michael Hays and David Bathrick, while the later rosters feature Jutka ` +
                `Devenyi, the performance-studies scholar Rebecca Schneider, the film and women's-studies ` +
                `scholar Amy Villarejo, and, in dance, Byron Suber.`}
              </p>
            </div>

            <div style={{ marginTop: 46, paddingTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <p style={{ ...SH, marginBottom: 10 }}>The Resident Company, A Rotating Ensemble</p>
              <p style={BT}>
                {`Associates were conservatory-trained, frequently Equity, actors brought to Ithaca on ` +
                `residencies of one to three years to teach and to perform leading roles beside ` +
                `undergraduates. Their bios read as a survey of the American training pipeline and ` +
                `regional theatre of the period, with M.F.A. degrees from UC San Diego, Yale, Boston ` +
                `University, and Carnegie Mellon and prior engagements at the Guthrie, the Intiman, ` +
                `A Contemporary Theatre, the Actors Theatre of Louisville, and the Alabama and Illinois ` +
                `Shakespeare Festivals.`}
              </p>
              <p style={BT}>
                {`The inaugural-season company documented in the 1989-90 playbills included Tom Spivey ` +
                `(the title role in Marat/Sade), Randy Braunberger, Sheree Galpert, Chiffonye Cobb, and ` +
                `John Beumler. By the tenth-anniversary season of 1998-99 the resident company had turned ` +
                `over entirely, to Kevin Connell, Daryll Heysham, Steve Brady, Dennis Fox, Joyce Lee, and ` +
                `Nancy Lipschutz.`}
              </p>
              <p style={BT}>
                {`In the later 1990s, the department formalized a mechanism for drawing on its own ` +
                `graduates. Through a guest-artist fund created by Harold Bank and the Class of 1965, ` +
                `the department began bringing alumni back to work beside current students. ` +
                `Feldshuh's program notes record the return of set designer Sarah Lambert '85 (by then ` +
                `known for Gross Indecency: The Three Trials of Oscar Wilde) and directors Will ` +
                `Pomerantz '84 and Beth Milles '88, the last of whom, after directing Mad Forest in 1994, ` +
                `returned repeatedly in the 2000s to stage The Miser, Inherit the Wind, and other productions.`}
              </p>
              <p style={BT}>
                {`The pattern of guest engagement widened in the 2000s to include nationally known ` +
                `directors from outside Cornell: the performance theorist and director Richard Schechner ` +
                `(Waiting for Godot, 2001-02), Robert Kalfin (Othello), Randy Reinholz (The Rez Sisters), ` +
                `and Richard Hamburger (The Government Inspector). The long-term value of the training ` +
                `model is visible in the careers that began here, including the director ` +
                `Sam Gold '00, later a Tony Award winner, who appears in the period directing in the Black ` +
                `Box Series and serving as assistant director on The Bald Soprano and The Lesson.`}
              </p>
            </div>
            <NotesGrid notes={[
              { label: "Education by doing", text: "In a program note for the tenth-anniversary season, Levitt reported that since the building opened, more than seven hundred roles had been played by undergraduates and dance concerts had supplied an additional four hundred performance opportunities." },
              { label: "A cross-campus body", text: "Student biographies record performers and crew majoring in government, economics, biology, electrical engineering, industrial and labor relations, and human ecology alongside expected theatre arts majors." },
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
          By 2010, budget reductions brought this period of expansion to an end and set the stage for the department's restructuring.
        </p>
      </section>

      <section style={{ background: "#141417", padding: mobile ? "56px 20px" : "84px 90px 84px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 0.7fr", gap: mobile ? 40 : 80, maxWidth: 1320 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8a8a93", marginBottom: 16, lineHeight: "16px" }}>
              About this exhibition
            </p>
            <p style={{ fontSize: 12, lineHeight: "20px", letterSpacing: "-0.02px", color: "#eef0f2", marginBottom: 36, maxWidth: 520 }}>
              {`Prepared as the second of three sections in an institutional history of theatre at Cornell. ` +
              `The account through 1998-99 rests on production playbills in the project collection. ` +
              `The 2000s draw on the Cornell Chronicle and Cornell Daily Sun, and are comparatively ` +
              `summary pending the addition of archival materials.`}
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
                <>· Production playbills, Dance Concert '89 through the 1998-99 season (project collection)</>,
                <>· Cornell Chronicle: building renaming (2001), twentieth anniversary (2009), budget cuts (2010)</>,
                <>· Cornell Daily Sun: budget cuts, restructuring, and department response (2010-2012)</>,
                <>· An American Festival program (September 1989); Center Stage departmental newsletter (c. 1990)</>,
                <>· David M. Feldshuh, <em>Miss Evers' Boys</em> (Dramatists Play Service)</>,
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

export default function SchwartzPage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
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
          title="A New Home and a New Era"
          dates="1988 – 1989"
          inlineImage={{ src: "/scans-sz/sc_building_02.jpg", caption:
            `The Center for Theatre Arts on College Avenue in Collegetown, 1989, ` +
            `featuring the department's American Festival banner.`
          }}
          leadParagraph={
            `The opening of the Center for Theatre Arts gave the department a dedicated home. Until then, productions were staged mainly in the Willard Straight Theatre and the makeshift Drummond Studio in Lincoln Hall.`
          }
          paragraphs={[
            `The new building, on the southern rim of Cascadilla Gorge in Collegetown, gathered ` +
            `theatre, dance, and film under one roof for the first time, behind marble walls that ` +
            `enclosed a complete production environment of stages, studios, shops, and editing suites. ` +
            `The building was formally dedicated on April 10, 1989, though productions were mounted ` +
            `in it before the dedication.`,

            `The first public event on the new proscenium stage was Dance Concert '89, presented ` +
            `March 9 to 11, 1989, several weeks before the formal dedication. David Feldshuh served as artistic director from before the building was completed until his retirement in 2011. Professor Bruce Levitt reported that by the tenth-anniversary season of 1998-99, the number of theatre majors had tripled and course enrollments had doubled.`,
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-ii"
          chapterLabel="Chapter II"
          title="The Inaugural Season and An American Festival"
          dates="1989 – 1990"
          leadParagraph={
            `The building's first full season opened not with a single production but with a ` +
            `ten-day festival. An American Festival: A Celebration of Heritage, Community, and ` +
            `the Arts ran from September 17 to 27, 1989, presented by the Department of Theatre ` +
            `Arts in cooperation with the national American Festival Project.`
          }
          paragraphs={[
            `Ten visiting theatre, dance, and music companies gathered in Ithaca: A Traveling ` +
            `Jewish Theatre, El Teatro de la Esperanza, Francisco Gonzalez, the Junebug Theater ` +
            `Project, Carlos Nakai, Liz Lerman's Dance Exchange, the Roadside Theater, Robbie ` +
            `McCauley and Company, and Urban Bush Women. By the department's account, the ` +
            `festival drew more than five thousand people to twenty performances over five evenings.`,

            `In his note for the inaugural season, Feldshuh announced several initiatives that ` +
            `would shape the era: the Exploration Series, two or more presentations of a single ` +
            `playwright, genre, period, or theme; ` + 
            `the commissioning of new work; and the Advanced Undergraduate Theatre ` +
            `Program, in which selected seniors were given plays to direct, design, or act in, ` +
            `working alongside the Resident Professional Teaching Associates.`,
          ]}
          aside={[
            { label: "The Exploration Series",
              text: "The inaugural Exploration Series featured a full production of Peter Weiss's Marat/Sade, accompanied by staged readings of Georg Büchner's Danton's Death and Heiner Müller's Quartet." },
            { label: "Five thousand",
              text: "The audience count reported by the department's Center Stage newsletter for the American Festival, over twenty performances in five evenings." },
          ]}
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          bg={TAN}
          galleryLabel="Gallery 01 · Slideshow"
          title="The Inaugural Season on Stage"
          description="The first productions mounted in the new building, 1989–90. Photographs by Patricia Reynolds; the full sets are in Productions."
          slides={inauguralSlides}
        />
        </Reveal>
        <Reveal><ChapterIIISection /></Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-iv"
          chapterLabel="Chapter IV"
          title="Repertoire and Range"
          dates="1988 – 1999"
          leadParagraph={
            `Across two decades in the building, the seasons balanced classical repertory, twentieth-century drama, politically engaged work, musicals, and new plays. Shakespeare was a constant, at least a dozen productions over the period, beside the comic repertory of Behn, Congreve, Wilde, Moliere, Sheridan, and Feydeau, and the recurring moderns: Williams, Miller, Chekhov, Mamet, Brecht, and Shaw.`
          }
          paragraphs={[
            `The era was equally marked by contemporary and politically charged drama. The ` +
            `Exploration Series opened with Weiss's Marat/Sade (1989) and a Tennessee Williams ` +
            `series anchored by Streetcar (1990-91). The department staged Athol Fugard's ` +
            `My Children! My Africa! (1992), Brecht in several guises (The Caucasian Chalk Circle, ` +
            `The Resistible Rise of Arturo Ui, The Good Person of Setzuan, and the devised Brecht ` +
            `Project), Caryl Churchill's Mad Forest (1994), Tony Kushner's Angels in America, Part ` +
            `Two: Perestroika (1996), and a steady stream of recent writing by Christopher Durang, ` +
            `Tomson Highway, Wendy Wasserstein, Alan Ball, Jenny Schwartz, and others. Documentary ` +
            `and verbatim theatre figured prominently through two productions of Anna Deavere ` +
            `Smith's work: Fires in the Mirror (1995-96) and Twilight: Los Angeles, 1992 (1998-99).`,

            `Musicals and music-theatre ran throughout, from West Side Story and Cabaret (both ` +
            `directed and choreographed by Keith Grant) to Sondheim's Company, the Marx Brothers ` +
            `vehicle The Cocoanuts, Baby, and large-scale music-theatre events culminating in ` +
            `Leonard Bernstein's Mass (2009), staged with some 130 performers, and the department's production of Feldshuh's Miss Evers' Boys in the Proscenium Theatre, a late-summer staging supported by a grant.`,
          ]}
          subsections={[
            { label: "Classical Repertory", title: "Shakespeare and the comic tradition",
              body: `As You Like It (twice), Measure for Measure, Richard III, Romeo and Juliet (twice), The Taming of the Shrew, Hamlet, The Comedy of Errors, The Winter's Tale, Twelfth Night, The Merchant of Venice, and Othello, alongside Behn's The Rover, Congreve's The Way of the World, Wilde's The Importance of Being Earnest, and Moliere's Tartuffe and The Miser.` },
            { label: "American and European voices", title: "A continuing presence",
              body: `Williams (A Streetcar Named Desire, The Glass Menagerie, The Night of the Iguana), Miller (Death of a Salesman, A View from the Bridge, All My Sons), Chekhov (The Cherry Orchard, The Three Sisters), Guare (The House of Blue Leaves), and a cluster of Mamet (Speed the Plow, Oleanna). Brecht appeared in four distinct productions.` },
          ]}
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          galleryLabel="Gallery 02 · Slideshow"
          title="The Early Nineties on Stage"
          description="The 1990–91 season across the building's stages. Photographs by Patricia Reynolds; the full sets are in Productions."
          slides={earlyNinetiesSlides}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-v"
          bg={TAN}
          chapterLabel="Chapter V"
          title="Dance and Film in the New Building"
          dates="1988 – 2000"
          leadParagraph={
            `The building's design treated dance and film as full partners with theatre, ` +
            `and both developed substantially over the period. The dance faculty presented ` +
            `an annual concert of new faculty and student choreography, and the playbills ` +
            `record regular concerts on the proscenium stage from ` +
            `Dance '89 through Dance Concert '09, several built around guest artists-in-residence ` +
            `and around new work such as Jim Self and Frank Moore's ballet Beehive, previewed ` +
            `in 1990 and given in full in 1991.`
          }
          paragraphs={[
            `The program also presented a Dance Series of visiting professional companies for ` +
            `performances and master classes, showcasing ` +
            `American and international dance. In the 1990s: the Limon Dance Company (1997, in its ` +
            `fiftieth-anniversary year) and the Martha Graham Dance Company (1998). In the 2000s: ` +
            `the Merce Cunningham Dance Company, the Mark Morris Dance Group, David Gordon, Garth ` +
            `Fagan Dance, the Stephen Petronio Company, Rennie Harris Puremovement, and visiting ` +
            `companies from Beijing, Burkina Faso (Salia ni Seydou), and the classical Indian ` +
            `Orissa tradition. At the end of the 1990s, the dance program reorganized its technique ` +
            `curriculum and introduced new courses such as Byron Suber's "Technology and Choreography."`,

            `Film was embedded in the department from the opening, with editing and production ` +
            `suites, the Film Forum, and the faculty of Marilyn Rivchin and Don Fredricksen. ` +
            `By the mid-1990s the unit's name had broadened to the Department of Theatre, Film and Dance.`,
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-vi"
          chapterLabel="Chapter VI"
          title="Outreach and Applied Theatre, CITE and Theatre Cornell"
          dates="1988 – 2010"
          aside={[
            { label: "CITE founded",
              text: "The Cornell Interactive Theatre Ensemble, founded January 1992." },
          ]}
          leadParagraph={
            `Beyond its public seasons, the department maintained an active outreach and ` +
            `applied-theatre practice. Theatre Cornell Outreach, directed by Janet Salmons-Rue, ` +
            `used theatre as an educational resource, from presentations of Shakespeare for ` +
            `schoolchildren to improvisational role-play that helped train counselors.`
          }
          paragraphs={[
            `In January 1992, the department founded the Cornell Interactive Theatre Ensemble ` +
            `(CITE) as a resource for workplace and human-relations training. Combining live ` +
            `performance with audience participation to address questions of race, gender, sexual ` +
            `orientation, harassment, disability, and other workplace issues, CITE designed ` +
            `programs for corporations, government agencies, hospitals, and other institutions ` +
            `across the country, and its associate directors are credited in the dance and theatre ` +
            `playbills throughout the decade.`,
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-vii"
          bg={TAN}
          chapterLabel="Chapter VII"
          title="National Profile, David Feldshuh and Miss Evers' Boys"
          dates="1989 – 1997"
          inlineImage={{
            src: "/scans-sz/missevers2.jpg",
            position: "center top",
            caption: "Miss Evers' Boys, David Feldshuh's play of the U.S. Public Health Service's Tuskegee study, in the Illusion Theater production.",
          }}
          leadParagraph={
            `The department's national profile rested largely on its artistic director, who held both a doctorate in theatre and an M.D. with board certification in emergency medicine.`
          }
          paragraphs={[
            `Feldshuh's play Miss Evers' Boys, which dramatizes the United States Public Health ` +
            `Service's notorious forty-year Tuskegee study of untreated syphilis in Black men, ` +
            `was a finalist for the 1992 Pulitzer Prize in Drama. The play was developed at the ` +
            `Illusion Theater in Minneapolis and at Robert Redford's Sundance Institute, where it ` +
            `received the New American Play Award, and was first produced at Center Stage in ` +
            `Baltimore in 1989.`,

            `In 1997, an HBO film adaptation brought the work to a national audience, drawing ` +
            `numerous Emmy nominations and several wins along with NAACP Image, CableACE, and ` +
            `Golden Globe recognition. University and reference accounts credit the public attention surrounding the film with helping to bring about President Bill Clinton's formal apology to the survivors of the Tuskegee study that same year.`,
          ]}
          pullQuote={{
            text: `"Practical, theatrical, and, as many remind me, controversial." Feldshuh's ` +
                  `description of the new building in his program note for Dance Concert '89.`,
            attribution: "David Feldshuh, program note, Dance Concert '89, March 1989",
          }}
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          galleryLabel="Gallery 03 · Slideshow"
          title="The Tenth-Anniversary Seasons"
          description="Mainstage work of the 1997–99 seasons, the building's tenth-anniversary years. The full sets are in Productions."
          slides={tenthAnniversarySlides}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-viii"
          chapterLabel="Chapter VIII"
          title="The Schwartz Naming and the New Century"
          dates="2001"
          leadParagraph={
            `In 2001 the building acquired its lasting name: on October 19 it was dedicated as the Sheila W. and Richard J. Schwartz Center for the Performing Arts.`
          }
          paragraphs={[
            `The naming recognized a gift from the longtime Cornell benefactors. Richard J. ` +
            `Schwartz, Cornell Class of 1960 and a member of the Board of Trustees since 1989, ` +
            `was at the time chairman of the New York State Council on the Arts. The ceremony, ` +
            `held in the building's proscenium house (by then named the Kiplinger Theatre for ` +
            `Austin Kiplinger '39), featured a student dance performance, a student film clip, ` +
            `and a video scene from the department's sold-out spring 2001 production of Amadeus.`,
          ]}
          subsections={[
            { label: "Named spaces", title: "Gifts that shaped the building",
              body: `The Kiplinger Theatre (Austin Kiplinger '39), the Ames Film Production Studio ` +
                    `(Steven Ames '64), the Greenroom (Herbert Gussman), the Flexible Theatre ` +
                    `(the Class of 1956), the Pavilion (Bruce Eissner '65), Gannett Plaza ` +
                    `(the Gannett Foundation), and the Garden (the Fillo family).` },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-ix"
          bg={TAN}
          chapterLabel="Chapter IX"
          title="Production in the 2000s and the Close of an Era"
          dates="2001 – 2010"
          leadParagraph={
            `The first decade of the new century shows the producing model in operation: ` +
            `six to eight productions a season across the Kiplinger Theatre, the Class of '56 ` +
            `Flexible Theatre, and the Black Box, supported by the resident company and an ` +
            `expanding roster of guest and alumni directors.`
          }
          paragraphs={[
            `Feldshuh continued to direct major works, including The Matchmaker, The Resistible ` +
            `Rise of Arturo Ui, The Merchant of Venice, and Bernstein's Mass, and to create new ` +
            `adaptations for the campus. In 2003 he wrote and directed an Antigone for Cornell's ` +
            `New Student Reading Project with an original score; the production was filmed and ` +
            `broadcast on regional public television the following year. Levitt directed Shakespeare ` +
            `and large ensemble pieces (Hamlet, Grapes of Wrath, The Cocoanuts, The Bourgeois ` +
            `Gentleman), while the resident director Stephen Cole took on a strand of sharp ` +
            `contemporary comedy and Ayckbourn (Betty's Summer Vacation, Bee-Luther-Hatchee, ` +
            `Comic Potential, Bedroom Farce).`,

            `The guest-artist and alumni program brought in Will Pomerantz '84 (The Taming of ` +
            `the Shrew, Company), Beth Milles '88 (The Miser, Inherit the Wind, Vital Signs), ` +
            `and a series of nationally known directors, while honors and graduate students ` +
            `continued to direct in the studios. The repertoire of the decade ranged from ` +
            `Sophocles, Moliere, and Shakespeare through Miller, Williams, and Sondheim to recent ` +
            `work by Christopher Durang, Tomson Highway, Wendy Wasserstein, Alan Ball, and Jenny ` +
            `Schwartz, alongside large music-theatre undertakings that culminated in the 2009 Mass.`,

            `In January 2009, the department marked the building's twentieth anniversary. University coverage gathered Levitt and Feldshuh's reflections, recounted Herbert Gussman's founding gift, and recorded Levitt's assessment that the center had become a national model for apprenticeship training.`,

            `As the budget reductions were announced, the latest Gourman Report rankings for liberal arts programs in the United States listed Cornell's Theatre program third and its Dance program first.`,

          ]}
          afterParagraphs={
            <>
            <div style={{ margin: "42px 0 28px", padding: "32px 0", borderTop: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "clamp(42px, 12vw, 150px)", flexWrap: "wrap" }}>
                {[{ value: "3", label: "Theatre" }, { value: "1", label: "Dance" }].map(({ value, label }) => (
                  <div key={label} style={{ width: 180, textAlign: "center" }}>
                    <div style={{ width: 128, height: 128, borderRadius: "50%", background: ESPRESSO, color: PAPER, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Saira Condensed, sans-serif", fontSize: 51, fontWeight: 800, lineHeight: 1 }}>
                      {value}
                    </div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ maxWidth: 680, margin: "28px auto 0", textAlign: "center", fontSize: 13, lineHeight: "21px", color: ESPRESSO_SOFT }}>
                Cornell's Theatre and Dance programs received the highest rankings of any departments in the College of Arts and Sciences.
              </p>
            </div>
            <p style={{ fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: ESPRESSO, textAlign: "justify", margin: "0 0 18px" }}>
              In 2010, budget pressure brought the era to its close. The College of Arts and Sciences directed Theatre, Film and Dance to reduce its non-professorial budget; the department responded with a performance-and-media model that consolidated the three majors, reduced the resident-professional program, and ended the standalone dance major. David Feldshuh retired in 2011 after roughly twenty-five years as founding artistic director, and the restructured unit became the Department of Performing and Media Arts.
            </p>
            </>
          }
          subsections={[
            { label: "A legacy", title: "What the era built", body: "From the opening through the budget reductions, the producing operation presented more than a thousand public performances, trained generations of students in a hybrid professional model, and brought a repertoire spanning classical drama, American premieres, Tony Kushner, Anna Deavere Smith, and the Pulitzer-nominated Miss Evers' Boys to Cornell." },
          ]}
        />
        </Reveal>

        <Reveal>
        <GallerySlideshow
          galleryLabel="Gallery 04 · Slideshow"
          title="Production in the 2000s"
          description="The guest-director seasons of the new century, here Robert Kalfin's Merchant of Venice, 2004–05."
          slides={twoThousandsSlides}
        />
        </Reveal>

       </div>

        <Reveal><Closing /></Reveal>
      </div>
    </div>
  );
}
