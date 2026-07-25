export const DESIGN_WIDTH = 1440;

export const MOBILE_BREAKPOINT = 768;

export function pageZoom(): number {
  const w = document.documentElement.clientWidth;
  if (w <= 0) return 1;
  if (w < MOBILE_BREAKPOINT) return 1; // mobile: real pixels, layouts reflow
  return w / DESIGN_WIDTH;
}

export function installPageScale() {
  if (!("zoom" in document.body.style)) return; // pre-2024 Firefox: unscaled but usable

  const apply = () => {
    const z = pageZoom();
    (document.body.style as unknown as { zoom: string }).zoom = String(z);
    document.documentElement.style.setProperty("--pz", String(z));
  };

  apply();
  window.addEventListener("resize", apply);
  new ResizeObserver(apply).observe(document.documentElement);
}
