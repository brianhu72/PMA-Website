import React, { useState, useEffect, useRef } from "react";
import { pageZoom } from "../lib/scale";
import SharedNav from "../components/layout/Nav";
import ChapterRail from "../components/ui/ChapterRail";
import { useIsMobile } from "../lib/useIsMobile";
import Cornell_Logo from "../assets/Cornell_Logo.png";

const ESPRESSO      = "#1b1b1e";
const ESPRESSO_SOFT = "#4c4c52";
const MUTED         = "#8a8a90";
const CARNELIAN     = "#b31b1b";
const SERIF = "'Newsreader', Georgia, serif";
const PAPER         = "#ffffff";
const TAN           = "#ffffff";


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


interface GridImage { src?: string; caption: string }


interface AsideNote { label: string; text: string }

function NotesGrid({ notes }: { notes: AsideNote[] }) {
  const cols = notes.length === 4 ? 2 : Math.min(Math.max(notes.length, 2), 3);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "30px 44px",
      marginTop: 44,
      paddingTop: 26,
      borderTop: "1px solid rgba(0,0,0,0.08)",
    }}>
      {notes.map((n, i) => (
        <div key={i}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, marginBottom: 8, lineHeight: "15px" }}>
            {n.label}
          </p>
          <p style={{ fontSize: 12, lineHeight: "19px", letterSpacing: "-0.027px", color: ESPRESSO_SOFT }}>
            {n.text}
          </p>
        </div>
      ))}
    </div>
  );
}


interface Sub { label: string; title: string; body: string }

