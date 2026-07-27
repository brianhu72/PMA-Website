import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { pageZoom } from "../lib/scale";
import { useIsMobile } from "../lib/useIsMobile";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";

const ESPRESSO      = "#1b1b1e";
const ESPRESSO_SOFT = "#4c4c52";
const MUTED         = "#8a8a90";
const CARNELIAN     = "#b31b1b";
const SERIF         = "'Newsreader', Georgia, serif";

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Reveal({ children, delay = 0, y = 22 }: { children: ReactNode; delay?: number; y?: number }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion()) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      willChange: "opacity, transform",
    }}>
      {children}
    </div>
  );
}

function HoverImg({ src, alt, style, zoom = 1 }: { src: string; alt: string; style: CSSProperties; zoom?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...style, transform: hovered ? `scale(${zoom})` : "scale(1)", transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
    />
  );
}

interface Entry {
  year: string;
  tag: string;
  name: string;
  note: ReactNode;
  img?: string;                                 // portrait
  feature?: { src: string; caption: string };   // large archive photograph
  quote?: { text: string; attribution: string };
}

interface Section {
  label: string;
  kicker?: string;      // optional blurb under the label
  entries: Entry[];
}

const SECTIONS: Section[] = [
  {
    label: "The 1980s",
    entries: [
      {
        year: "1985 – 86",
        tag: "Playwright in residence · Nobel Laureate",
        name: "Wole Soyinka",
        note:
          "The Nigerian playwright, poet, and essayist Wole Soyinka was in residence at Cornell in the mid-1980s, " +
          "the year before he became the first African writer awarded the Nobel Prize in Literature, in 1986. Two " +
          "of his one-act Jero plays, The Trials of Brother Jero and Jero's Metamorphosis, were staged here together " +
          "as The Jero Plays, directed by David Feldshuh; the production's faculty advisor was Henry Louis Gates Jr., " +
          "then a professor in Cornell's Department of English.",
        feature: {
          src: "/guests/wole_soyinka.jpeg",
          caption: "Wole Soyinka at Cornell.",
        },
      },
      {
        year: "1987 – 88",
        tag: "Directing",
        name: "Maurice Daniels",
        note: "Directed Twentieth Century Blues in the department's last full season in its old spaces, the year before the move into the Center for Theatre Arts.",
      },
    ],
  },
  {
    label: "1989 · An American Festival",
    kicker:
      "The Center for Theatre Arts opened not with a gala but with ten days of community-rooted performance, " +
      "September 17 to 27, 1989, drawn from the national American Festival Project. Nine touring companies came " +
      "to Ithaca, among them A Traveling Jewish Theatre, El Teatro de la Esperanza, the guitarist Francisco " +
      "González, the Navajo flautist R. Carlos Nakai, Liz Lerman's Dance Exchange, and Robbie McCauley and " +
      "Company, drawing more than five thousand people to twenty performances. The choice of guests announced " +
      "what the building was for.",
    entries: [
      {
        year: "1989 – 1992",
        tag: "Festival · Visiting professor",
        name: "John O'Neal",
        img: "/guests/john_oneal.jpg",
        note:
          "O'Neal co-founded the Free Southern Theater in 1963, the touring company of the civil rights " +
          "movement, and created the storyteller Junebug Jabbo Jones, whose cycle of plays he drew from Black " +
          "life in the rural South. He brought his Junebug Theater Project to the festival and then stayed, " +
          "joining the faculty as a visiting professor and teaching playwriting at Cornell until 1992.",
      },
      {
        year: "1989",
        tag: "Festival",
        name: "Roadside Theater",
        img: "/guests/roadside_theater.jpg",
        note: "The Appalachian ensemble of Appalshop in Whitesburg, Kentucky, making plays from the ballads and oral history of the coalfields. It returned to teach a Cornell course in popular theatre from 1990 to 1993 and co-hosted a national symposium on the form.",
      },
      {
        year: "1989",
        tag: "Festival",
        name: "Urban Bush Women",
        img: "/guests/urban_bush_women.jpg",
        note: "Jawole Willa Jo Zollar's Brooklyn company, telling the history of the African diaspora through the dancing body.",
      },
      {
        year: "1989",
        tag: "Festival",
        name: "Spiderwoman Theater",
        img: "/guests/spiderwoman_theater.jpg",
        note: "The Native feminist ensemble of the Miguel sisters, the longest-running Native women's theatre company in North America, and a core company of the American Festival Project.",
      },
    ],
  },
  {
    label: "The 1990s",
    entries: [
      {
        year: "1991",
        tag: "Visiting company · Miss Evers' Boys",
        name: "Illusion Theater",
        note:
          "The Minneapolis company where David Feldshuh, Cornell's own artistic director, developed his " +
          "Tuskegee play brought Miss Evers' Boys to campus. Illusion had carried the play through three " +
          "developmental readings from 1989 and gave it its first full staging in 1991; the next year it was " +
          "named a finalist for the Pulitzer Prize and, by one count, the most-produced play in America. The " +
          "engagement was framed by a symposium, “What do you do when you live in a society where all men are " +
          "not treated equal?” A 1997 HBO film with Alfre Woodard and Laurence Fishburne followed.",
        quote: {
          text: "“…fully realized, deeply felt, often humorous, and moving.”",
          attribution: "John Simon, New York Magazine, on Miss Evers' Boys",
        },
        feature: {
          src: "/guests/missevers.jpg",
          caption: "Illusion Theater's production of Miss Evers' Boys, David Feldshuh's play of the Tuskegee study. From the department archive.",
        },
      },
      {
        year: "1997",
        tag: "Homecoming",
        name: "Harold Gould, Ph.D. '53",
        img: "/guests/harold_gould.jpg",
        note:
          "Gould took his doctorate at Cornell in 1953 with a thesis on dramatic activity in American schools, " +
          "taught here and at two other colleges, then left the academy in 1960, at thirty-seven, to act. The " +
          "leave lasted half a century: he became one of television's most familiar faces, in The Sting, Rhoda, " +
          "Soap, and The Golden Girls. In 1997 he came home to play Willy Loman.",
      },
      {
        year: "1997",
        tag: "Homecoming",
        name: "Lea Shampanier Gould, M.A. '53",
        img: "/guests/lea_vernon.jpg",
        note:
          "She met Harold Gould at Cornell, where she studied as Lea Shampanier and acted under the name Lea " +
          "Vernon. They married in 1950 and stayed together sixty years. In 1997 they returned to play Linda " +
          "and Willy Loman opposite each other on the mainstage.",
      },
      {
        year: "1998 – 99",
        tag: "Visit",
        name: "Tony Kushner",
        note:
          "The Pulitzer Prize-winning author of Angels in America visited the department in 1998-99, the year " +
          "after the company had staged Perestroika, the play's second half. He returned to Cornell in 2002 " +
          "for an evening at the medical college in New York.",
        feature: {
          src: "/scans-sz/kushner_01.jpg",
          caption: "Tony Kushner speaking in the Center for Theatre Arts, 1998–99. Photo: Charles Harrington. From the department archive.",
        },
      },
      {
        year: "1998 – 99",
        tag: "Directing",
        name: "Benny Sato Ambush",
        img: "/guests/benny_sato_ambush.jpg",
        note: "A senior director of the American resident-theatre movement, he staged Anna Deavere Smith's documentary Twilight: Los Angeles, 1992 in the tenth-anniversary season.",
      },
      {
        year: "1999",
        tag: "Masterclass · A.D. White Professor-at-Large",
        name: "John Cleese",
        img: "/guests/john_cleese.jpg",
        note:
          "The Monty Python co-founder came to Cornell in February 1999 to give a master class on comedy, and " +
          "was named an A.D. White Professor-at-Large, as which he served until 2006. Over those years, he " +
          "returned repeatedly to the Schwartz Center to talk with students on everything from scriptwriting to psychology.",
      },
    ],
  },
  {
    label: "The 2000s",
    entries: [
      {
        year: "2000 – 01",
        tag: "Performing · Amadeus",
        name: "Roshan Seth",
        note:
          "The British-Indian actor Roshan Seth, known to film audiences as Nehru in Richard Attenborough's Gandhi " +
          "and for My Beautiful Laundrette, Indiana Jones and the Temple of Doom, and Mississippi Masala, came to " +
          "Cornell to play the lead, Salieri, the envious court composer at the heart of Peter Shaffer's Amadeus, in " +
          "the Kiplinger Theatre. His performance anchored one of the Schwartz Center's most ambitious early-2000s " +
          "stagings.",
        feature: {
          src: "/playbills/2000-01/amadeus.jpg",
          caption: "Peter Shaffer's Amadeus, with Roshan Seth as Salieri, Kiplinger Theatre, 2000–01. From the department's playbill archive.",
        },
      },
      {
        year: "2001",
        tag: "Directing",
        name: "Randy Reinholz",
        img: "/guests/randy_reinholz.jpg",
        note:
          "Reinholz, of Choctaw heritage and then head of undergraduate acting at San Diego State, directed " +
          "Tomson Highway's The Rez Sisters, which opened in the Flexible Theatre on October 24, 2001 as the " +
          "centerpiece of a year-long celebration of Native American arts, Indians' Indians. Two clapboard " +
          "shacks were built onstage for the Wasaychigan Hill reserve; unable to cast Native actors, Reinholz " +
          "worked with his company to find what was universal in the play and what was particular to " +
          "reservation life.",
      },
      {
        year: "2002",
        tag: "Directing · A.D. White Professor-at-Large",
        name: "Richard Schechner '56",
        img: "/guests/richard_schechner.jpg",
        note: <>
          Schechner, class of '56, returned to his alma mater as an A.D. White Professor-at-Large to direct <em>Waiting for Godot</em>, which opened at the Schwartz Center on January 30, 2002. Schechner, the founder of performance studies at NYU and longtime editor of <em>The Drama Review</em>, treated Samuel Beckett's text as music rather than message, cast three students in the single role of Lucky, and opened his rehearsals to anyone who wanted to watch and argue.
        </>,
        quote: {
          text: "\"I sometimes change my mind. It's one of my worst habits; you'll just have to get used to it.\"",
          attribution: "Richard Schechner '56, on directing Waiting for Godot at Cornell, 2002",
        },
      },
      {
        year: "2004",
        tag: "Performing · A Raisin in the Sun",
        name: "Yolanda King",
        img: "/guests/yolanda_king.jpg",
        note:
          "Yolanda King, eldest daughter of Dr. Martin Luther King Jr. and Coretta Scott King, played the " +
          "matriarch Lena Younger in the Schwartz Center's A Raisin in the Sun in the fall of 2004, staged by " +
          "the guest director Regge Life opposite the student Godfrey Simmons Jr. as Walter Lee. An actor and " +
          "activist in her own right, King made the Younger family's fight for dignity resonate with her own " +
          "inheritance; the Cornell Daily Sun called her scenes with Simmons electric.",
        quote: {
          text: "\"It was a brilliant move to cast Yokie because of who she is.\"",
          attribution: "Regge Life, director, on casting Yolanda King, 2004",
        },
      },
      {
        year: "2004 – 05",
        tag: "Guest company",
        name: "The Beijing Opera",
        img: "/guests/beijing_opera.jpg",
        note: "The classical Chinese opera company appeared as guest artists in the 2004-05 season, brought in partnership with Cornell's East Asia Program.",
      },
      {
        year: "2006 – 07",
        tag: "Performing",
        name: "Peter Michael Goetz",
        img: "/guests/peter_michael_goetz.jpg",
        note: "The Broadway and Guthrie Theater veteran joined the company for Arthur Miller's All My Sons, which ran in the Kiplinger Theatre from February into March 2007.",
      },
      {
        year: "2008 – 09",
        tag: "Homecoming",
        name: "Emily Ranii '07",
        img: "/guests/emily_ranii.jpg",
        note: "She returned as a visiting lecturer to direct The Body Project and Blood Wedding at the Schwartz Center. Now artistic director of Wheelock Family Theatre at Boston University.",
      },
      {
        year: "2009 – 10",
        tag: "Directing",
        name: "Richard Hamburger",
        img: "/guests/richard_hamburger.jpg",
        note: "Longtime artistic director of Dallas Theater Center, who staged Gogol's The Government Inspector on the mainstage.",
      },
      {
        year: "2009 – 10",
        tag: "Directing",
        name: "Will Rhys",
        img: "/guests/will_rhys.jpg",
        note: "Actor and director of the American resident theatre, who staged Goldoni's The Servant of Two Masters.",
      },
      {
        year: "2009 – 10",
        tag: "Directing",
        name: "Don Tindall",
        img: "/guests/don_tindall.jpg",
        note: "Sound designer and educator, who directed Lee Blessing's Nice People Dancing to Good Country Music.",
      },
    ],
  },
  {
    label: "The 2010s",
    entries: [
      {
        year: "2011",
        tag: "Homecoming",
        name: "Jimmy Smits, M.F.A. '82",
        img: "/guests/jimmy_smits.jpg",
        note:
          "Smits took his MFA in acting at Cornell in 1982 and went on to L.A. Law, NYPD Blue, The West Wing, " +
          "and the Star Wars prequels. He came back on December 6, 2011 to receive the university's Alumni " +
          "Artist Award, spending the day with students and sitting for a public conversation with Bruce Levitt " +
          "in the Flexible Theatre.",
      },
    ],
  },
  {
    label: "Dance at Cornell",
    kicker:
      "The Cornell Dance Series, founded in 1978, brought touring professional companies to campus each season " +
      "for performances and master classes. Over four decades it amounted to a survey of American and " +
      "international dance, from Baroque historical dance to Merce Cunningham, Alvin Ailey, and Rennie Harris.",
    entries: [
      {
        year: "1986 – 87",
        tag: "Cornell Dance Series",
        name: "The New York Baroque Dance Company",
        note: "Catherine Turocy's company brought the reconstructed dance of the Baroque stage to campus in one of the Dance Series' early seasons.",
        feature: {
          src: "/scans/baroque_01.jpg",
          caption: "The New York Baroque Dance Company on the Cornell Dance Series, 1986–87.",
        },
      },
      {
        year: "1988 – 89 · 2006 – 07",
        tag: "Choreography",
        name: "David Gordon / Pick Up Performance Co.",
        img: "/guests/david_gordon.jpg",
        note: "The Judson Dance Theater founder brought his Pick Up Performance Co. to the building's very first season, and returned nearly two decades later.",
      },
      {
        year: "1990 – 91",
        tag: "Commission",
        name: "Jim Self & Frank Moore's Beehive",
        note: "A Dance Concert commission by the choreographer Jim Self and the artist Frank Moore, previewed in 1990 and given in full the following year.",
        feature: {
          src: "/scans-sz/beehive_01.jpg",
          caption: "Jim Self and Frank Moore's Beehive, a Dance Concert commission, 1990–91.",
        },
      },
      {
        year: "1996 – 97",
        tag: "Cornell Dance Series",
        name: "Limón Dance Company",
        img: "/guests/limon_dance.jpg",
        note: "The company of José Limón came to the Dance Series in its fiftieth-anniversary year.",
      },
      {
        year: "1997 – 98",
        tag: "Cornell Dance Series",
        name: "Martha Graham Dance Company",
        img: "/guests/martha_graham.jpg",
        note: "The foundational company of American modern dance.",
      },
      {
        year: "1998 – 99",
        tag: "Cornell Dance Series · Dance '99",
        name: "Merce Cunningham Dance Company",
        note: <>One of the defining companies of American postmodern dance, whose technologically focused work <em>BIPED</em> debuted at Cornell during <em>Dance '99</em>.</>,
        feature: {
          src: "/scans-sz/dance99_01.jpg",
          caption: "Dance '99, with the Merce Cunningham Dance Company. Photo: Charles Harrington.",
        },
      },
      {
        year: "1998 – 99",
        tag: "Masterclass",
        name: "Alvin Ailey American Dance Theater",
        note: "The company gave a master class in the Dance Theatre, working directly with Cornell dance students.",
        feature: {
          src: "/scans-sz/ailey_01.jpg",
          caption: "Alvin Ailey American Dance Theater master class, 1998–99. Photo: Charles Harrington.",
        },
      },
      {
        year: "2004 – 05",
        tag: "Cornell Dance Series",
        name: "Rennie Harris Puremovement",
        img: "/guests/rennie_harris.jpg",
        note: "The pioneering hip-hop concert-dance company.",
      },
      {
        year: "2007 – 08",
        tag: "Cornell Dance Series",
        name: "Garth Fagan Dance",
        img: "/guests/garth_fagan.jpg",
        note: "The Rochester company of the Tony-winning choreographer of The Lion King.",
      },
      {
        year: "2007 – 08",
        tag: "Cornell Dance Series",
        name: "Stephen Petronio Company",
        img: "/guests/stephen_petronio.jpg",
        note: "New York repertory of the postmodern choreographer.",
      },
      {
        year: "c. 2010s",
        tag: "Choreography",
        name: "Trajal Harrell",
        img: "/guests/trajal_harrell.jpg",
        note: "The choreographer who joined postmodern dance to the voguing tradition of the Harlem ballroom.",
      },
    ],
  },
];


