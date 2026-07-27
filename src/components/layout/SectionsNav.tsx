import { useState } from "react";

type SectionKey = "pre-schwartz" | "schwartz" | null;

const SECTIONS: { n: string; title: string; dates: string; key: SectionKey }[] = [
  { n: "I",   title: "Before the Center",   dates: "1880 – 1988",    key: "pre-schwartz" },
  { n: "II",  title: "The Schwartz Years",  dates: "1988 – 2011",    key: "schwartz" },
  { n: "III", title: "Emergence of PMA", dates: "2011 – Present", key: null },
];

interface SectionsNavProps {
  active?: SectionKey;            // the current page's section - shown non-clickable
  onPreSchwartz?: () => void;
  onSchwartz?: () => void;
  align?: "left" | "center";
}

function Row({
  s, isActive, onClick, align,
}: {
  s: (typeof SECTIONS)[number];
  isActive: boolean;
  onClick?: () => void;
  align: "left" | "center";
}) {
  const [hover, setHover] = useState(false);
  const enabled = !!s.key && !isActive;
  const titleColor = !enabled
    ? "rgba(255,255,255,0.3)"
    : hover
    ? "#ffffff"
    : "rgba(255,255,255,0.68)";

  return (
    <div
      onClick={enabled ? onClick : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 24,
        padding: "9px 0",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        cursor: enabled ? "pointer" : "default",
      }}
    >
      <span style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
        <span style={{
          fontFamily: "'Saira Condensed', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: enabled ? "#b31b1b" : "rgba(179,27,27,0.45)",
          width: 16,
          flexShrink: 0,
          textAlign: align === "center" ? "right" : "left",
        }}>
          {s.n}
        </span>
        <span style={{
          fontSize: 12.5,
          fontWeight: 500,
          letterSpacing: "-0.06px",
          color: titleColor,
          transition: "color 0.15s ease",
          whiteSpace: "nowrap",
        }}>
          {s.title}
        </span>
      </span>
      <span style={{
        fontSize: 10,
        letterSpacing: "0.03em",
        color: "rgba(255,255,255,0.28)",
        whiteSpace: "nowrap",
      }}>
        {s.dates}
      </span>
    </div>
  );
}

export default function SectionsNav({
  active = null,
  onPreSchwartz,
  onSchwartz,
  align = "left",
}: SectionsNavProps) {
  const nav = (key: SectionKey) => {
    if (key === "pre-schwartz") onPreSchwartz?.();
    if (key === "schwartz") onSchwartz?.();
  };

  return (
    <div style={{
      maxWidth: 440,
      width: "100%",
      margin: align === "center" ? "0 auto" : undefined,
    }}>
      <p style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.32)",
        marginBottom: 4,
        textAlign: align,
      }}>
        Sections
      </p>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {SECTIONS.map(s => (
          <Row
            key={s.n}
            s={s}
            isActive={s.key === active}
            onClick={() => nav(s.key)}
            align={align}
          />
        ))}
      </div>
    </div>
  );
}
