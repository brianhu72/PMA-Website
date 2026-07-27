import { useEffect, useRef, useState } from "react";
import Upscaled_Schwartz from "../../assets/upscaled_schwartz.png";
import Fireworks from "../ui/Fireworks";
import { useIsMobile } from "../../lib/useIsMobile";

const SLIDES: { src: string; position: string; label: string; fireworks?: boolean }[] = [
  { src: "/hero_jero-upscaled.png",     position: "center center", label: "Before the Center" },
  { src: "/hero_filmset.jpg",           position: "center center", label: "Media Arts" },
  { src: Upscaled_Schwartz,             position: "left bottom",   label: "The Schwartz Years", fireworks: true },
  { src: "/scans-sz/arturoui_03.jpg",   position: "center center", label: "The Resistible Rise of Arturo Ui" },
  { src: "/scans-sz/cradle_03.jpg",     position: "center center", label: "The Cradle Will Rock" },
  { src: "/scans/springdance87_08.jpg", position: "center center", label: "Spring Dance" },
];

const HOLD_MS = 5500;   // time each slide stays before advancing
const FADE_MS = 1600;   // crossfade duration

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const [btnHovered, setBtnHovered] = useState(false);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const activeRef = useRef(active);
  const reduce = prefersReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => { activeRef.current = active; }, [active]);

  const showSlide = (next: number) => {
    if (next === activeRef.current) return;
    setPrevious(activeRef.current);
    setActive(next);
  };

  useEffect(() => {
    const id = setInterval(() => showSlide((activeRef.current + 1) % SLIDES.length), HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: mobile ? "100svh" : "calc(100vh / var(--pz, 1))",
        minHeight: mobile ? 580 : 851,
        overflow: "hidden",
        backgroundColor: "#141418",
      }}
    >
      {SLIDES.map((slide, i) => {
        const isActive = i === active;
        return (
          <img
            key={i}
            src={slide.src}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: slide.position,
              opacity: isActive ? 0.85 : 0,
              transform: reduce ? "translateX(0)" : isActive ? "translateX(0)" : i === previous ? "translateX(-3%)" : "translateX(3%)",
              transition: reduce
                ? `opacity ${FADE_MS}ms ease`
                : `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease-out`,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(14,14,18,0.92) 0%, rgba(14,14,18,0.6) 34%, rgba(14,14,18,0.15) 68%, rgba(14,14,18,0.35) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: mobile ? 20 : 56,
          right: mobile ? 20 : undefined,
          top: mobile ? "clamp(104px, 17svh, 148px)" : 140,
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "2px",
            color: "#e02929",
            margin: mobile ? "0 0 20px" : "0 0 26px",
            textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          Est. 1909 · Ithaca, New York
        </p>

        <p
          style={{
            fontFamily: "Saira Condensed, sans-serif",
            fontSize: mobile ? "clamp(40px, 13vw, 60px)" : "min(66px, 7vw)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            color: "#ffffff",
            margin: 0,
            whiteSpace: mobile ? "normal" : "nowrap",
          }}
        >
          Over a <span style={{ color: "#e02929" }}>century</span>
          <br />
          of theatre at <span style={{ color: "#e02929" }}>Cornell</span>
        </p>

        <div
          onClick={onExplore}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            marginTop: mobile ? 32 : 40,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: btnHovered ? "#9e1717" : "#b31b1b",
            borderRadius: 3,
            padding: mobile ? "15px 24px" : "14px 28px",
            overflow: "hidden",
            cursor: "pointer",
            transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
            boxShadow: btnHovered ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
            transition: "background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.8px",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            Explore the archive
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: mobile ? 20 : 58, bottom: mobile ? "max(28px, env(safe-area-inset-bottom))" : 48, zIndex: 1, display: "flex", gap: 10 }}>
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => showSlide(i)}
            aria-label={`Show ${s.label}`}
            style={{
              width: i === active ? 26 : 9,
              height: 4,
              padding: 0,
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              background: i === active ? "#e02929" : "rgba(255,255,255,0.35)",
              transition: "width 0.5s cubic-bezier(0.22,1,0.36,1), background 0.5s ease",
            }}
          />
        ))}
      </div>
      {SLIDES[active].fireworks && <Fireworks />}
    </section>
  );
}
