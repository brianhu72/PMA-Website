import { useState, useEffect } from "react";
import { pageZoom } from "../lib/scale";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";
import Reveal from "../components/ui/Reveal";
import { useIsMobile } from "../lib/useIsMobile";

const ESPRESSO  = "#1b1b1e";
const MUTED     = "#8a8a90";
const RULE      = "rgba(0,0,0,0.08)";
const CARNELIAN = "#b31b1b";
const SERIF     = "'Newsreader', Georgia, serif";

interface RPTA { year: number; name: string; role: string }

function headshotSrc(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `/rpta/${slug}.jpg`;
}

const ALL_RPTAS: RPTA[] = [
  { year: 1986, name: "Armand Schultz",           role: "Actor" },
  { year: 1986, name: "Eric Ness",                role: "Actor" },
  { year: 1986, name: "Jane Gabbert-Wilson",      role: "Actor" },
  { year: 1988, name: "Kenton Benedict",          role: "Actor" },
  { year: 1988, name: "Harvy Blanks",             role: "Actor" },
  { year: 1988, name: "Christopher H. Carothers", role: "Properties Master" },
  { year: 1988, name: "Maria Fermo",              role: "Costume Design" },
  { year: 1988, name: "Chuck Hatcher",            role: "Sound Designer" },
  { year: 1988, name: "Brenda Johnson",           role: "Scenic Artist" },
  { year: 1988, name: "Kate Levy",                role: "Actor" },
  { year: 1988, name: "Maria Porter",             role: "Actor" },
  { year: 1988, name: "Michael Stacy",            role: "Actor" },
  { year: 1988, name: "Chris Watts",              role: "Master Electrician" },
  { year: 1989, name: "Greg Bakke",               role: "Properties Master" },
  { year: 1989, name: "John Beumler",             role: "Actor" },
  { year: 1989, name: "Randy Braunberger",        role: "Actor" },
  { year: 1989, name: "Chiffonye Cobb",           role: "Actor" },
  { year: 1989, name: "Julie A. Gallagher",       role: "Scenic Artist" },
  { year: 1989, name: "Sheree Galpert",           role: "Actor" },
  { year: 1989, name: "Kevin Hinshaw",            role: "Carpentry" },
  { year: 1989, name: "Hanson Hsu",               role: "Electrician" },
  { year: 1989, name: "Tan Huaixiang",            role: "Costume Design" },
  { year: 1989, name: "Cherie Miltenberger",      role: "Stage Manager" },
  { year: 1989, name: "William Robert Potter",    role: "Master Carpenter" },
  { year: 1989, name: "Tom Spivey",               role: "Actor" },
  { year: 1990, name: "Virginia Adams",           role: "Electrician" },
  { year: 1990, name: "Denise Balthrop",          role: "Actor" },
  { year: 1990, name: "Warren Cross",             role: "Carpentry" },
  { year: 1990, name: "Tony Freeman",             role: "Actor" },
  { year: 1990, name: "Max Fury",                 role: "Actor" },
  { year: 1990, name: "Christopher Lau",          role: "Master Electrician" },
  { year: 1990, name: "Elizabeth Lau",            role: "Costume" },
  { year: 1990, name: "Craig MacDonald",          role: "Actor" },
  { year: 1990, name: "Carlton Miller",           role: "Actor" },
  { year: 1991, name: "Nancy Cusumano-Cross",     role: "Properties" },
  { year: 1991, name: "Rachel N. Durkin",         role: "Stage Manager" },
  { year: 1991, name: "Karen Eterovich",          role: "Actor" },
  { year: 1991, name: "Frank Farrell",            role: "Actor" },
  { year: 1991, name: "Brent Harris",             role: "Actor" },
  { year: 1991, name: "Xikatia",                  role: "Scenic Artist" },
  { year: 1991, name: "Sheriden Thomas",          role: "Actor" },
  { year: 1991, name: "Eric Weston",              role: "Master Carpenter" },
  { year: 1992, name: "Todd Anthony-Jackson",     role: "Actor" },
  { year: 1992, name: "Kathleen Conery",          role: "Costume Design" },
  { year: 1992, name: "Laura Frank",              role: "Electrician" },
  { year: 1992, name: "Kathleen Mary Mulligan",   role: "Actor" },
  { year: 1992, name: "Adam Steinbock",           role: "Master Electrician" },
  { year: 1992, name: "David Studwell",           role: "Actor" },
  { year: 1993, name: "Burt Gildersleeve",        role: "Master Carpenter" },
  { year: 1993, name: "Steven Hauck",             role: "Actor" },
  { year: 1993, name: "Richard Pelzman",          role: "Actor" },
  { year: 1993, name: "Laura Sims",               role: "Stage Manager" },
  { year: 1993, name: "Deborah Jean Templin",     role: "Actor" },
  { year: 1993, name: "Johanna Wagner",           role: "Electrician" },
  { year: 1993, name: "Michael Williams",         role: "Master Electrician" },
  { year: 1994, name: "Rob Curatolo",             role: "Master Carpenter" },
  { year: 1994, name: "Greg Mitchell",            role: "Actor" },
  { year: 1994, name: "Mary Rose Synek",          role: "Actor" },
  { year: 1994, name: "Brenda Thomas",            role: "Actor" },
  { year: 1995, name: "Mark M. Cryer",            role: "Actor" },
  { year: 1995, name: "Ken East",                 role: "Scenic Artist" },
  { year: 1995, name: "Susan Hein",               role: "Stage Manager" },
  { year: 1995, name: "Trish Jenkins",            role: "Actor" },
  { year: 1995, name: "Jens Martin Krummel",      role: "Actor" },
  { year: 1995, name: "Elizabeth A. Oberle",      role: "Stage Manager" },
  { year: 1995, name: "Dathan Williams",          role: "Actor" },
  { year: 1996, name: "Wendy Freeman",            role: "Stage Manager" },
  { year: 1996, name: "David B. Heuvelman",       role: "Actor" },
  { year: 1996, name: "Tamara Honesty",           role: "Scenic Artist" },
  { year: 1996, name: "Lou Markert",              role: "Actor" },
  { year: 1996, name: "Ty M. Prewitt",            role: "Stage Manager" },
  { year: 1996, name: "Missy Thibodeaux",         role: "Actor" },
  { year: 1996, name: "Bradley Thoennes",         role: "Actor" },
  { year: 1997, name: "Kevin Connell",            role: "Actor" },
  { year: 1997, name: "Daryll Heysham",           role: "Actor" },
  { year: 1997, name: "Rose Liberaee",            role: "Actor" },
  { year: 1997, name: "Maggie McClellan",         role: "Actor" },
  { year: 1997, name: "Christopher Sorenson",     role: "Actor" },
  { year: 1998, name: "Steve Brady",              role: "Actor" },
  { year: 1998, name: "Dennis Fox",               role: "Actor" },
  { year: 1998, name: "Joyce Lee",                role: "Actor" },
  { year: 1998, name: "Nancy Lipschultz",         role: "Actor" },
  { year: 1999, name: "Mary Baird",               role: "Actor" },
  { year: 1999, name: "Jerry Bradley",            role: "Actor" },
  { year: 1999, name: "Kelly Ground",             role: "Actor" },
  { year: 1999, name: "William Richert",          role: "Actor" },
  { year: 1999, name: "Tim True",                 role: "Actor" },
  { year: 2000, name: "Tracey Huffman",           role: "Actor" },
  { year: 2000, name: "Marc Moritz",              role: "Actor" },
  { year: 2000, name: "Brian Russell",            role: "Actor" },
  { year: 2001, name: "John Payne",               role: "Actor" },
  { year: 2001, name: "Sarah Brown",              role: "Actor" },
  { year: 2001, name: "Stephan Wolfert",          role: "Actor" },
  { year: 2001, name: "Franz Jones",              role: "Actor" },
  { year: 2001, name: "Joe Hickey",               role: "Actor" },
  { year: 2002, name: "Sarah K. Chalmers",        role: "Actor" },
  { year: 2002, name: "Laurence Drozd",           role: "Actor" },
  { year: 2002, name: "Jan Rogge",                role: "Actor" },
  { year: 2003, name: "Godfrey L. Simmons Jr.",   role: "Actor" },
  { year: 2004, name: "Patrick Rameau",           role: "Actor" },
  { year: 2004, name: "Laura Beth Wells",         role: "Actor" },
  { year: 2004, name: "Peter Zazzali",            role: "Actor" },
  { year: 2005, name: "Tom Demenkoff",            role: "Actor" },
  { year: 2005, name: "Carolyn Goelzer",          role: "Actor" },
  { year: 2005, name: "Martin Hillier",           role: "Actor" },
  { year: 2005, name: "Alex Kinney",              role: "Actor" },
  { year: 2006, name: "Charles Goforth",          role: "Actor" },
  { year: 2006, name: "Ed Schiff",                role: "Actor" },
  { year: 2006, name: "Charles Stransky",         role: "Actor" },
  { year: 2006, name: "Kathleen Turco-Lyon",      role: "Actor" },
  { year: 2007, name: "Jeff Guyton",              role: "Actor" },
  { year: 2007, name: "Paul Hebron",              role: "Actor" },
  { year: 2007, name: "J.G. Hertzler",            role: "Actor" },
  { year: 2007, name: "Sonja Lanzener",           role: "Actor" },
  { year: 2008, name: "Michael Kaplan",           role: "Actor" },
];