function TagLine({ year, tag }: { year: string; tag: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 9, flexWrap: "wrap" }}>
      {year && (
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: MUTED }}>
          {year}
        </span>
      )}
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>
        {tag}
      </span>
    </div>
  );
}

function EntryQuote({ quote }: { quote: NonNullable<Entry["quote"]> }) {
  return (
    <div style={{ marginTop: 16, paddingLeft: 14, borderLeft: `2px solid ${CARNELIAN}` }}>
      <p style={{ fontFamily: SERIF, fontSize: 16, fontStyle: "italic", fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.1px", color: ESPRESSO, margin: 0 }}>
        {quote.text}
      </p>
      <p style={{ fontSize: 9, letterSpacing: "0.06em", color: MUTED, margin: "10px 0 0" }}>
        {quote.attribution}
      </p>
    </div>
  );
}

function RegisterEntry({ e, last }: { e: Entry; last: boolean }) {
  const mobile = useIsMobile();
  const imgSrc = e.img || e.feature?.src;
  const caption = e.feature?.caption;
  const SIZE = mobile ? 116 : 176;

  const textBlock = (
    <div>
      <TagLine year={e.year} tag={e.tag} />
      <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: ESPRESSO, margin: 0, lineHeight: "22px" }}>
        {e.name}
      </p>
      <p style={{ fontSize: 13, lineHeight: "21px", letterSpacing: "-0.01em", color: ESPRESSO_SOFT, margin: "8px 0 0" }}>
        {e.note}
      </p>
      {e.quote && <EntryQuote quote={e.quote} />}
    </div>
  );

  // Every entry with an image uses the same square frame, so the register reads evenly.
  const imageBlock = imgSrc ? (
    <figure style={{ margin: 0 }}>
      <div style={{ width: SIZE, height: SIZE, borderRadius: 2, overflow: "hidden", background: "#f0ede8" }}>
        <HoverImg src={imgSrc} alt={e.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      </div>
      {caption && (
        <figcaption style={{ fontFamily: SERIF, fontSize: 10, fontStyle: "italic", color: MUTED, margin: "8px 0 0", lineHeight: "14px", maxWidth: SIZE }}>
          {caption}
        </figcaption>
      )}
    </figure>
  ) : null;

  return (
    <div style={{ padding: "26px 0", borderBottom: last ? "none" : "1px solid rgba(0,0,0,0.08)" }}>
      {imgSrc ? (
        mobile ? (
          <div>
            <div style={{ marginBottom: 14 }}>{imageBlock}</div>
            {textBlock}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `1fr ${SIZE}px`, gap: 28, alignItems: "start" }}>
            {textBlock}
            {imageBlock}
          </div>
        )
      ) : (
        textBlock
      )}
    </div>
  );
}

