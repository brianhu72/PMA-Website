import { useEffect, useState } from "react";
import { pageZoom } from "../lib/scale";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";
import Reveal from "../components/ui/Reveal";
import { useIsMobile } from "../lib/useIsMobile";


type PhotoSet = { srcs: string[]; credit?: string };

const seq = (dir: string, prefix: string, n: number, start = 1) =>
  Array.from({ length: n }, (_, k) => `/${dir}/${prefix}_${String(start + k).padStart(2, "0")}.jpg`);

const PHOTOS: Record<string, PhotoSet> = {
  "1982–83|Hay Fever":                 { srcs: seq("scans", "hay_fever", 8) },
  "1982–83|The Imaginary Invalid":     { srcs: ["/scans/tii_01.jpg"], credit: "Production programme" },
  "1984–85|As You Desire Me":          { srcs: seq("scans", "aydm", 2), credit: "Photographs by Jon Crispin" },
  "1984–85|A Midsummer Night's Dream": { srcs: seq("scans", "midsummer", 27), credit: "The 1984 touring production" },
  "1984–85|Three Sisters":             { srcs: seq("scans", "three_sisters", 3), credit: "Photographs by Jon Crispin" },
  "1984–85|Dance Concert '85":         { srcs: seq("scans", "springdance85", 3), credit: "Photographs by Jon Crispin" },
  "1985–86|The Jero Plays":            { srcs: seq("scans", "jero", 48), credit: "Photographs by Jon Crispin" },
  "1986–87|Loose Ends":                { srcs: seq("scans", "loose_ends", 12), credit: "Photographs by Patricia Reynolds" },
  "1986–87|Dance Concert '87":         { srcs: seq("scans", "springdance87", 15), credit: "Photographs by Jon Crispin & Patricia Reynolds" },
  "1989–90|Marat/Sade":                { srcs: seq("scans-sz", "marat", 8), credit: "Photographs by Patricia Reynolds" },
  "1989–90|Cyrano":                    { srcs: seq("scans-sz", "cyrano", 4), credit: "Photographs by Patricia Reynolds" },
  "1989–90|A... My Name Is Alice":     { srcs: seq("scans-sz", "alice", 4), credit: "Photographs by Patricia Reynolds" },
  "1989–90|Dance Concert":             { srcs: seq("scans-sz", "dance90", 4), credit: "Photographs by Patricia Reynolds" },
  "1989–90|The Dance and the Railroad / The Frog Prince":
                                       { srcs: [...seq("scans-sz", "railroad", 4), ...seq("scans-sz", "frogprince", 4)], credit: "Photographs by Patricia Reynolds" },
  "1990–91|A Streetcar Named Desire":  { srcs: seq("scans-sz", "streetcar", 5), credit: "Photographs by Patricia Reynolds" },
  "1990–91|Noises Off":                { srcs: seq("scans-sz", "noisesoff", 14), credit: "Photographs by Patricia Reynolds" },
  "1990–91|Talespinners":              { srcs: seq("scans-sz", "talespinners", 14), credit: "Photographs by Patricia Reynolds" },
  "1990–91|Vinegar Tom":               { srcs: seq("scans-sz", "vinegartom", 12), credit: "Photographs by Patricia Reynolds" },
  "1990–91|West Side Story":           { srcs: seq("scans-sz", "westside", 16), credit: "Photographs by Patricia Reynolds" },
  "1990–91|Dance Concert":             { srcs: seq("scans-sz", "beehive", 10), credit: "With Jim Self and Frank Moore's Beehive" },
  "1997–98|Death of a Salesman":       { srcs: seq("scans-sz", "salesman", 22), credit: "Photographs by Adriana Rovers, Frank DiMeo & others" },
  "1997–98|You Never Can Tell":        { srcs: seq("scans-sz", "ynct", 8), credit: "Photographs by Charles Harrington & others" },
  "1998–99|A Flea in Her Ear":         { srcs: seq("scans-sz", "flea", 4), credit: "Photographs by Charles Harrington" },
  "1998–99|Equus":                     { srcs: seq("scans-sz", "equus", 12), credit: "Photographs by Charles Harrington & others" },
  "1998–99|The Brecht Project":        { srcs: seq("scans-sz", "brecht", 15), credit: "Photographs by Charles Harrington & others" },
  "1998–99|The Clink":                 { srcs: seq("scans-sz", "clink", 7), credit: "Photographs by Charles Harrington & others" },
  "1998–99|Twilight: Los Angeles":     { srcs: seq("scans-sz", "twilight", 15), credit: "Photographs by Charles Harrington & others" },
  "1998–99|Twelfth Night":             { srcs: seq("scans-sz", "twelfthnight", 11), credit: "Photographs by Nicola Kountoupes & others" },
  "1998–99|Dance Concert":             { srcs: seq("scans-sz", "dance99", 14), credit: "With the Merce Cunningham Dance Company" },
  "2004–05|The Merchant of Venice":    { srcs: seq("scans-sz", "merchant", 4) },
  "2000–01|A Piece of My Heart":       { srcs: seq("scans-sz", "pieceofheart", 5) },
  "2000–01|A View from the Bridge":    { srcs: seq("scans-sz", "viewbridge", 5) },
  "2000–01|Taming of the Shrew":       { srcs: seq("scans-sz", "shrew01", 6) },
  "2000–01|Vital Signs":               { srcs: seq("scans-sz", "vitalsigns", 6) },
  "2001–02|Cat on a Hot Tin Roof":     { srcs: seq("scans-sz", "cat", 5) },
  "2001–02|One Flew Over the Cuckoo's Nest": { srcs: seq("scans-sz", "cuckoo", 6) },
  "2001–02|The Matchmaker":            { srcs: seq("scans-sz", "matchmaker", 6) },
  "2001–02|The Rez Sisters":           { srcs: seq("scans-sz", "rezsisters", 5) },
  "2001–02|The Winter's Tale":         { srcs: seq("scans-sz", "winterstale", 6) },
  "2001–02|Waiting for Godot":         { srcs: seq("scans-sz", "godot02", 5) },
  "2001–02|Dance Concert":             { srcs: seq("scans-sz", "dance02", 4) },
  "2002–03|The Resistible Rise of Arturo Ui": { srcs: seq("scans-sz", "arturoui", 6) },
  "2002–03|Dance Concert":             { srcs: seq("scans-sz", "dance03", 4) },
  "2010–11|Big Love":                  { srcs: seq("scans-sz", "biglove", 3) },
  "2010–11|Our Town":                  { srcs: seq("scans-sz", "ourtown11", 4) },
  "2011–12|Long Ago in May":           { srcs: seq("scans-sz", "longagoinmay", 4) },
  "2011–12|Locally Grown Dance Festival": { srcs: seq("scans-sz", "lgdf12", 10) },
  "2012–13|A People":                  { srcs: seq("scans-sz", "apeople", 3) },
  "2012–13|Adding Machine":            { srcs: seq("scans-sz", "machine", 4) },
  "2012–13|Emergence":                 { srcs: seq("scans-sz", "emergence", 2) },
  "2012–13|God of Carnage":            { srcs: seq("scans-sz", "carnage", 2) },
  "2012–13|Mother of Exiles: Madre de Migrantes": { srcs: seq("scans-sz", "mother", 2) },
  "2012–13|Locally Grown Dance":       { srcs: seq("scans-sz", "lgd13", 3) },
};

