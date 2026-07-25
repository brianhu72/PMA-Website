import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "./scale";

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return mobile;
}