const TABS = ["Current Faculty", "Notable Alumni", "Theatre Associates"] as const;


interface Faculty { name: string; title: string; bioUrl: string }

function facultyHeadshotSrc(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `/faculty/${slug}.jpg`;
}

const FACULTY: Faculty[] = [
  { name: "Samantha Noelle Sheppard", title: "Professor and Chair", bioUrl: "https://pma.cornell.edu/samantha-noelle-sheppard" },
  { name: "Karen Jaime",              title: "Associate Professor, Director of Graduate Studies", bioUrl: "https://pma.cornell.edu/karen-jaime" },
  { name: "David M. Feldshuh",        title: "Professor, Director of Undergraduate Studies", bioUrl: "https://pma.cornell.edu/david-m-feldshuh" },
  { name: "Christine Bacareza Balance", title: "Associate Professor", bioUrl: "https://pma.cornell.edu/christine-bacareza-balance" },
  { name: "Sarah E. Bernstein",       title: "Full Teaching Professor", bioUrl: "https://pma.cornell.edu/sarah-e-bernstein" },
  { name: "Theo Black",               title: "Associate Teaching Professor", bioUrl: "https://pma.cornell.edu/theo-black" },
  { name: "Austin Bunn",              title: "Professor, Koenig Jacobson Sesquicentennial Fellow", bioUrl: "https://pma.cornell.edu/austin-bunn" },
  { name: "Warren Dennis Cross",      title: "Full Teaching Professor", bioUrl: "https://pma.cornell.edu/warren-dennis-cross" },
  { name: "J. Ellen Gainor",          title: "Professor", bioUrl: "https://pma.cornell.edu/j-ellen-gainor" },
  { name: "Sabine Haenni",            title: "Professor", bioUrl: "https://pma.cornell.edu/sabine-haenni" },
  { name: "Doorim Kim",               title: "Associate Teaching Professor", bioUrl: "https://pma.cornell.edu/doorim-kim" },
  { name: "Bruce A. Levitt",          title: "Professor", bioUrl: "https://pma.cornell.edu/bruce-levitt" },
  { name: "Beth Frances Milles",      title: "Associate Professor", bioUrl: "https://pma.cornell.edu/beth-frances-milles" },
  { name: "Juan Manuel Aldape Muñoz", title: "Assistant Professor", bioUrl: "https://pma.cornell.edu/juan-manuel-aldape-munoz" },
  { name: "Mendi Obadike",            title: "Professor", bioUrl: "https://pma.cornell.edu/mendi-obadike" },
  { name: "Jeffrey Palmer",           title: "Associate Professor", bioUrl: "https://pma.cornell.edu/jeffrey-palmer" },
  { name: "Natasha Raheja",           title: "Assistant Professor", bioUrl: "https://pma.cornell.edu/natasha-raheja" },
  { name: "Danielle Russo",           title: "Assistant Professor of the Practice", bioUrl: "https://pma.cornell.edu/danielle-russo" },
  { name: "Nick Salvato",             title: "Frederic J. Whiton Professor of Liberal Studies", bioUrl: "https://pma.cornell.edu/nick-salvato" },
  { name: "Aoise Stratford",          title: "Senior Lecturer and Advising Dean", bioUrl: "https://pma.cornell.edu/aoise-stratford" },
  { name: "Kristen Warner",           title: "Associate Professor", bioUrl: "https://pma.cornell.edu/kristen-warner" },
  { name: "Sara Warner",              title: "Associate Professor", bioUrl: "https://pma.cornell.edu/sara-warner" },
];

