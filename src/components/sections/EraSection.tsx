import { useState, useEffect, useRef } from "react";
import type { Era } from "../../types";
import { useIsMobile } from "../../lib/useIsMobile";

interface EraSectionProps {
  era: Era;
  onClick?: () => void;
  image?: string;
  imageCaption?: string;
}

const CARNELIAN = "#b31b1b";

export default function EraSection({ era, onClick, image, imageCaption }: EraSectionProps) {
  const [hovered, setHovered] = useState(false);
  const [rule, setRule] = useState(136); // fallback until measured
  const numeralRef = useRef<HTMLSpanElement>(null);
  const mobile = useIsMobile();

  const endLabel = era.endYear !== null ? String(era.endYear) : "Present";

  useEffect(() => {
    if (numeralRef.current) {
      setRule(numeralRef.current.offsetLeft + numeralRef.current.offsetWidth);
    }
  }, []);

  const contentPadLeft = rule - 56 + 24; // 24px gap after the numeral's right edge

  return (
    <section
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        backgroundColor: hovered ? "#f7f7f8" : "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        borderLeft: onClick ? `4px solid ${hovered ? CARNELIAN : "transparent"}` : "none",
        padding: mobile ? "34px 20px 44px" : "52px 56px 80px 56px",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        zIndex: hovered ? 1 : 0,
        transition: "background-color 0.22s ease, border-color 0.22s ease",
      }}
    >
      <span
        ref={numeralRef}
        aria-hidden
        style={{
          position: "absolute",
          left: mobile ? 14 : 56,
          top: mobile ? -4 : -20,
          fontSize: mobile ? 150 : 340,
          fontWeight: 900,
          color: "rgba(0,0,0,0.04)",
          lineHeight: 1,
          letterSpacing: "-10px",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {era.numeral}
      </span>
      {!mobile && (
      <div
        style={{
          position: "absolute",
          left: rule,
          top: 60,
          width: 2,
          height: 180,
          backgroundColor: CARNELIAN,
        }}
      />
      )}
      <div
        style={{
          paddingLeft: mobile ? 0 : contentPadLeft,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          alignItems: mobile ? "flex-start" : "center",
          gap: mobile ? 26 : 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "2.2px", color: CARNELIAN, margin: 0, textTransform: "uppercase" }}>
            {era.label}
          </p>
          <h2
            style={{
              fontFamily: "Saira Condensed, sans-serif",
              fontSize: mobile ? 32 : 52,
              fontWeight: 700,
              lineHeight: mobile ? "34px" : "56px",
              letterSpacing: "-0.5px",
              color: "#1b1b1e",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            {era.title}
          </h2>
          <p style={{ fontSize: 14, lineHeight: "24px", color: "#4c4c52", margin: 0, maxWidth: 420 }}>
            {era.description}
          </p>
          <div style={{ marginTop: 20, width: mobile ? "100%" : 420, maxWidth: 420, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: "0.5px", color: "#8a8a90" }}>{era.startYear}</span>
              <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: "0.5px", color: "#8a8a90" }}>{endLabel}</span>
            </div>
            <div style={{ height: 1, backgroundColor: CARNELIAN }} />
          </div>
        </div>
        {image && (
          <div style={{
            marginLeft: "auto",
            transform: "rotate(2deg)",
            background: "#fff",
            padding: "8px 8px 36px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.15)",
            flexShrink: 0,
            pointerEvents: "none",
          }}>
            <img src={image} alt="" style={{ width: 230, height: 175, objectFit: "cover", display: "block" }} />
            {imageCaption && (
              <p style={{ fontSize: 9, color: "#888", textAlign: "center", marginTop: 8, letterSpacing: "0.04em", fontStyle: "italic" }}>
                {imageCaption}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
