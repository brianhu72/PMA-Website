import { useEffect } from "react";
import { useIsMobile } from "../lib/useIsMobile";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";

const RED      = "#b31b1b";
const ESPRESSO = "#1b1b1e";
const MUTED    = "#8a8a90";
const RULE     = "rgba(0,0,0,0.08)";
const SOFT     = "#4c4c52";

type NavConfig = {
  onHome?: () => void; onDirectory?: () => void;
  onPreSchwartz?: () => void; onSchwartz?: () => void; onAbout?: () => void
};

const SOURCES = [
  "Production playbills, Dance Concert '89 through the 1998–99 season (project collection)",
  "Cornell Chronicle: building renaming (2001), twentieth anniversary (2009), budget cuts (2010)",
  "Cornell Daily Sun: budget cuts, restructuring, and department response (2010–2012)",
  "An American Festival program (September 1989); Center Stage departmental newsletter (c. 1990)",
  "David M. Feldshuh, Miss Evers' Boys (Dramatists Play Service)",
  "Department of Theatre Arts records & the Alexander M. Drummond Papers, Division of Rare and Manuscript Collections",
];

export default function AboutPage({ onHome, navProps }: { onHome: () => void; navProps?: NavConfig }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const mobile = useIsMobile();

  return (
    <div style={{ background: "#fff", minHeight: "calc(100vh / var(--pz, 1))", fontFamily: "Inter, sans-serif", color: ESPRESSO }}>
      <Nav {...(navProps ?? {})} onHome={onHome} light />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: mobile ? "104px 20px 72px" : "148px 0 104px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 26, height: 2, background: RED, flexShrink: 0 }} />
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, margin: 0 }}>
            About the exhibition
          </p>
        </div>
        <h1 style={{
          fontFamily: "Saira Condensed, sans-serif",
          fontSize: mobile ? 38 : 58, fontWeight: 800, lineHeight: mobile ? "40px" : "54px",
          letterSpacing: "0.3px", textTransform: "uppercase",
          color: ESPRESSO, margin: "0 0 26px",
        }}>
          Performing <span style={{ color: RED }}>&amp;</span> Media Arts
        </h1>
        <p style={{ fontSize: 20, lineHeight: "31px", letterSpacing: "-0.16px", color: ESPRESSO, margin: "0 0 64px", maxWidth: 720 }}>
          A digital history of theatre at Cornell, from the 1909 founding of the
          Cornell Dramatic Club to the present day.
        </p>
        <figure style={{ margin: "0 0 64px" }}>
          <img
            src="/scans-sz/sc_building_02.jpg"
            alt="The Schwartz Center for the Performing Arts at night"
            style={{ width: "100%", borderRadius: 2, display: "block" }}
          />
          <figcaption style={{ fontSize: 9, letterSpacing: "0.06em", color: MUTED, marginTop: 10, fontStyle: "italic" }}>
            The Schwartz Center for the Performing Arts, College Avenue, 1989.
          </figcaption>
        </figure>
        <div style={{ maxWidth: 720, marginBottom: 80 }}>
          <p style={{ fontSize: 15, lineHeight: "26px", color: SOFT, margin: "0 0 18px" }}>
            The site is organized into three broad periods: the founding years before a permanent
            home, the expansive Schwartz era under David Feldshuh, and the department's ongoing
            reinvention as Performing &amp; Media Arts. Each period draws on a distinct layer of
            primary material, administrative records and commemorative pamphlets for the early
            years, production playbills and departmental newsletters for the Schwartz era, and
            the Cornell Chronicle and Cornell Daily Sun for the period after 2010.
          </p>
          <p style={{ fontSize: 15, lineHeight: "26px", color: SOFT, margin: 0 }}>
            The Department of Performing &amp; Media Arts, housed within the College of
            Arts &amp; Sciences, trains artists, scholars, and makers through production,
            practice, and critical inquiry. Its home, the Schwartz Center for the Performing
            Arts, opened in 1989. The Resident Professional Theatre Associates program, which
            ran from 1986 to 2010 and brought Equity artists into the classroom as
            artist-teachers, is the subject of the site's Directory.
          </p>
        </div>
        <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 26, marginBottom: 64 }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, margin: "0 0 14px" }}>
            Principal sources
          </p>
          {SOURCES.map((s, i) => (
            <p key={i} style={{ fontSize: 12, lineHeight: "21px", color: SOFT, margin: 0 }}>
              {s}
            </p>
          ))}
        </div>
        <p style={{ fontSize: 12, lineHeight: "20px", color: MUTED, margin: 0, maxWidth: 560 }}>
          Compiled from the Cornell PMA Historical Archives by Bruce Levitt and the
          2026 Nexus Scholars.
        </p>

      </div>
      <Footer />
    </div>
  );
}