type NavConfig = {
  onHome?: () => void; onDirectory?: () => void; onPreSchwartz?: () => void;
  onSchwartz?: () => void; onEmergence?: () => void; onAbout?: () => void;
  onRepertory?: () => void; onGuests?: () => void;
};

export default function GuestsPage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
  const [atHero, setAtHero] = useState(true);
  const pageMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setAtHero(window.scrollY < 240 * pageZoom());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#ffffff", minHeight: "calc(100vh / var(--pz, 1))", fontFamily: "Inter, sans-serif", color: ESPRESSO }}>
      <Nav {...(navProps ?? {})} onHome={onHome} transparent={atHero} light={!atHero} />
      <div style={{ backgroundImage: "url(/scans-sz/ailey_01.jpg)", backgroundSize: "cover", backgroundPosition: "center 30%", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(14,14,18,0.72)" }} />
        <div style={{ maxWidth: 940, margin: "0 auto", padding: pageMobile ? "104px 20px 36px" : "156px 0 64px", position: "relative" }}>
          <h1 style={{ fontFamily: "Saira Condensed, sans-serif", fontSize: pageMobile ? 40 : 64, fontWeight: 800, color: "#ffffff", lineHeight: pageMobile ? "42px" : "60px", textTransform: "uppercase", margin: 0 }}>
            Guest Artists
          </h1>
        </div>
      </div>
      <div style={{ maxWidth: 940, margin: "0 auto", paddingTop: pageMobile ? 36 : 48, paddingLeft: pageMobile ? 20 : 0, paddingRight: pageMobile ? 20 : 0 }}>
        <Reveal y={16}>
          <p style={{ fontSize: 15, lineHeight: "25px", letterSpacing: "-0.01em", color: ESPRESSO_SOFT, margin: 0, maxWidth: 720 }}>
            For decades, the department has brought in artists from elsewhere to direct productions, showcase dance, teach courses, or come back to the place where they began.
          </p>
        </Reveal>
      </div>
      <div style={{ maxWidth: 940, margin: "0 auto", paddingBottom: 40, paddingLeft: pageMobile ? 20 : 0, paddingRight: pageMobile ? 20 : 0 }}>
        {SECTIONS.map(section => (
          <section key={section.label} style={{ paddingTop: pageMobile ? 48 : 60 }}>
            <Reveal>
              <h2 style={{ fontFamily: "Saira Condensed, sans-serif", fontSize: pageMobile ? 24 : 30, fontWeight: 700, letterSpacing: "0.01em", lineHeight: pageMobile ? "26px" : "32px", textTransform: "uppercase", color: ESPRESSO, margin: 0 }}>
                {section.label}
              </h2>

              {section.kicker && (
                <p style={{ fontSize: 13, lineHeight: "21px", letterSpacing: "-0.01em", color: ESPRESSO_SOFT, margin: "12px 0 0", maxWidth: 760 }}>
                  {section.kicker}
                </p>
              )}
            </Reveal>

            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", marginTop: 18 }}>
              {section.entries.map((e, i) => (
                <Reveal key={e.name} delay={Math.min(i, 4) * 70}>
                  <RegisterEntry e={e} last={i === section.entries.length - 1} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div style={{ maxWidth: 940, margin: "0 auto", paddingTop: 56, paddingBottom: 96, paddingLeft: pageMobile ? 20 : 0, paddingRight: pageMobile ? 20 : 0 }}>
        <Reveal>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 22 }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>
            A note on the record
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 12.5, fontStyle: "italic", lineHeight: "19px", color: MUTED, margin: 0, maxWidth: 680 }}>
            This register is drawn from Cornell Chronicle and Daily Sun coverage, departmental programs,
            and the archive's own photographs.
          </p>
        </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  );
}
