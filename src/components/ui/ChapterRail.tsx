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

  if (mobile) return null;

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
