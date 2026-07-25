import { useState } from "react";
import Cornell_Logo from "../../assets/Cornell_Logo.png";
import { useIsMobile } from "../../lib/useIsMobile";

function MobileLink({ label, onClick, indent = false }: { label: string; onClick?: () => void; indent?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        display: "block", width: "100%", textAlign: "left",
        padding: indent ? "12px 24px 12px 40px" : "14px 24px",
        background: "none", border: "none",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        color: onClick ? (indent ? "rgba(255,255,255,0.72)" : "#ffffff") : "rgba(255,255,255,0.3)",
        fontSize: indent ? 15 : 16, fontWeight: indent ? 400 : 500,
        letterSpacing: "0.01em", cursor: onClick ? "pointer" : "default",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {label}
    </button>
  );
}

const TIME_PERIODS = [
  { numeral: "I",   title: "Before the Center",  dates: "1880 – 1989",    key: "pre-schwartz" as const },
  { numeral: "II",  title: "The Schwartz Years",  dates: "1988 – 2010",    key: "schwartz"     as const },
  { numeral: "III", title: "Emergence of PMA", dates: "2010 – Present", key: "emergence"  as const },
];

function PeriodItem({ p, onClick }: { p: (typeof TIME_PERIODS)[number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const enabled = !!p.key;
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        padding: "10px 16px",
        background: enabled && hovered ? "rgba(255,255,255,0.08)" : "transparent",
        border: "none",
        borderRadius: 8,
        cursor: enabled ? "pointer" : "default",
        textAlign: "left",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        color: !enabled ? "rgba(255,255,255,0.22)" : hovered ? "#ffffff" : "rgba(255,255,255,0.62)",
        transition: "color 0.2s ease, background 0.2s ease",
      }}
    >
      <span style={{
        display: "inline-block",
        transform: enabled && hovered ? "translateX(3px)" : "translateX(0)",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {p.title}
      </span>
    </button>
  );
}

interface NavProps {
  onHome?:         () => void;
  onDirectory?:    () => void;
  onPreSchwartz?:  () => void;
  onSchwartz?:     () => void;
  onEmergence?:    () => void;
  onAbout?:        () => void;
  onRepertory?:    () => void;
  onGuests?:       () => void;
  transparent?:    boolean;
  light?:          boolean;
}

export default function Nav({
  onHome,
  onDirectory,
  onPreSchwartz,
  onSchwartz,
  onEmergence,
  onAbout,
  onRepertory,
  onGuests,
  transparent = false,
  light = false,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useIsMobile();

  const handlePeriod = (key: "pre-schwartz" | "schwartz" | "emergence" | null) => {
    setOpen(false);
    if (key === "pre-schwartz") onPreSchwartz?.();
    if (key === "schwartz")     onSchwartz?.();
    if (key === "emergence")    onEmergence?.();
  };

  const iconColor = transparent ? "rgba(255,255,255,0.92)" : light ? "#1b1b1e" : "#ffffff";
  const pick = (fn?: () => void) => fn && (() => { setMenuOpen(false); fn(); });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: 60,
      display: "flex", alignItems: "center",
      padding: mobile ? "0 18px" : "0 var(--gutter)",
      zIndex: 200,
      backgroundColor: (menuOpen && mobile) ? "#0a0a0c" : transparent ? "transparent" : light ? "#ffffff" : "#000000",
      borderBottom: (!transparent && light && !(menuOpen && mobile)) ? "1px solid rgba(0,0,0,0.08)" : "none",
      transition: "background-color 0.4s ease",
    }}>
      <a
        href="/"
        onClick={onHome ? e => { e.preventDefault(); onHome(); } : undefined}
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        <img src={Cornell_Logo} alt="Cornell logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.04em", color: transparent ? "rgba(255,255,255,0.5)" : light ? "#8a8a90" : "var(--color-mid)" }}>
            Department of
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: "#e02929" }}>
            Performing &amp; Media Arts
          </span>
        </div>
      </a>
      {!mobile && (
      <ul style={{ marginLeft: "auto", display: "flex", gap: 48, listStyle: "none", alignItems: "center" }}>
        <li
          style={{ position: "relative" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <a
            href="#"
            onClick={e => e.preventDefault()}
            style={{
              fontSize: 13, fontWeight: 500,
              color: transparent ? "rgba(255,255,255,0.85)" : light ? "#1b1b1e" : "var(--color-mid)",
              letterSpacing: "0.02em",
              cursor: "default",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Time Periods
            <span style={{
              fontSize: 8,
              opacity: 0.55,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
            }}>▼</span>
          </a>
          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            paddingTop: 14,
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            transition: "opacity 0.22s ease",
          }}>
          <div style={{
            background: "rgba(18,18,22,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 6,
            minWidth: 208,
            transform: open ? "translateY(0) scale(1)" : "translateY(-5px) scale(0.97)",
            transformOrigin: "top center",
            transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
          }}>
            {TIME_PERIODS.map(p => (
              <PeriodItem key={p.numeral} p={p} onClick={() => handlePeriod(p.key)} />
            ))}
          </div>
          </div>
        </li>
        <li>
          <a
            href="#"
            onClick={e => { e.preventDefault(); onDirectory?.(); }}
            style={{
              fontSize: 13, fontWeight: 500,
              color: transparent ? "rgba(255,255,255,0.85)" : light ? "#1b1b1e" : "var(--color-mid)",
              letterSpacing: "0.02em",
              cursor: onDirectory ? "pointer" : "default",
            }}
          >
            Directory
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={e => { e.preventDefault(); onRepertory?.(); }}
            style={{
              fontSize: 13, fontWeight: 500,
              color: transparent ? "rgba(255,255,255,0.85)" : light ? "#1b1b1e" : "var(--color-mid)",
              letterSpacing: "0.02em",
              cursor: onRepertory ? "pointer" : "default",
            }}
          >
            Productions
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={e => { e.preventDefault(); onGuests?.(); }}
            style={{
              fontSize: 13, fontWeight: 500,
              color: transparent ? "rgba(255,255,255,0.85)" : light ? "#1b1b1e" : "var(--color-mid)",
              letterSpacing: "0.02em",
              cursor: onGuests ? "pointer" : "default",
            }}
          >
            Guest Artists
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={e => { e.preventDefault(); onAbout?.(); }}
            style={{
              fontSize: 13, fontWeight: 500,
              color: transparent ? "rgba(255,255,255,0.85)" : light ? "#1b1b1e" : "var(--color-mid)",
              letterSpacing: "0.02em",
              cursor: onAbout ? "pointer" : "default",
            }}
          >
            About
          </a>
        </li>

      </ul>
      )}
      {mobile && (
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            marginLeft: "auto", width: 40, height: 40, padding: 0,
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
          }}
        >
          <span style={{ width: 22, height: 2, background: iconColor, borderRadius: 2, transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none", transition: "transform 0.25s ease" }} />
          <span style={{ width: 22, height: 2, background: iconColor, borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s ease" }} />
          <span style={{ width: 22, height: 2, background: iconColor, borderRadius: 2, transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none", transition: "transform 0.25s ease" }} />
        </button>
      )}
      {mobile && menuOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0,
          background: "#0a0a0c",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          maxHeight: "calc(100vh - 60px)", overflowY: "auto",
        }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: 0, padding: "16px 24px 6px" }}>
            Time Periods
          </p>
          {TIME_PERIODS.map(p => (
            <MobileLink key={p.numeral} label={p.title} indent onClick={p.key ? () => handlePeriodMobile(p.key) : undefined} />
          ))}
          <div style={{ height: 8 }} />
          <MobileLink label="Directory"    onClick={pick(onDirectory)} />
          <MobileLink label="Productions"   onClick={pick(onRepertory)} />
          <MobileLink label="Guest Artists" onClick={pick(onGuests)} />
          <MobileLink label="About"         onClick={pick(onAbout)} />
        </div>
      )}
    </nav>
  );

  function handlePeriodMobile(key: "pre-schwartz" | "schwartz" | "emergence") {
    setMenuOpen(false);
    handlePeriod(key);
  }
}