function Subsection({ title, body }: Sub) {
  return (
    <div style={{ marginTop: 46, paddingTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <p style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, letterSpacing: "-0.15px", lineHeight: "24px", color: ESPRESSO, marginBottom: 10 }}>
        {title}
      </p>
      <p style={{ fontSize: 13, lineHeight: "20px", letterSpacing: "-0.027px", color: ESPRESSO_SOFT, textAlign: "justify", maxWidth: 900 }}>
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
  inlineImages?: GridImage[];
  bg?: string;
  id?: string;
}

function ChapterSection({ chapterLabel, title, dates, leadParagraph, paragraphs = [], pullQuote, subsections = [], aside, inlineImages, bg = TAN, id }: ChapterProps) {
  return (
    <section id={id} style={{ background: bg, paddingTop: 120, paddingBottom: 80, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.84px", textTransform: "uppercase", color: MUTED, lineHeight: "16px", marginBottom: 15 }}>
          {chapterLabel}
        </p>
        <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: "32px", color: ESPRESSO, marginBottom: 15 }}>
          {title}
        </h2>
        <p style={{ fontSize: 10, letterSpacing: "0.13px", lineHeight: "17px", color: MUTED, marginBottom: 32 }}>
          {dates}
        </p>
        {leadParagraph && (
          <p style={{ fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: ESPRESSO, textAlign: "justify", marginBottom: 18 }}>
            {leadParagraph}
          </p>
        )}
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: "24px", letterSpacing: "-0.027px", color: ESPRESSO, textAlign: "justify", marginBottom: 18 }}>
            {p}
          </p>
        ))}
        {inlineImages && inlineImages.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${inlineImages.length <= 2 ? inlineImages.length : 3}, 1fr)`, gap: 12, marginTop: 34, marginBottom: 20 }}>
            {inlineImages.map((img, i) => (
              <figure key={i} style={{ margin: 0, position: "relative", aspectRatio: "4/3", borderRadius: 2, overflow: "hidden", background: "rgba(0,0,0,0.05)" }}>
                {img.src && <img src={img.src} alt={img.caption} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)", pointerEvents: "none" }} />
                <span style={{ position: "absolute", bottom: 10, left: 10, fontFamily: SERIF, fontSize: 10, color: "rgba(255,255,255,0.82)", fontStyle: "italic" }}>{img.caption}</span>
              </figure>
            ))}
          </div>
        )}
        {pullQuote && (
          <div style={{ marginTop: 48, marginBottom: 48 }}>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, fontWeight: 400, lineHeight: "31px", letterSpacing: "-0.2px", color: ESPRESSO, textAlign: "justify", marginBottom: 12 }}>
              {pullQuote.text}
            </p>
            <p style={{ fontSize: 9, letterSpacing: "0.125px", color: MUTED }}>
              {pullQuote.attribution}
            </p>
          </div>
        )}
        {subsections.map(sub => (
          <Subsection key={sub.label} {...sub} />
        ))}
        {aside && aside.length > 0 && <NotesGrid notes={aside} />}
      </div>
    </section>
  );
}


function Hero() {
  const mobile = useIsMobile();
  return (
    <div style={{ position: "relative", width: "100%", height: mobile ? 320 : 440, overflow: "hidden", backgroundColor: "#0b0b0e" }}>
      <img
        src="/schwartzcenterlong.webp"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }}
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
              Section III of III · 2010–Present
            </p>
          </div>
          <h1 style={{
            fontFamily: "Saira Condensed, sans-serif",
            fontSize: mobile ? 33 : 58, fontWeight: 800, lineHeight: mobile ? "34px" : "54px",
            letterSpacing: "0.3px", color: "#fff",
            textTransform: "uppercase", margin: 0, maxWidth: 860,
          }}>
            Theatre at Cornell, The Emergence of PMA
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
  { n: "I",   title: "The Reckoning and Rebuild",                dates: "2009–2013", id: "chapter-i"    },
  { n: "II",  title: "How a Season Worked",                      dates: "2010–2020", id: "chapter-iii"  },
  { n: "III", title: "Theatre Beyond the Campus",                dates: "2009–2022", id: "chapter-v"    },
  { n: "IV",  title: "Translation and the Global Turn",          dates: "2012–2020", id: "chapter-vi"   },
  { n: "V",   title: "Interruption and Improvisation",           dates: "2019–2022", id: "chapter-vii"  },
  { n: "VI",  title: "Rebuilding",                               dates: "2022–2026", id: "chapter-viii" },
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
          This section follows the department after the 2010 budget reductions, including the 2012 transition from Theatre, Film and Dance to Performing and Media Arts.
        </p>
        <p style={{ fontSize: 16, lineHeight: "26px", letterSpacing: "-0.05px", color: ESPRESSO_SOFT, marginBottom: 56, maxWidth: 720 }}>
          It traces how the department reorganized its programs and continued work across theatre, dance, film, and media.
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
            This section draws on fifty-six production and event playbills from 2010/11 through 2022/23, supplemented by published sources for the 2010 budget crisis, the Phoenix Players at Auburn, and events after 2023. When sources differ, the archive is used for the production record.
          </p>
        </div>
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
          The period ended with a reorganized department that continued to support work across theatre, dance, film, and media.
        </p>
      </section>

      <section style={{ background: "#141417", padding: mobile ? "56px 20px" : "84px 90px 84px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 0.7fr", gap: mobile ? 40 : 80, maxWidth: 1320 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8a8a93", marginBottom: 16, lineHeight: "16px" }}>
              About this exhibition
            </p>
            <p style={{ fontSize: 12, lineHeight: "20px", letterSpacing: "-0.02px", color: "#eef0f2", marginBottom: 36, maxWidth: 520 }}>
              The third of three sections, rebuilt against fifty-six production and event playbills for the seasons 2010/11 through 2022/23, with published sources for the 2010 budget crisis, the Phoenix Players at Auburn, and events after 2023. Where the archive and the reporting speak to the same event, the archive governs.
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
                "· Fifty-six production and event playbills, 2010/11 through 2022/23, the basis for the season record, the resident company, and the succession of chairs",
                "· Cornell Chronicle: the February 2010 budget directive, the June 2012 renaming, the Phoenix Players, and the 2020 NEA fellowship",
                "· Cornell Daily Sun: the 2010 response to the cuts, the 2012 reception of the new major, the 2020 dance non-renewals, and the 2021 column on underfunding",
                "· Department of Performing and Media Arts: institutional history, venue descriptions, event listings, and faculty biographies",
                "· College of Arts and Sciences: the 2018 account of the Phoenix Players Theatre Group",
                "· Arab Stages, notice by Marvin Carlson: the 2016 premiere of Desert of Light",
                "· Ithaca Times: the 2010 community letter of protest",
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


type NavConfig = {
  onHome?: () => void; onDirectory?: () => void; onPreSchwartz?: () => void;
  onSchwartz?: () => void; onEmergence?: () => void; onAbout?: () => void; onRepertory?: () => void;
};

export default function EmergencePage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
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
          chapterLabel="Chapter I"
          title="The Reckoning and Rebuild"
          dates="2009 – 2013"
          leadParagraph="The next phase of the department's history began with a budget cut in 2010."
          paragraphs={[
            "In early February 2010, the Cornell Chronicle reported that the deans of the College of Arts and Sciences had asked the Department of Theatre, Film and Dance to cut its non-professorial budget by one to two million dollars annually within two years. The deans identified the department's non-professorial spending as high relative to its professorial budget and asked it to propose a plan.",
            "The non-professorial budget covered the scene and costume shops, lecturers, technical staff, and resident teaching associates. The proposed cuts affected the department's production work directly.",
            "The Cornell Daily Sun captured the response the following day. Roughly thirty students and several faculty members met in the Schwartz Center to talk through what survival would look like, and the conversation exposed a split: some argued the pain should be distributed evenly across theatre, film, and dance, others that it would be less destructive to eliminate one program entirely than to hollow out all three. Bruce Levitt, who had chaired the department through the final phases of the building's construction, put the interdependence plainly, observing that cutting a seamstress in the costume shop damages the dancers and the actors alike. He also named the underlying misunderstanding, telling the Sun that production was viewed from above as an extracurricular activity, and that the administration did not grasp what the department actually did.",
            "The Sun reported that roughly 1,200 students took classes in the department each year, and that the courses most exposed were Introduction to Acting, a hands-on design course, and the dance program in its entirety. The reaction extended past campus: the Ithaca Times published a letter from alumni and community members arguing that the Schwartz Center was an integral member of Ithaca's arts ecology, not a Cornell internal matter. The final figure, as the Sun later reported, was approximately one million dollars, imposed in the spring of 2010. Its cost, though, was counted in people as much as in dollars. Over the two years that followed, twenty-two members of the department's staff were forced out, among them production managers, technical and box-office staff, lecturers, and resident teaching associates: the workforce that had kept the producing program running.",
            "The programs for the 2010/11 season register the same contraction from the inside, and record a leadership change the published reporting missed. In her chair's note to the Our Town program of November 2010, Amy Villarejo told audiences plainly that the financial crises of the preceding two years had forced significant reductions, and framed the season as a glimpse of a leaner future. A companion essay by David Feldshuh, printed as Artistic Director, established that 2010/11 was his final year in that role, after roughly a quarter century of building the producing program. Feldshuh remained on the faculty to teach, direct, and mentor, but the single artistic directorship lapsed with him: no later playbill in the archive names an Artistic Director again.",
            "The programs also show continued activity during the cuts. Performance Encounters brought David Greenspan's The Myopia and Lisa Kron to campus; the department worked with the Cornell Concert Series to bring Savion Glover to Bailey Hall; and it launched the Locally Grown Dance Festival in spring 2011.",
            "The response to the cut was structural. In 2011 the department consolidated its theatre, film, and dance majors into one Performing and Media Arts major; the Provost approved the new department name in 2012. The merger reduced the staff burden while preserving separate minors and recast the program around history, theory and criticism; creative authorship; design; and embodied performance.",
            "The transition was contested by students who feared the loss of distinct dance and film identities, but others welcomed the wider curriculum. The first season under the new name opened with Emergence in 2012, an interdisciplinary collaboration by Aoise Stratford, physicist Itai Cohen, and director Melanie Dreyer-Lude. New faculty in the period, including Austin Bunn, Anna Watkins Fisher, Vani Subramanian, and Jeffrey Palmer, gave the reorganized department its first shape.",
          ]}
          inlineImages={[
            { src: "/scans-sz/ourtown11_01.jpg", caption: "Our Town, November 2010" },
            { src: "/scans-sz/biglove_01.jpg",   caption: "Big Love, 2010" },
            { src: "/scans-sz/emergence_01.jpg", caption: "Emergence, 2012" },
            { src: "/scans-sz/carnage_01.jpg",   caption: "God of Carnage, 2012" },
            { src: "/scans-sz/machine_01.jpg",   caption: "Adding Machine, 2012" },
            { src: "/scans-sz/apeople_01.jpg",   caption: "A People, 2013" },
            { src: "/scans-sz/mother_01.jpg",    caption: "Mother of Exiles, 2013" },
            { src: "/scans-sz/lgd13_01.jpg",     caption: "Locally Grown Dance, 2013" },
          ]}
          pullQuote={{
            text: "An artist in America needs to be a warrior.",
            attribution: "Sonja Lanzener, a residential teaching associate, rallying the students who gathered in the Schwartz Center as the budget cuts were announced. Cornell Daily Sun, February 2010",
          }}
          subsections={[
            { label: "The 2010/11 season", title: "The first season of the leaner future", body: "Big Love (Charles Mee, dir. Beth F. Milles, Kiplinger, September–October 2010, its cast combining students with Actors' Equity guests Sarah K. Chalmers and David Studwell); the Montréal company RUBBERBANDance Group's Loan Sharking (October 2010); Our Town (Thornton Wilder, dir. Melanie Dreyer-Lude, Kiplinger, November 2010); Precious Little (alumna Madeleine George '96, dir. student Myles Kenyon Rowland '11, Flexible Theatre, February 2011); Those Learned Ladies (Molière in David Coward's translation, dir. Beth F. Milles, Kiplinger, April 2011); and the inaugural Locally Grown Dance Festival, in two weekends of March 2011." },
          ]}
          aside={[
            { label: "1,200 students", text: "The number taking classes in the department each year at the time of the cuts, according to the Cornell Daily Sun." },
            { label: "A wider retrenchment", text: "In May 2010 staff concerns about layoffs were raised with President David Skorton at an Employee Assembly meeting. Cornell was then running roughly twenty-five percent more layoffs than in normal years." },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-iii"
          chapterLabel="Chapter II"
          title="How a Season Worked"
          dates="2010 – 2020"
          leadParagraph="Through the 2010s, the Schwartz Center developed a working rhythm documented in detail by the archive."
          paragraphs={[
            "The building offers four performance spaces and a private cinema. The Kiplinger Theatre, modeled on an eighteenth-century Italian opera house and fitted with a hydraulic orchestra pit, seats between roughly 446 and 471 depending on configuration. The Class of '56 Flexible Theatre, generally set in three-quarter thrust, seats about 180 and carries the intimate work. The Black Box Theatre, seating 94, is the primary venue for student-led productions and doubles as an acting and directing classroom. The Dance Studio Theatre seats about 130 on bleachers under a full light grid. The Film Forum, seating roughly 100, functions as lecture hall and screening room. The department reports that the building draws roughly twenty thousand patrons a year. The playbills confirm a stable division of labour: faculty-directed mainstage work and visiting companies took the Kiplinger, the Flexible Theatre took the intimate faculty-directed plays, and the Black Box was, with near-total consistency, the student-directed house.",
            "Design credits were stable through much of the decade. Kent Goetz appeared as resident scene designer; Sarah Eckert Bernstein designed costumes for most mainstage productions from Big Love in 2010 to Spill in 2019; Warren Cross designed sound; E.D. Intemann designed lighting; Gary Moulsdale served as music director; and Daniel Hall appeared throughout. Stage management shifted from Jenny Tindall to Kristin P. Kurz and then Howard Klein.",
            "The April 2019 program for Spill was dedicated to Ed Intemann, the department's resident lighting designer and a senior lecturer. He designed more than sixty Cornell productions, co-directed Blood Wedding in 2015 and the Locally Grown Dance Festival in 2013, and appeared in playbills throughout this period. After 2018/19, lighting credits shifted among students and graduate students.",
          ]}
          subsections={[
            { label: "The chairs", title: "A succession the archive fixes", body: "Amy Villarejo signs the chair's note, or is thanked as chair, continuously from 2010/11 through 2014/15. Nick Salvato signs it from 2015/16 through at least 2019/20. Samantha Noelle Sheppard appears in the department by 2019 and becomes chair in 2022. The transitions between them, and the years from 2020 to 2022, are not yet fixed by any single document." },
            { label: "The recurring calendar", title: "The strands of a season", body: "A season braided together the faculty-directed mainstage in the Kiplinger and Flexible Theatre; the Student Lab Theatre Company, run as a course under David Feldshuh; Festival 24, which compressed the writing, directing, rehearsal, and performance of an evening of new plays into a single day; the Ten-Minute Play Festival each October; the Centrally Isolated Film Festival, founded November 2013; and the Heermans-McCalmon awards, descending from play competitions the department traces to 1917. From 2015/16 the department began organizing whole seasons around a declared theme, beginning with Salvato's “Desire.”" },
          ]}
          aside={[
            { label: "Locally Grown Dance", text: "Founded in 2011, the Locally Grown Dance Festival appears in the archive every year through 2023, including during restructuring, the pandemic, and changes to dance faculty." },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-v"
          chapterLabel="Chapter III"
          title="Theatre Beyond the Campus"
          dates="2009 – 2022"
          leadParagraph="One important theatrical project associated with Cornell in this era was not staged in the Schwartz Center."
          paragraphs={[
            "The Phoenix Players Theatre Group was founded in 2009 inside Auburn Correctional Facility, a maximum-security prison roughly thirty miles from Ithaca, by a group of incarcerated men. The Chronicle credits its initiation to inmates working with the assistance of Stephen Cole, the late professor emeritus of theatre arts. The group's own account names Michael Rhynes and Clifford Williamson as its founders, and describes a company that renamed itself early on because its members recognized that while they were in Auburn, they were not of it.",
            "Bruce Levitt became the group's lead facilitator in 2011 and has met with the company weekly ever since, joined by other theatre practitioners from Cornell and Ithaca College. The company's method is devising: scripts assembled from the members' own writing, developed across a training cycle that runs for two years and culminates in a live performance before an invited audience.",
            "The published record establishes a sequence of original works. Inside/Out came first. Maximum Will, drawn from Shakespeare and interwoven with the men's own writing, was performed in April 2012 and became the basis for the documentary Human Again. The group expanded its membership in 2013 and performed An Indeterminate Life in May 2014. This Incarcerated Life followed in May 2016. In May 2018 the company performed The Strength of Our Convictions, The Auburn Redemption, its title drawn from a declaration of action Rhynes had written in 2009, invoking the phoenix rising from the ashes of a shameful past.",
            "In August 2016 Levitt received Cornell's inaugural Engaged Scholar Prize, which carried thirty thousand dollars, used to complete Human Again. The film was shot by student filmmakers. Levitt delivered the accompanying lecture that October, arguing that the work's value lay partly in its capacity to alter public perception of incarcerated people, and that the men were more than their crimes.",
          ]}
          subsections={[
            { label: "A wider structure", title: "Theatre as public engagement", body: "Cornell students volunteered with the company. Levitt developed courses in prison theatre and the arts in incarceration and became a faculty coordinator of the Cornell Justice, Education, and Prison minor, with the Cornell Prison Education Program supplying the surrounding structure." },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-vi"
          chapterLabel="Chapter IV"
          title="Translation and the Global Turn"
          dates="2012 – 2020"
          leadParagraph="The department's work in this period included international and translated theatre."
          paragraphs={[
            "The turn is visible from 2012. Melanie Dreyer-Lude staged a Schimmelpfennig play in her own translation that year and directed Elaine Romero's border play Mother of Exiles in 2013; the visiting duet of Emily Coates and Lacina Coulibaly brought West African and American contemporary dance into direct conversation in 2012; and Caochangdi Workstation's The Memory Project brought a Beijing documentary-performance company into the Kiplinger in 2015.",
            "Rebekah Maggor joined the faculty in the fall of 2016 as an assistant professor of performance, bringing a research program centered on political theatre and drama in translation, with particular attention to recent Arabic drama from Egypt, Palestine, and Syria. Her first Cornell production, as reported in Arab Stages by Marvin Carlson, was the English-language world premiere of Desert of Light, a tragicomedy by the Palestinian-Syrian writer Rama Haydar, which Maggor had translated with the playwright. The production opened with a twenty-five-minute devised prologue drawn from Mahmoud Darwish's State of Siege, with movement designed by Byron Suber and performed by a cast of Cornell students. Every performance sold out, and each was followed by a panel placing the work in context, with Haydar present. Maggor later adapted and directed Hamlet Wakes Up Late, a political satire by the Syrian poet and playwright Mamduh Adwan.",
            "Maggor's scholarly work ran alongside the productions. She co-edited and co-translated Tahrir Tales, Plays from the Egyptian Revolution, published by Seagull Books, and in January 2020 the Chronicle reported that she had received a Literature Fellowship in Translation from the National Endowment for the Arts, awarded for New Plays from Palestine, Theatre Between Home and Exile, co-edited with Marvin Carlson and Mas'ud Hamdan. Her own account of her Cornell years describes an effort to establish translation as a form of scholarship in its own right, through a Translation Network launched with the Society for the Humanities and an international conference, Drama Across Borders.",
            "The department's intellectual life in this period was also visibly conference-driven. In October 2017, graduate students Caitlin Kane and Erin Stoneking convened Escape from the Archive, Encountering History through Performance and Theater, a weekend of roundtables, lectures, and performances built around the question of how theatre encounters the past. Soyica Diggs Colbert delivered the keynote in the Film Forum. Leigh Fondakowski of Tectonic Theater Project presented a staged reading of her new play Casa Cushman in the Black Box, performed with Kelli Simpkins and Cornell students. The weekend closed with a walking audioplay performance, Storm Country, along the Erie Barge Canal, ending at the Cherry Artspace.",
            "Graduate and undergraduate students also directed work during these years. Nick Fesette, Caitlin Kane, Jayme Kilburn, Stephen Low, and Joshua Bastian Cole directed mainstage or near-mainstage productions between 2014 and 2019. The Black Box also hosted undergraduate directors, including Jesse Turk, Spencer Whale, Michael Doliner, Julia Dunetz, and Julia Smith.",
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-vii"
          chapterLabel="Chapter V"
          title="Interruption and Improvisation"
          dates="2019 – 2022"
          leadParagraph="The spring 2020 season was announced and then dismantled."
          paragraphs={[
            "Auditions were held in the Flexible Theatre in late January for a slate that included Jennifer Haley's The Nether, directed by Bryan Hagelin '20 for the Student Lab Theatre Company, the Heermans-McCalmon awards presentation in March, a New Works Festival, a graduate theatre lab project titled eTRASH directed by Kelly Richmond, and Much Ado About Nothing directed by Samuel Blake, scheduled to run into early May. The archived event listing carries the flat notice that in-person events involving outside guests would not be held.",
            "The cuts came quickly and, once again, fell on dance first. In April 2020 the Sun reported that pandemic budget reductions had halved the department's dance faculty: Cornell declined to renew the contracts of Nicholas Ceynowa and Julie Nathanielsz '93, leaving Jumay Chu, who had taught at Cornell since 1989, and Byron Suber, who had taught since 1991. Ceynowa told his students that the college had bracketed his course, meaning it could return, and that the administration hoped the loss would prove short-term. Nick Salvato was chair. Students quoted by the Sun made the same argument their predecessors had made in 2010, that the university reached for the arts first.",
            "In the fall of 2020 the department produced Off-Campus/On-Screen, Cornell Life in the Time of COVID-19, a feature-length collection of short films built from student stories, developed through virtual rehearsals, socially distanced shoots, and long-distance critique. The project was co-conceived by Rebekah Maggor, who proposed using theatre devising techniques to generate screenplays about pandemic life at Cornell, and realized with Jeffrey Palmer and Youngsun Palmer on the film side and P.A. Angelopoulos and Carolyn Goelzer in the acting studio, with master electrician Steven Blasberg largely camped in the building to make it possible. The program notes claim two firsts: it was the first time PMA theatre and film faculty and staff had collaborated on a mainstage season production, and the first time a mainstage had been given over entirely to student stories.",
          ]}
          subsections={[
            { label: "The 2021/22 return", title: "A season under a new mission statement", body: "The archive resumes with a mission statement not seen before, committing the department to creating spaces that break down systems of oppression based on race, gender, sexuality, class, ability, and place of origin. The season brought Saving for 17 (dir. Owen Reynolds, Black Box, September–October 2021); Kaha:wi Dance Theatre's Blood, Water, Earth (artistic director Santee Smith, October 2021), presented with the Johnson Museum and Cornell Botanic Gardens and opening with an acknowledgement of the ancestral lands and waters of the Cayuga Nation; Seven Homeless Mammoths Wander New England (Flexible Theatre, November 2021); and A Chicano's Guide to Navigation (John Colie, Black Box, March 2022)." },
          ]}
          aside={[
            { label: "A self-reinforcing trap", text: "In December 2021 Andrew Lorenzen '22 argued in the Sun that chronic underfunding produced a loop: too little money means a lower campus profile, which means fewer majors, which makes further cuts easier to justify." },
            { label: "The building itself", text: "Lorenzen noted in passing that the Schwartz Center had been closed for two days that week to deal with a mold problem, and that the ten-minute play festival went on anyway." },
          ]}
        />
        </Reveal>
        <Reveal>
        <ChapterSection
          id="chapter-viii"
          chapterLabel="Chapter VI"
          title="Rebuilding"
          dates="2022 – 2026"
          leadParagraph="Samantha Noelle Sheppard, a scholar of film and media who appears in the department's programs from 2019, is recorded as interim chair by the fall of 2022 and has served as chair since. The department has continued to program across theatre, dance, film, and media."
          paragraphs={[
            "The archive's coverage thins here, holding two events from 2022/23. The Mush Hole, by Kaha:wi Dance Theatre, came to the Kiplinger in October 2022, a theatrical dance work on the Mohawk Institute, Canada's first Indian residential school, presented with a week of workshops, an American Indian and Indigenous Studies speaker event, and a powwow boot camp, co-sponsored by Art History and the Office of Institutional Equity and Diversity. The company's second appearance in two years marks Indigenous performance as a sustained commitment rather than a single booking. For the seasons after, the record is again published rather than archival.",
            "In October 2023 the department staged Toni Morrison's Desdemona in the Kiplinger Theatre, the poetic response to Othello that Morrison originally created in 2011 with director Peter Sellars and the Malian singer and songwriter Rokia Traoré. The Cornell production, facilitated by Beth Milles, placed student performers onstage alongside Traoré herself. The same season brought Caryl Churchill's Love and Information. In the spring of 2024 the dance program premiered This table has been a house in the rain, an evening-length interdisciplinary work responding to Joy Harjo's poem Perhaps the World Ends Here, generated, directed, and designed by students working with Danielle Russo and mentored by Eiko Otake, Ishmael Houston-Jones, and Keith Hennessy, followed by a walk-through installation in the Schwartz Center atrium. Student work traveled: The Family Copoli, described as a post-apocalyptic burlesque musical, went from the Kiplinger to the Edinburgh Fringe.",
            "In November 2024 David Feldshuh wrote and directed Orlando's Gift in the Flexible Theatre, a new play drawn from Virginia Woolf's Orlando, made with students, faculty, and guest artists. In the fall of 2025 the department produced I Want a Country by the Greek playwright Andreas Flourakis, translated by Eleni Drivas, directed by Samuel Buggeln, artistic and executive director of the Cherry Arts, an Ithaca company. Shakespeare returns in the fall of 2026 with Twelfth Night.",
            "The department has also been building outward. It has announced Cornell in Los Angeles, an optional twelve-credit spring semester program open to all Cornell students beginning in spring 2027, directed by Kristen Warner, alongside a Sundance program and an alumni network in the entertainment industry. Cornell Cinema, founded in 1970 and housed in the Willard Straight Theatre, is now formally a program of the department, presenting more than seventy-five films a semester. Its survival was not guaranteed: the Sun reported that the Student Assembly voted in late 2017 to eliminate its byline funding entirely, after a comparable threat in 2010. It is now supported principally by the College of Arts and Sciences and the Graduate and Professional Student Assembly.",
          ]}
          subsections={[
            { label: "Without interpretation", title: "One current fact for the record", body: "As of this writing the department's graduate program states that it is not accepting doctoral applications this cycle, and plans to resume for fall 2027 admission. The cause is not given on the page." },
          ]}
        />
        </Reveal>

       </div>

        <Reveal><Closing /></Reveal>
      </div>
    </div>
  );
}