function PersonCard({ rpta }: { rpta: RPTA }) {
  const [hovered, setHovered] = useState(false);
  const [missing, setMissing] = useState(false);
  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          aspectRatio: "1 / 1",
          width: "100%",
          background: "#f0ede8",
          borderRadius: 2,
          overflow: "hidden",
          transform: hovered ? "translateY(-3px)" : "none",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "default",
        }}
      >
        {!missing && (
          <img
            src={headshotSrc(rpta.name)}
            alt={rpta.name}
            loading="lazy"
            onError={() => setMissing(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        )}
      </div>
      <div style={{ paddingTop: 10 }}>
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          color: ESPRESSO,
          margin: 0,
          lineHeight: "17px",
          letterSpacing: "-0.01em",
        }}>
          {rpta.name}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 2 }}>
          <p style={{
            fontSize: 10,
            color: MUTED,
            margin: 0,
            letterSpacing: "0.02em",
          }}>
            {rpta.role}
          </p>
          <span style={{
            fontSize: 9,
            color: "#b4b4ba",
            letterSpacing: "0.06em",
          }}>
            {rpta.year}
          </span>
        </div>
      </div>
    </div>
  );
}

function FacultyCard({ f }: { f: Faculty }) {
  const [hovered, setHovered] = useState(false);
  const [missing, setMissing] = useState(false);
  return (
    <a
      href={f.bioUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Read ${f.name}'s faculty biography (opens in a new tab)`}
      style={{ display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          aspectRatio: "1 / 1",
          width: "100%",
          background: "#f0ede8",
          borderRadius: 2,
          overflow: "hidden",
          transform: hovered ? "translateY(-3px)" : "none",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
      >
        {!missing && (
          <img
            src={facultyHeadshotSrc(f.name)}
            alt={f.name}
            loading="lazy"
            onError={() => setMissing(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        )}
      </div>
      <div style={{ paddingTop: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: hovered ? CARNELIAN : ESPRESSO, margin: 0, lineHeight: "17px", letterSpacing: "-0.01em", transition: "color 0.2s ease" }}>
          {f.name}
        </p>
        <p style={{ fontSize: 10, color: MUTED, margin: "3px 0 0", lineHeight: "14px", letterSpacing: "0.02em" }}>
          {f.title}
        </p>
      </div>
    </a>
  );
}


interface Alumnus { name: string; affiliation: string; blurb: string }
interface AlumniEra { numeral: string; title: string; range: string; people: Alumnus[] }

const ALUMNI_PHOTOS: Record<string, string> = {
  "Paul Green": "paulgreen.jpeg",
  "Franchot Tone": "franchottone.jpg",
  "Gene Saks": "genesaks.jpg",
  "Harold Gould": "haroldgould.jpg",
  "Christopher Reeve": "christopherreeve.webp",
  "Paula Vogel": "paulavogel.jpg",
  "Robert Schenkkan": "robertschenkkan.jpg",
  "Jimmy Smits": "jimmysmits.jpg",
  "Jane Lynch": "janelynch.webp",
  "Jason Ardizzone-West": "jasonardizzonewest.jpg",
  "Sam Gold": "samgold.jpg",
  "Dana Lerner": "danalerner.webp",
  "Gloria Majule": "gloriamajule.jpg",
};

function alumnusHeadshotSrc(name: string): string {
  const suppliedPhoto = ALUMNI_PHOTOS[name];
  if (suppliedPhoto) return `/alumni/${suppliedPhoto}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `/alumni/${slug}.jpg`;
}

const ALUMNI_INTRO =
  "Alumni are grouped by their time at Cornell. Each profile highlights notable work in theatre and related fields.";

const ALUMNI_ERAS: AlumniEra[] = [
  {
    numeral: "I",
    title: "The Founding Era",
    range: "through 1988/89",
    people: [
      {
        name: "Paul Green",
        affiliation: "Graduate study, 1922–1923",
        blurb: "A Pulitzer Prize winner for In Abraham's Bosom (1927) and later the author of The Lost Colony and sixteen other outdoor dramas, Green spent a year in graduate study in philosophy at Cornell before returning to the University of North Carolina as an assistant professor in 1923. Though he trained as a dramatist under Frederick H. Koch and the Carolina Playmakers at Chapel Hill rather than in Ithaca, he continued writing during his Cornell year, publishing “Carolina Sketches” in Raleigh's News and Observer, work that contained the germ of material he later developed in Potter's Field and This Body the Earth.",
      },
      {
        name: "Franchot Tone",
        affiliation: "Class of 1927",
        blurb: "President of the Cornell Dramatic Club, where he trained in the program founded by A. M. Drummond, Tone gave up a place in the family business for the stage. He became a founding member of the Group Theatre and an Academy Award nominee for Mutiny on the Bounty (1935), and was a leading man of the American stage and screen through the 1930s and 1940s.",
      },
      {
        name: "Gene Saks",
        affiliation: "Class of 1943",
        blurb: "An inductee of the American Theater Hall of Fame who received seven Tony Award nominations for direction and won three of them, for I Love My Wife, Brighton Beach Memoirs, and Biloxi Blues. He was Neil Simon's principal director on both stage and screen, with credits including Mame, The Odd Couple, and Same Time, Next Year.",
      },
      {
        name: "Harold Gould",
        affiliation: "M.A. 1948, Ph.D. 1953",
        blurb: "An award-winning actor of stage, film, and television who took his graduate degrees at Cornell in theater and in dramatic speech and literature. He returned to campus in September 1997 to play Willy Loman in the Center for Theatre Arts production of Death of a Salesman, opposite his wife, Lea Vernon, B.A. '48, M.A. '53.",
      },
      {
        name: "Christopher Reeve",
        affiliation: "Class of 1974",
        blurb: "A double major in English and music theory who performed widely in campus productions before continuing his training at the Juilliard School, Reeve went on to a career in film, on Broadway, and, after 1995, in advocacy for spinal cord research. He is commemorated at the Schwartz Center by a plaque unveiled in 2006 and by an endowed scholarship for undergraduates in theatre, film, music, and English.",
      },
      {
        name: "Paula Vogel",
        affiliation: "M.A. 1976, Ph.D. 2016",
        blurb: "A playwright of the first rank whose How I Learned to Drive received the Pulitzer Prize for Drama. Her play Indecent was later produced on Broadway, and she returned to Cornell for a doctorate four decades after her master's degree.",
      },
      {
        name: "Robert Schenkkan",
        affiliation: "M.F.A. 1977",
        blurb: "A graduate of the Theatre Arts M.F.A. program who won the Pulitzer Prize for Drama in 1992 for The Kentucky Cycle and the Tony Award for Best Play in 2014 for All the Way. He has also worked extensively as a screenwriter, with three Emmy nominations and a Writers Guild of America Award.",
      },
      {
        name: "Jimmy Smits",
        affiliation: "M.F.A. 1982",
        blurb: "An Emmy-winning actor whose Broadway credits include the Pulitzer Prize–winning Anna in the Tropics and God of Carnage. He performed on the Cornell stage and with the university's summer repertory company (then the Ithaca Repertory Theatre, now the Hangar Theatre), and returned to the Schwartz Center in December 2011 to receive the Cornell Alumni Artist Award.",
      },
      {
        name: "Jane Lynch",
        affiliation: "M.F.A. 1984",
        blurb: "An Emmy and Golden Globe winner best known for her work in Glee, with later credits including The Marvelous Mrs. Maisel, who took her graduate degree in theater at Cornell.",
      },
    ],
  },
  {
    numeral: "II",
    title: "The Center for Theatre Arts & Schwartz Center Era",
    range: "1988/89–2010",
    people: [
      {
        name: "Jason Ardizzone-West",
        affiliation: "Class of 1995",
        blurb: "A set designer for Broadway, television, and concert stages whose credits include the Broadway musical Redwood. He came to Cornell through the five-year Bachelor of Architecture program but spent much of his time at the Center for Theatre Arts, studying in classes and independent study with set design professor Kent Goetz.",
      },
      {
        name: "Sam Gold",
        affiliation: "Class of 2000",
        blurb: "A stage director who won the Tony Award for Best Direction of a Musical for Fun Home, with a further Tony nomination for direction of a play and four Drama Desk nominations. He has directed extensively on Broadway and off-Broadway.",
      },
    ],
  },
  {
    numeral: "III",
    title: "The Contemporary Era",
    range: "2010 to the present",
    people: [
      {
        name: "Dana Lerner",
        affiliation: "Class of 2014",
        blurb: "A theatre arts major, with a minor in visual studies, who became a Tony Award–nominated producer in 2017 for Indecent. She has since worked with Broadway Across America and founded her own creative consultancy.",
      },
      {
        name: "Gloria Majule",
        affiliation: "Class of 2017",
        blurb: "A playwright and storyteller from Dodoma, Tanzania, awarded a MacDowell Fellowship and commissions from Audible and the Atlantic Theater Company. She graduated summa cum laude from Cornell and was the first African woman to receive an M.F.A. in Playwriting from the Yale School of Drama.",
      },
    ],
  },
];

function AlumnusEntry({ a, last }: { a: Alumnus; last: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [missing, setMissing] = useState(false);
  const mobile = useIsMobile();
  return (
    <div style={{
      display: "flex",
      flexDirection: mobile ? "column" : "row",
      gap: mobile ? 14 : 28,
      padding: mobile ? "22px 0" : "26px 0",
      borderBottom: last ? "none" : `1px solid ${RULE}`,
      alignItems: "flex-start",
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: mobile ? 74 : 104,
          height: mobile ? 92 : 128,
          flexShrink: 0,
          background: "#f0ede8",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {!missing && (
          <img
            src={alumnusHeadshotSrc(a.name)}
            alt={a.name}
            loading="lazy"
            onError={() => setMissing(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: ESPRESSO, margin: 0, letterSpacing: "-0.01em" }}>
          {a.name}
        </p>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12.5, color: CARNELIAN, margin: "3px 0 10px" }}>
          {a.affiliation}
        </p>
        <p style={{ fontSize: 13, lineHeight: "21px", color: "#4c4c52", margin: 0 }}>
          {a.blurb}
        </p>
      </div>
    </div>
  );
}

type NavConfig = { onHome?: () => void; onDirectory?: () => void; onPreSchwartz?: () => void; onSchwartz?: () => void };

export default function DirectoryPage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
  const [activeTab, setActiveTab] = useState(0);
  const [atHero, setAtHero] = useState(true);
  const mobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setAtHero(window.scrollY < 240 * pageZoom());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sorted = [...ALL_RPTAS].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));

  return (
    <div style={{ background: "#ffffff", minHeight: "calc(100vh / var(--pz, 1))", fontFamily: "Inter, sans-serif" }}>
      <Nav {...(navProps ?? {})} onHome={onHome} transparent={atHero} light={!atHero} />
      <div style={{
        backgroundImage: "url(/pr_front.png)",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(14,14,18,0.68)" }} />
        <div style={{ padding: mobile ? "104px 20px 36px" : "156px 80px 64px", position: "relative" }}>
          <Reveal y={16}>
            <h1 style={{
              fontFamily: "Saira Condensed, sans-serif",
              fontSize: mobile ? 40 : 64,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: mobile ? "42px" : "60px",
              textTransform: "uppercase",
              margin: 0,
            }}>
              People of PMA
            </h1>
          </Reveal>
        </div>
      </div>
      <div style={{ padding: mobile ? "0 6px" : "0 80px", borderBottom: `1px solid ${RULE}` }}>
        <div style={{ display: "flex", overflowX: "auto" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: mobile ? "13px 13px" : "13px 22px",
                whiteSpace: "nowrap",
                background: "none",
                border: "none",
                borderBottom: activeTab === i ? `2px solid ${ESPRESSO}` : "2px solid transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: activeTab === i ? 600 : 400,
                color: activeTab === i ? ESPRESSO : MUTED,
                transition: "color 0.15s, border-color 0.15s",
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 2 && (
        <div style={{ padding: mobile ? "30px 16px 64px" : "48px 80px 96px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)",
            gap: "32px 20px",
          }}>
            {sorted.map((rpta, i) => (
              <Reveal key={i} delay={(i % 6) * 55}>
                <PersonCard rpta={rpta} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
      {activeTab === 0 && (
        <div style={{ padding: mobile ? "30px 16px 64px" : "48px 80px 96px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)",
            gap: "32px 20px",
          }}>
            {FACULTY.map((f, i) => (
              <Reveal key={i} delay={(i % 6) * 55}>
                <FacultyCard f={f} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
      {activeTab === 1 && (
        <div style={{ padding: mobile ? "34px 20px 72px" : "56px 80px 96px" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <Reveal y={16}>
              <p style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: mobile ? 14 : 15.5,
                lineHeight: mobile ? "23px" : "26px",
                color: "#5a5a60",
                margin: 0,
                maxWidth: 720,
              }}>
                {ALUMNI_INTRO}
              </p>
            </Reveal>

            {ALUMNI_ERAS.map((era) => (
              <div key={era.numeral} style={{ marginTop: mobile ? 44 : 56 }}>
                <Reveal y={14}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: CARNELIAN }}>
                      {era.numeral}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>
                      {era.range}
                    </span>
                  </div>
                  <h2 style={{
                    fontFamily: "Saira Condensed, sans-serif",
                    fontSize: mobile ? 24 : 30,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.01em",
                    color: ESPRESSO,
                    margin: 0,
                    lineHeight: mobile ? "26px" : "32px",
                  }}>
                    {era.title}
                  </h2>
                  <div style={{ height: 2, background: CARNELIAN, width: 44, marginTop: 14 }} />
                </Reveal>
                <div style={{ marginTop: 6 }}>
                  {era.people.map((a, i) => (
                    <Reveal key={a.name} delay={i * 45}>
                      <AlumnusEntry a={a} last={i === era.people.length - 1} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}

            <p style={{
              fontSize: 11,
              lineHeight: "18px",
              color: "#b0b0b6",
              fontStyle: "italic",
              marginTop: mobile ? 44 : 56,
              paddingTop: 20,
              borderTop: `1px solid ${RULE}`,
              maxWidth: 720,
            }}>
              Cornell affiliations and career details were verified against the Cornell Chronicle, the Cornell Daily Sun,
              Ezra magazine, the department's alumni profiles, and Cornell events records.
            </p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
