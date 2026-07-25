import type { CSSProperties } from "react";
import CornellLogo from "../../assets/Cornell_Logo.png";
import { useIsMobile } from "../../lib/useIsMobile";


const eyebrow: CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.3)",
  marginBottom: 12,
};

const line: CSSProperties = {
  fontSize: 12,
  lineHeight: "21px",
  letterSpacing: "0.02em",
  color: "rgba(255,255,255,0.42)",
  margin: 0,
};

export default function Footer() {
  const mobile = useIsMobile();
  return (
    <footer style={{ background: "#141418", padding: mobile ? "48px 20px 44px" : "72px 64px 60px", borderTop: "1px solid #222226" }}>
      <div style={{
        maxWidth: 1180,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 48,
        flexWrap: "wrap",
      }}>
        <div style={{ maxWidth: 400 }}>
          <img src={CornellLogo} alt="Cornell" style={{ width: 44, height: 44, objectFit: "contain", marginBottom: 20, opacity: 0.9 }} />
          <p style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", marginBottom: 5 }}>
            Department of
          </p>
          <p style={{ fontSize: 19, fontWeight: 600, color: "#fff", letterSpacing: "-0.2px", lineHeight: "24px", marginBottom: 18 }}>
            Performing <span style={{ color: "#b31b1b" }}>&amp;</span> Media Arts
          </p>
          <p style={{ fontSize: 13, lineHeight: "22px", color: "rgba(255,255,255,0.42)", maxWidth: 380, margin: 0 }}>
            A digital exhibition tracing over a century of theatre at Cornell, from the 1909
            founding of the Cornell Dramatic Club to the present day.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 26 : 56, paddingTop: 6 }}>
          <div style={{ maxWidth: 190 }}>
            <p style={eyebrow}>Location</p>
            <p style={line}>
              430 College Avenue
              <br />
              Ithaca, New York
              <br />
              Cornell University · Est. 1865
            </p>
          </div>
          <div style={{ maxWidth: 210 }}>
            <p style={eyebrow}>Sources</p>
            <p style={line}>
              Held in the Schwartz Center and the Division of Rare and Manuscript Collections.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
