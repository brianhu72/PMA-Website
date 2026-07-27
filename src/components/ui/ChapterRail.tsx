import { useEffect, useState } from "react";
import { pageZoom } from "../../lib/scale";
import { useIsMobile } from "../../lib/useIsMobile";

const CARNELIAN = "#b31b1b";
const ESPRESSO  = "#1b1b1e";
const MUTED     = "#8a8a90";
const SERIF     = "'Newsreader', Georgia, serif";

export interface RailItem { n: string; title: string; dates?: string; id: string }

export default function ChapterRail({ toc }: { toc: RailItem[] }) {
  const [hovered, setHovered] = useState(false);
  const [activeId, setActiveId] = useState(toc[0]?.id);
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => {
      const pastHero   = window.scrollY > 380 * pageZoom();
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 320 * pageZoom();
      setVisible(pastHero && !nearBottom);
      const threshold = window.scrollY + 130 * pageZoom();
      let cur = toc[0]?.id;
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= threshold) cur = item.id;
      }
      setActiveId(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76 * pageZoom(), behavior: "smooth" });
  };

  if (mobile) {
    const active = toc.find(item => item.id === activeId) ?? toc[0];

    if (!visible) return null;

    return (
      <nav aria-label="Chapters">
        {mobileOpen && (
          <>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close chapter contents"
              style={{ position: "fixed", inset: 0, zIndex: 151, background: "rgba(14,14,18,0.35)", border: "none", padding: 0 }}
            />
            <div style={{ position: "fixed", zIndex: 152, left: 0, right: 0, bottom: 0, maxHeight: "72dvh", overflowY: "auto", background: "#ffffff", borderRadius: "18px 18px 0 0", boxShadow: "0 -12px 42px rgba(0,0,0,0.2)", padding: "18px 20px max(24px, env(safe-area-inset-bottom))" }}>
              <div style={{ width: 34, height: 4, borderRadius: 4, background: "#d5d5da", margin: "0 auto 18px" }} />
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
                <p style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: ESPRESSO, margin: 0 }}>Contents</p>
                <button onClick={() => setMobileOpen(false)} style={{ fontSize: 12, color: MUTED, padding: "6px 0" }}>Close</button>
              </div>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.09)" }}>
                {toc.map(item => {
                  const itemActive = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setMobileOpen(false); scrollTo(item.id); }}
                      style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, width: "100%", textAlign: "left", padding: "15px 0", borderBottom: "1px solid rgba(0,0,0,0.09)", background: "none" }}
                    >
                      <span style={{ fontFamily: SERIF, fontSize: 12, fontStyle: "italic", color: itemActive ? CARNELIAN : MUTED }}>{item.n}</span>
                      <span>
                        <span style={{ display: "block", fontSize: 14, fontWeight: itemActive ? 600 : 500, lineHeight: "19px", color: itemActive ? CARNELIAN : ESPRESSO }}>{item.title}</span>
                        {item.dates && <span style={{ display: "block", fontSize: 10, letterSpacing: "0.04em", color: MUTED, marginTop: 3 }}>{item.dates}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <button
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          style={{ position: "fixed", right: 16, bottom: "max(16px, env(safe-area-inset-bottom))", zIndex: 150, display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 999, background: "#ffffff", color: ESPRESSO, boxShadow: "0 6px 22px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }}
        >
          <span style={{ width: 14, height: 10, display: "inline-flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ height: 1, background: CARNELIAN }} />
            <span style={{ height: 1, background: CARNELIAN }} />
            <span style={{ height: 1, background: CARNELIAN }} />
          </span>
          {active?.title ?? "Contents"}
        </button>
      </nav>
    );
  }

  return (
    <nav
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Chapters"
      style={{
        position: "fixed",
        left: 0,
        top: "50%",
        transform: `translateY(-50%) translateX(${visible ? 0 : -14}px)`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        zIndex: 150,
        display: "flex",
        justifyContent: "flex-start",
        padding: "10px 10px 10px 22px",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        padding: hovered ? "16px 18px" : "6px 0",
        borderRadius: 12,
        background: hovered ? "rgba(255,255,255,0.94)" : "transparent",
        backdropFilter: hovered ? "blur(10px)" : "none",
        WebkitBackdropFilter: hovered ? "blur(10px)" : "none",
        boxShadow: hovered ? "0 14px 44px rgba(0,0,0,0.16)" : "none",
        border: `1px solid ${hovered ? "rgba(0,0,0,0.06)" : "transparent"}`,
        transition: "background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease, border-color 0.25s ease",
      }}>
        {toc.map(item => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              aria-label={item.title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: hovered ? 14 : 0,
                width: "100%",
                background: "none",
                border: "none",
                padding: "5px 0",
                cursor: "pointer",
              }}
            >
              <span style={{
                width: active ? 22 : 13,
                height: 2,
                borderRadius: 2,
                flexShrink: 0,
                background: active ? CARNELIAN : (hovered ? "#3a3a40" : "#c6c6cc"),
                transition: "width 0.25s ease, background 0.25s ease",
              }} />
              <span style={{
                maxWidth: hovered ? 280 : 0,
                opacity: hovered ? 1 : 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textAlign: "left",
                transition: "max-width 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.22s ease",
              }}>
                <span style={{ fontFamily: SERIF, fontSize: 11, fontStyle: "italic", color: active ? CARNELIAN : MUTED, marginRight: 8 }}>
                  {item.n}
                </span>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, letterSpacing: "-0.01em", color: active ? ESPRESSO : "#5a5a60" }}>
                  {item.title}
                </span>
                {item.dates && (
                  <span style={{ fontSize: 9, letterSpacing: "0.04em", color: "#b4b4ba", marginLeft: 10 }}>
                    {item.dates}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