const photosFor = (season: string, title: string): PhotoSet | undefined => PHOTOS[`${season}|${title}`];

type LightboxState = { title: string; season: string; srcs: string[]; credit?: string };

function sanitizeSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/['''‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function playbillSrc(seasonLabel: string, title: string): string {
  const folder = seasonLabel.replace("–", "-").replace("\u2014", "-");
  const file = sanitizeSlug(title);
  return `/playbills/${folder}/${file}.jpg`;
}

function PlaybillCard({ season, title, type, onOpen }: { season: string; title: string; type?: string; onOpen: (box: LightboxState) => void }) {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const src = playbillSrc(season, title);
  const photos = photosFor(season, title);
  const clickable = !!photos || loaded === true;

  const open = () => {
    if (photos) {
      onOpen({ title, season, srcs: photos.srcs, credit: photos.credit });
    } else if (loaded === true) {
      onOpen({ title, season, srcs: [src], credit: "Production playbill" });
    }
  };

  return (
    <div
      onClick={clickable ? open : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: clickable ? "pointer" : "default" }}
    >
      <div style={{
        width: "100%", aspectRatio: "2/3",
        background: loaded === false
          ? (TYPE_COLOR[type ?? ""] ?? "rgba(27,27,30,0.04)")
          : "transparent",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid rgba(0,0,0,0.1)`,
        position: "relative",
        boxShadow: clickable && hovered ? "0 4px 18px rgba(0,0,0,0.16)" : "none",
        transition: "box-shadow 0.2s ease",
      }}>
        <img
          src={src}
          alt={title}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            display: loaded === false ? "none" : "block",
          }}
        />
        {loaded === false && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 14,
          }}>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11, color: DARK, textAlign: "center", lineHeight: "16px", margin: 0,
              letterSpacing: "-0.027px",
            }}>
              {title}
            </p>
          </div>
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: DARK, lineHeight: "17px", letterSpacing: "-0.027px", margin: "0 0 4px" }}>
          {title}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <TypeBadge type={type} />
          {photos && (
            <span style={{ fontSize: 9, letterSpacing: "0.06em", color: MUTED, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
              {photos.srcs.length} photograph{photos.srcs.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const RED   = "#b31b1b";
const DARK  = "#1b1b1e";
const MID   = "#4c4c52";
const LIGHT = "#ffffff";
const MUTED = "#8a8a90";
const SERIF = "'Newsreader', Georgia, serif";

const TYPE_ORDER = ["Theatre", "Musical", "Dance", "Film", "Workshop", "Festival", "Guest Artists"];

type Production = {
  title: string;
  type?: "Theatre" | "Musical" | "Dance" | "Film" | "Workshop" | "Festival" | "Guest Artists" | string;
  director?: string;
  note?: string;
};

type Season = {
  label: string;
  mode: "plates" | "chronology";
  annotation?: string;
  productions: Production[];
};

const SEASONS: Season[] = [
  {
    label: "2012–13",
    mode: "plates",
    productions: [
      { title: "A People", type: "Theatre" },
      { title: "Adding Machine", type: "Musical" },
      { title: "Emergence", type: "Theatre" },
      { title: "God of Carnage", type: "Theatre" },
      { title: "Locally Grown Dance", type: "Dance" },
      { title: "Mother of Exiles: Madre de Migrantes", type: "Theatre" },
    ],
  },
  {
    label: "2011–12",
    mode: "plates",
    productions: [
      { title: "Bring On The Lumiere", type: "Musical" },
      { title: "Emily Coates & Lacina Couliably", type: "Guest Artists" },
      { title: "Flamenco Vivo", type: "Guest Artists" },
      { title: "I'm a Frayed Knot", type: "Theatre" },
      { title: "Locally Grown Dance Festival", type: "Dance" },
      { title: "Long Ago in May", type: "Theatre" },
      { title: "No Exit", type: "Theatre" },
      { title: "The Cherry Orchard", type: "Theatre" },
    ],
  },
  {
    label: "2010–11",
    mode: "plates",
    productions: [
      { title: "Big Love", type: "Theatre" },
      { title: "Locally Grown Dance Festival", type: "Dance" },
      { title: "Our Town", type: "Theatre" },
      { title: "Precious Little", type: "Theatre" },
      { title: "RubberbanDance Group", type: "Guest Artists" },
      { title: "The Pillowman", type: "Theatre" },
      { title: "Those Learned Ladies", type: "Theatre" },
    ],
  },
  {
    label: "2009–10",
    mode: "plates",
    productions: [
      { title: "Biloxi Blues", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Nice People Dancing to Good Country Music", type: "Theatre" },
      { title: "Romeo and Juliet", type: "Theatre" },
      { title: "Soiree Cabaret", type: "Musical" },
      { title: "The Government Inspector", type: "Theatre" },
      { title: "The Servant of Two Masters", type: "Theatre" },
    ],
  },
  {
    label: "2008–09",
    mode: "plates",
    productions: [
      { title: "Bernstein's Mass", type: "Musical" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Duna", type: "Guest Artists" },
      { title: "God's Ear", type: "Theatre" },
      { title: "Love's Labour's Lost", type: "Theatre" },
      { title: "Quartet for the End of Time", type: "Theatre" },
      { title: "The Body Project", type: "Theatre" },
      { title: "The History Boys", type: "Theatre" },
      { title: "The Importance of Being Earnest", type: "Theatre" },
    ],
  },
  {
    label: "2007–08",
    mode: "plates",
    productions: [
      { title: "Alice in Wonderland", type: "Theatre" },
      { title: "As You Like It", type: "Theatre" },
      { title: "Bedroom Farce", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Garth Fagan", type: "Guest Artists" },
      { title: "Good", type: "Theatre" },
      { title: "Stephen Petronio Company", type: "Guest Artists" },
      { title: "The Bourgeois Gentleman", type: "Theatre" },
      { title: "The Passion of Dracula", type: "Theatre" },
    ],
  },
  {
    label: "2006–07",
    mode: "plates",
    productions: [
      { title: "All My Sons", type: "Theatre" },
      { title: "Beatbox Bard", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "David Gordon", type: "Guest Artists" },
      { title: "Inherit the Wind", type: "Theatre" },
      { title: "Little Women", type: "Theatre" },
      { title: "Mark Morris", type: "Guest Artists" },
      { title: "Picasso at the Lapin Agile", type: "Theatre" },
      { title: "Uncommon Women", type: "Theatre" },
    ],
  },
  {
    label: "2005–06",
    mode: "plates",
    productions: [
      { title: "Comic Potential", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Merce Cunningham", type: "Guest Artists" },
      { title: "Metamorphoses", type: "Theatre" },
      { title: "Orissa Dance", type: "Guest Artists" },
      { title: "Othello", type: "Theatre" },
      { title: "The Cradle Will Rock", type: "Musical" },
      { title: "The Skin of Our Teeth", type: "Theatre" },
      { title: "Vincent in Brixton", type: "Theatre" },
    ],
  },
  {
    label: "2004–05",
    mode: "plates",
    productions: [
      { title: "5 Women Wearing the Same Dress", type: "Theatre" },
      { title: "A Raisin in the Sun", type: "Theatre" },
      { title: "Beijing Opera", type: "Guest Artists" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Jacques Brel", type: "Musical" },
      { title: "Rennie Harris Puremovement", type: "Guest Artists" },
      { title: "The Good Person of Setzuan", type: "Theatre" },
      { title: "The Merchant of Venice", type: "Theatre" },
      { title: "The Nero Project", type: "Theatre" },
    ],
  },
  {
    label: "2003–04",
    mode: "plates",
    productions: [
      { title: "Antigone", type: "Theatre" },
      { title: "Baby the Musical", type: "Musical" },
      { title: "Be Aggressive", type: "Theatre" },
      { title: "Bee-Luther-Hatchee", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Salia Ni Seydou", type: "Guest Artists" },
      { title: "The Comedy of Errors", type: "Theatre" },
      { title: "The Grapes of Wrath", type: "Theatre" },
    ],
  },
  {
    label: "2002–03",
    mode: "plates",
    productions: [
      { title: "Betty's Summer Vacation", type: "Theatre" },
      { title: "Company", type: "Musical" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Good 'N' Plenty", type: "Musical" },
      { title: "Hamlet", type: "Theatre" },
      { title: "The Miser", type: "Theatre" },
      { title: "The Resistible Rise of Arturo Ui", type: "Theatre" },
    ],
  },
  {
    label: "2001–02",
    mode: "plates",
    productions: [
      { title: "Cat on a Hot Tin Roof", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Jones/Zane Dance Co. & Others", type: "Guest Artists" },
      { title: "One Flew Over the Cuckoo's Nest", type: "Theatre" },
      { title: "The Matchmaker", type: "Theatre" },
      { title: "The Rez Sisters", type: "Theatre" },
      { title: "The Winter's Tale", type: "Theatre" },
      { title: "Waiting for Godot", type: "Theatre" },
    ],
  },
  {
    label: "2000–01",
    mode: "plates",
    productions: [
      { title: "A Piece of My Heart", type: "Theatre" },
      { title: "A View from the Bridge", type: "Theatre" },
      { title: "Amadeus", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Jazz Tap Ensemble", type: "Guest Artists" },
      { title: "Taming of the Shrew", type: "Theatre" },
      { title: "The Cocoanuts", type: "Musical" },
      { title: "Vital Signs", type: "Theatre" },
    ],
  },
  {
    label: "1999–00",
    mode: "plates",
    productions: [
      { title: "Dance Concert", type: "Dance" },
      { title: "It Runs in the Family", type: "Theatre" },
      { title: "Miss Jean Brodie", type: "Theatre" },
      { title: "Much Ado About Nothing", type: "Theatre" },
      { title: "The House of Yes", type: "Theatre" },
      { title: "The Night of the Iguana", type: "Theatre" },
      { title: "The Three Sisters", type: "Theatre" },
    ],
  },
  {
    label: "1998–99",
    mode: "plates",
    productions: [
      { title: "A Flea in Her Ear", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Equus", type: "Theatre" },
      { title: "The Brecht Project", type: "Theatre" },
      { title: "The Clink", type: "Theatre" },
      { title: "Twelfth Night", type: "Theatre" },
      { title: "Twilight: Los Angeles", type: "Theatre" },
    ],
  },
  {
    label: "1997–98",
    mode: "plates",
    productions: [
      { title: "Arcadia", type: "Theatre" },
      { title: "Crimes of the Heart", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Death of a Salesman", type: "Theatre" },
      { title: "Martha Graham", type: "Guest Artists" },
      { title: "Romeo and Juliet", type: "Theatre" },
      { title: "The Bald Soprano & The Lesson", type: "Theatre" },
      { title: "You Never Can Tell", type: "Theatre" },
    ],
  },
  {
    label: "1996–97",
    mode: "plates",
    productions: [
      { title: "All in the Timing", type: "Theatre" },
      { title: "Angels in America: Perestroika", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Illusion Theatre: Miss Evers' Boys", type: "Guest Artists" },
      { title: "Limón Dance Company", type: "Guest Artists" },
      { title: "Richard III", type: "Theatre" },
      { title: "Speed the Plow", type: "Theatre" },
      { title: "Strider", type: "Musical" },
      { title: "Tartuffe", type: "Theatre" },
    ],
  },
  {
    label: "1995–96",
    mode: "plates",
    productions: [
      { title: "Fires in the Mirror", type: "Theatre" },
      { title: "The Importance of Being Earnest", type: "Theatre" },
      { title: "Measure for Measure", type: "Theatre" },
      { title: "Oleanna", type: "Theatre" },
    ],
  },
  {
    label: "1994–95",
    mode: "plates",
    productions: [
      { title: "A Lie of the Mind", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Dancing at Lughnasa", type: "Theatre" },
      { title: "Kevin Wynn Collection", type: "Guest Artists" },
      { title: "The Glass Menagerie", type: "Theatre" },
      { title: "The House of Blue Leaves", type: "Theatre" },
      { title: "The Way of the World", type: "Theatre" },
    ],
  },
  {
    label: "1993–94",
    mode: "plates",
    productions: [
      { title: "As You Like It", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Fefu and Her Friends", type: "Theatre" },
      { title: "Jekyll and Hyde", type: "Theatre" },
      { title: "Mad Forest", type: "Theatre" },
      { title: "Red Noses", type: "Theatre" },
    ],
  },
  {
    label: "1992–93",
    mode: "plates",
    productions: [
      { title: "Dance Concert", type: "Dance" },
      { title: "My Children, My Africa", type: "Theatre" },
      { title: "The Caucasian Chalk Circle", type: "Theatre" },
      { title: "The Royal Family", type: "Theatre" },
    ],
  },
  {
    label: "1991–92",
    mode: "plates",
    productions: [
      { title: "Cabaret", type: "Musical" },
      { title: "Dance Concert", type: "Dance" },
      { title: "DanceBrazil", type: "Guest Artists" },
      { title: "Mother Goose Odyssey", type: "Theatre" },
      { title: "The Cherry Orchard", type: "Theatre" },
      { title: "The Rover", type: "Theatre" },
      { title: "Who's Afraid of Virginia Woolf", type: "Theatre" },
    ],
  },
  {
    label: "1990–91",
    mode: "plates",
    productions: [
      { title: "Ann Carlson", type: "Guest Artists" },
      { title: "A Streetcar Named Desire", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Noises Off", type: "Theatre" },
      { title: "Talespinners", type: "Theatre" },
      { title: "Vinegar Tom", type: "Theatre" },
      { title: "West Side Story", type: "Musical" },
    ],
  },
  {
    label: "1989–90",
    mode: "plates",
    productions: [
      { title: "A... My Name Is Alice", type: "Musical" },
      { title: "Cyrano", type: "Theatre" },
      { title: "Dance Concert", type: "Dance" },
      { title: "Marat/Sade", type: "Theatre" },
      { title: "The Dance and the Railroad / The Frog Prince", type: "Guest Artists" },
    ],
  },
  {
    label: "1988–89",
    mode: "plates",
    productions: [
      { title: "Winners", type: "Theatre" },
      { title: "Bette and Boo", type: "Theatre" },
      { title: "Creach/Koester", type: "Guest Artists" },
      { title: "Dance Concert", type: "Dance" },
      { title: "David Gordon Pick Up Co.", type: "Guest Artists" },
      { title: "Piaf", type: "Musical" },
      { title: "Uncle Vanya", type: "Theatre" },
      { title: "Vanities", type: "Theatre" },
      { title: "Ain't No Use", type: "Theatre" },
    ],
  },
  {
    label: "1987–88",
    mode: "chronology",
    annotation: "pre-schwartz",
    productions: [
      { title: "Twentieth Century Blues", director: "Maurice Daniels", type: "Theatre" },
      { title: "Love's Labour's Lost", director: "Bruce Levitt", type: "Theatre" },
      { title: "Cinders", director: "David Feldshuh", type: "Theatre" },
      { title: "Dance Concert '88", type: "Dance" },
      { title: "Scapin", director: "Stephen Kanee · Willard Straight Theatre", type: "Theatre" },
    ],
  },
  {
    label: "1986–87",
    mode: "chronology",
    productions: [
      { title: "Social Amnesia", type: "Theatre" },
      { title: "Merrily We Roll Along", director: "Will Pomerantz", type: "Theatre" },
      { title: "Mother Courage", director: "David Feldshuh", type: "Theatre" },
      { title: "A Christmas Carol", director: "David Feldshuh", type: "Theatre" },
      { title: "Two Gentlemen of Verona", director: "Anthony Cornish", type: "Theatre" },
      { title: "The Wedding", director: "Yuri Belov", type: "Theatre" },
      { title: "Loose Ends", director: "Bruce Levitt", type: "Theatre" },
      { title: "Dance Concert '87", type: "Dance" },
    ],
  },
  {
    label: "1985–86",
    mode: "chronology",
    productions: [
      { title: "The Jero Plays", director: "David Feldshuh", type: "Theatre" },
      { title: "Darkness at Noon", director: "Stephen Cole", type: "Theatre" },
      { title: "A Christmas Carol", director: "David Feldshuh & David Ball · Drummond Studio", type: "Theatre" },
      { title: "'Tis Pity She's a Whore", director: "Edward Payson", type: "Theatre" },
      { title: "Becoming Memories", director: "David Shookhoff", type: "Theatre" },
      { title: "Mysteries of Eleusis", director: "David Feldshuh", type: "Theatre" },
      { title: "All's Well That Ends Well", director: "Stephen Cole", type: "Theatre" },
      { title: "Dance Concert '86", type: "Dance" },
    ],
  },
  {
    label: "1984–85",
    mode: "chronology",
    annotation: "Feldshuh's first season",
    productions: [
      { title: "Beyond Therapy", director: "Stephen Cole", type: "Theatre" },
      { title: "As You Desire Me", director: "Robert Gross", type: "Theatre" },
      { title: "A Midsummer Night's Dream", director: "David Feldshuh", type: "Theatre" },
      { title: "Three Sisters", director: "Tony Cronin", type: "Theatre" },
      { title: "Dance Concert '85", type: "Dance" },
    ],
  },
  {
    label: "1983–84",
    mode: "chronology",
    annotation: "the seventy-fifth anniversary season",
    productions: [
      { title: "Waiting for Godot", director: "George Touliatos · Willard Straight Theatre", type: "Theatre" },
      { title: "Better Living", type: "Theatre" },
      { title: "The Crucible", director: "Marshall Oglesby · Willard Straight Theatre", type: "Theatre" },
      { title: "American Buffalo", director: "Tony Cronin · Drummond Studio", type: "Theatre" },
      { title: "The Beaux' Stratagem", director: "Jim Thorp · Willard Straight Theatre", type: "Theatre" },
      { title: "Our Town", director: "Tony Cronin · Drummond Studio", type: "Theatre" },
      { title: "The Sea", director: "Robert Gross · Willard Straight Theatre", type: "Theatre" },
      { title: "Dance Concert '84", type: "Dance" },
    ],
  },
  {
    label: "1982–83",
    mode: "chronology",
    productions: [
      { title: "Curse of the Starving Class", director: "Michael Maggio", type: "Theatre" },
      { title: "Streamers", director: "Dick Shank · Drummond Studio Series", type: "Theatre" },
      { title: "Early Dark", director: "Stuart White", type: "Theatre" },
      { title: "Laundry and Bourbon / Lone Star", director: "John Rainey", type: "Theatre" },
      { title: "Measure for Measure", director: "Jim Thorp", type: "Theatre" },
      { title: "The Imaginary Invalid", director: "John Rainey", type: "Theatre" },
      { title: "Hay Fever", director: "Stephen Cole", type: "Theatre" },
      { title: "Dance Concert '83", type: "Dance" },
    ],
  },
  {
    label: "1981–82",
    mode: "chronology",
    annotation: "spring season only, archival gap",
    productions: [
      { title: "Man and Superman", director: "Stephen Cole · Willard Straight Theatre", type: "Theatre" },
      { title: "A Late Snow", director: "Evamarii Johnson · Drummond Studio", type: "Theatre" },
      { title: "Wild Oats", director: "Michael Hillyer · Willard Straight Theatre", type: "Theatre" },
      { title: "Alice in Wonderland", director: "Kevin Cotter", type: "Theatre" },
      { title: "Dance Concert '82", type: "Dance" },
    ],
  },
  {
    label: "1980–81",
    mode: "chronology",
    productions: [
      { title: "Charlotte", director: "Herbert Berghof", type: "Theatre" },
      { title: "Play Strindberg", director: "Kevin Cotter", type: "Theatre" },
      { title: "One Flew Over the Cuckoo's Nest", director: "Richard Shank", type: "Theatre" },
      { title: "My Sister, My Sister", director: "Ray Aranha", type: "Theatre" },
      { title: "The Taming of the Shrew", director: "Stephen Cole", type: "Theatre" },
      { title: "In the Boom Boom Room", director: "David Rabe", type: "Theatre" },
      { title: "Medea", director: "Richard Shank", type: "Theatre" },
      { title: "Cornell Dance Concert", type: "Dance" },
      { title: "Workshop Productions", type: "Workshop" },
    ],
  },
  {
    label: "1979–80",
    mode: "chronology",
    productions: [
      { title: "Buried Child", type: "Theatre" },
      { title: "Thyestes", type: "Theatre" },
      { title: "The Importance of Being Earnest", type: "Theatre" },
      { title: "Of Mice and Men", director: "W. M. Ted Rattray", type: "Theatre" },
      { title: "The Misanthrope", director: "Paul Shyre", type: "Theatre" },
      { title: "Saint Joan", director: "Bob Hall", type: "Theatre" },
      { title: "Penthesilea", director: "Stephen Cole", type: "Theatre" },
    ],
  },
  {
    label: "1978–79",
    mode: "chronology",
    productions: [
      { title: "The House of Bernarda Alba", type: "Theatre" },
      { title: "Vietnam Revisited", type: "Theatre" },
      { title: "Keep Your Eye on Emily", director: "Stephen Cole", type: "Theatre" },
      { title: "Hamlet Festival", type: "Festival", note: "A festival of student work" },
      { title: "One-Act Play Festival", type: "Festival", note: "A festival of student work" },
    ],
  },
];

const TYPE_COLOR: Record<string, string> = {
  Theatre:       "rgba(179,27,27,0.1)",
  Musical:       "rgba(184,149,46,0.12)",
  Dance:         "rgba(60,100,200,0.1)",
  "Guest Artists": "rgba(27,27,30,0.06)",
  Film:          "rgba(50,150,80,0.1)",
  Festival:      "rgba(140,80,180,0.1)",
  Workshop:      "rgba(27,27,30,0.06)",
};
const TYPE_TEXT: Record<string, string> = {
  Theatre:       RED,
  Musical:       "#7a6018",
  Dance:         "#2a50b8",
  "Guest Artists": MID,
  Film:          "#1a7a3c",
  Festival:      "#6a35a0",
  Workshop:      MID,
};

function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  const label = type === "Guest Artists" ? "Visiting" : type;
  return (
    <span style={{
      fontSize: 9, fontWeight: 400, letterSpacing: "0.84px", textTransform: "uppercase",
      color: TYPE_TEXT[type] ?? MUTED,
      fontFamily: "Inter, sans-serif",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}


function LightboxArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dir === "prev" ? "Previous photograph" : "Next photograph"}
      style={{
        width: 30, height: 30, borderRadius: "50%",
        border: "none", padding: 0,
        background: hovered ? "rgba(255,255,255,0.12)" : "transparent",
        color: hovered ? "#ffffff" : "rgba(255,255,255,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, lineHeight: 1, cursor: "pointer",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}

function Lightbox({ box, onClose }: { box: LightboxState; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const count = box.srcs.length;
  const mobile = useIsMobile();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % count);
      if (e.key === "ArrowLeft")  setIdx(i => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [count, onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        background: "rgba(10,10,13,0.94)",
        display: "flex", flexDirection: "column",
        padding: mobile ? "20px 16px" : "28px 48px 30px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 1080, width: "100%", margin: "0 auto", display: "flex", alignItems: "baseline", gap: 16, flexShrink: 0 }}
      >
        <p style={{ fontFamily: "Saira Condensed, sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.2px", color: "#ffffff", margin: 0 }}>
          {box.title}
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0, letterSpacing: "0.13px" }}>
          {box.season}
        </p>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            marginLeft: "auto", width: 30, height: 30, borderRadius: "50%",
            border: "none", padding: 0, background: "transparent",
            color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1, cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <div
        onClick={e => { e.stopPropagation(); if (count > 1) setIdx(i => (i + 1) % count); }}
        style={{
          flex: 1, minHeight: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "22px 0", cursor: count > 1 ? "pointer" : "default",
        }}
      >
        <img
          key={box.srcs[idx]}
          src={box.srcs[idx]}
          alt={box.title}
          style={{
            maxHeight: "100%", maxWidth: "min(1080px, 100%)",
            width: "auto", height: "auto",
            boxShadow: "0 6px 44px rgba(0,0,0,0.55)",
          }}
        />
      </div>
      <div
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 1080, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexShrink: 0 }}
      >
        <p style={{ fontFamily: SERIF, fontSize: 12.5, fontStyle: "italic", color: "rgba(255,255,255,0.55)", margin: 0 }}>
          {box.credit ?? ""}
        </p>
        {count > 1 && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <LightboxArrow dir="prev" onClick={() => setIdx(i => (i - 1 + count) % count)} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", whiteSpace: "nowrap", minWidth: 54, textAlign: "center" }}>
              {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <LightboxArrow dir="next" onClick={() => setIdx(i => (i + 1) % count)} />
          </div>
        )}
      </div>
    </div>
  );
}

function PlatesSection({ season, filter, onOpen }: { season: Season; filter: string | null; onOpen: (box: LightboxState) => void }) {
  const prods = filter ? season.productions.filter(p => p.type === filter) : season.productions;
  if (prods.length === 0) return null;

  return (
    <div style={{ paddingTop: 40, paddingBottom: 48, borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
        <p style={{
          fontFamily: "Saira Condensed, sans-serif", fontSize: 20, fontWeight: 700,
          color: DARK, lineHeight: "24px", letterSpacing: "0.2px", margin: 0,
        }}>
          {season.label}
        </p>
        {season.annotation && (
          <p style={{ fontSize: 11, color: MUTED, margin: 0, fontFamily: "Inter, sans-serif", letterSpacing: "0.13px" }}>
            {season.annotation}
          </p>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "28px 20px" }}>
        {prods.map((prod, i) => (
          <PlaybillCard key={i} season={season.label} title={prod.title} type={prod.type} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function FilterTab({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "13px 20px",
        background: "none",
        border: "none",
        borderBottom: active ? `2px solid ${DARK}` : "2px solid transparent",
        cursor: "pointer",
        fontSize: 13, fontWeight: active ? 600 : 400,
        letterSpacing: "0.01em",
        color: active ? DARK : MUTED,
        fontFamily: "Inter, sans-serif",
        whiteSpace: "nowrap",
        marginBottom: -1,
        transition: "color 0.15s, border-color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function ChronologyRow({ prod, season, last, onOpen }: { prod: Production; season: string; last: boolean; onOpen: (box: LightboxState) => void }) {
  const [hovered, setHovered] = useState(false);
  const photos = photosFor(season, prod.title);

  return (
    <div
      onClick={photos ? () => onOpen({ title: prod.title, season, srcs: photos.srcs, credit: photos.credit }) : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: "0 24px",
        alignItems: "baseline",
        padding: "12px 0",
        borderBottom: !last ? `1px solid rgba(0,0,0,0.08)` : "none",
        cursor: photos ? "pointer" : "default",
        background: photos && hovered ? "rgba(0,0,0,0.02)" : "transparent",
        transition: "background 0.15s ease",
      }}
    >
      <div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 400, color: DARK, letterSpacing: "-0.027px", lineHeight: "20px" }}>
          {prod.title}
        </span>
        {prod.note && (
          <span style={{ fontSize: 11, color: MUTED, marginLeft: 10, fontFamily: "Inter, sans-serif", letterSpacing: "0.13px" }}>
            {prod.note}
          </span>
        )}
        {photos && (
          <span style={{
            fontSize: 9, letterSpacing: "0.06em", color: hovered ? RED : MUTED,
            marginLeft: 10, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
            transition: "color 0.15s ease",
          }}>
            {photos.srcs.length} photograph{photos.srcs.length === 1 ? "" : "s"}
          </span>
        )}
      </div>
      {prod.director && (
        <span style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", letterSpacing: "0.13px" }}>
          dir. {prod.director}
        </span>
      )}
      <TypeBadge type={prod.type} />
    </div>
  );
}

function ChronologySection({ season, onOpen }: { season: Season; onOpen: (box: LightboxState) => void }) {
  return (
    <div style={{ paddingTop: 40, paddingBottom: 48, borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
        <p style={{
          fontFamily: "Saira Condensed, sans-serif", fontSize: 20, fontWeight: 700,
          color: DARK, lineHeight: "24px", letterSpacing: "0.2px", margin: 0,
        }}>
          {season.label}
        </p>
        {season.annotation && (
          <p style={{ fontSize: 11, color: MUTED, margin: 0, fontFamily: "Inter, sans-serif", letterSpacing: "0.13px" }}>
            {season.annotation}
          </p>
        )}
      </div>
        <div style={{ flex: 1 }}>
          {season.productions.map((prod, i) => (
            <ChronologyRow
              key={i}
              prod={prod}
              season={season.label}
              last={i === season.productions.length - 1}
              onOpen={onOpen}
            />
          ))}
        </div>
    </div>
  );
}

type NavConfig = {
  onHome?: () => void; onDirectory?: () => void; onPreSchwartz?: () => void;
  onSchwartz?: () => void; onAbout?: () => void;
};

const ALL_TYPES = TYPE_ORDER.filter(t =>
  SEASONS.some(s => s.mode === "plates" && s.productions.some(p => p.type === t))
);

export default function RepertoryPage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [atHero, setAtHero] = useState(true);
  const mobile = useIsMobile();
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setAtHero(window.scrollY < 240 * pageZoom());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh / var(--pz, 1))", fontFamily: "Inter, sans-serif", color: DARK }}>
      <Nav {...(navProps ?? {})} onHome={onHome} transparent={atHero} light={!atHero} />
      <div style={{
        backgroundImage: "url(/jero_plays_hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center 45%",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
      }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(14,14,18,0.68)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "104px 20px 40px" : "156px 64px 64px", position: "relative" }}>

        <Reveal y={16}>
          <h1 style={{
            fontFamily: "Saira Condensed, sans-serif",
            fontSize: mobile ? 40 : 64, fontWeight: 800, lineHeight: mobile ? "42px" : "60px",
            letterSpacing: "0.3px", textTransform: "uppercase",
            color: "#ffffff", margin: 0, maxWidth: 860,
          }}>
            Productions
          </h1>
        </Reveal>

      </div></div>
      <div style={{ background: LIGHT, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "0 10px" : "0 44px", overflowX: "auto" }}>
            <div style={{ display: "flex" }}>
              <FilterTab label="All" active={filter === null} onClick={() => setFilter(null)} />
              {ALL_TYPES.map(t => (
                <FilterTab
                  key={t}
                  label={t === "Guest Artists" ? "Visiting" : t}
                  active={filter === t}
                  onClick={() => setFilter(filter === t ? null : t)}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "0 16px 64px" : "0 64px 96px" }}>
          {SEASONS.map(season => {
            const content = season.mode === "plates"
              ? <PlatesSection season={season} filter={filter} onOpen={setLightbox} />
              : filter ? null : <ChronologySection season={season} onOpen={setLightbox} />;
            return content ? <Reveal key={season.label}>{content}</Reveal> : null;
          })}

        </div>

      </div>

      <Footer />

      {lightbox && <Lightbox box={lightbox} onClose={() => setLightbox(null)} />}

    </div>
  );
}
