'use client';
import { useEffect, useRef } from "react";

const STEPS = [
  ["Choose", "Browse verified local kitchens and stores across active delivery areas in Ogun State."],
  ["Pay", "Pay online with Paystack. Fees are shown before you confirm — the total is the total."],
  ["Prepare", "The kitchen accepts and starts cooking. A rider is lined up so food never waits."],
  ["Ride", "A verified rider collects your order. Every status change appears live on your tracker."],
  ["Confirm", "Share your delivery PIN once the food is in your hands. No PIN, no completed order."],
] as const;

const D = "M20 70 C160 0 260 130 400 70 S640 10 760 70 S920 120 980 60";

export default function Journey() {
  const jrRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const jr = jrRef.current;
    if (!path || !jr) return;

    let len = 0;
    try {
      len = path.getTotalLength() || 0;
    } catch {
      len = 1000;
    }
    path.style.strokeDasharray = `${len}`;
    const js = jr.querySelectorAll(".js");
    const reduced = typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      if (!jr || !path) return;
      let p = 1;
      if (!reduced) {
        const r = jr.getBoundingClientRect();
        const denom = r.height - window.innerHeight;
        p = denom > 0 ? Math.min(1, Math.max(0, -r.top / denom)) : 1;
      }
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      try {
        const pt = path.getPointAtLength(len * p);
        dotRef.current?.setAttribute("cx", String(pt.x));
        dotRef.current?.setAttribute("cy", String(pt.y));
      } catch {
        // Fallback for non-rendered SVG environments
      }
      js.forEach((s, i) => s.classList.toggle("on", p >= i / 5 - 0.02 + (i === 0 ? 0.02 : 0)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section className="jr" id="how" ref={jrRef}>
      <div className="jin">
        <div className="container-x">
          <h2>From kitchen to door, watchfully.</h2>
          <p className="text-mut max-w-[56ch] mb-9">Five steps. Every one recorded and timestamped on our servers, so you always know exactly where your order is.</p>
          <svg viewBox="0 0 1000 130" className="w-full h-auto overflow-visible my-2" aria-hidden="true">
            <path d={D} fill="none" stroke="#E7E7E4" strokeWidth="8" strokeLinecap="round" />
            <path ref={pathRef} d={D} fill="none" stroke="#FF6B1A" strokeWidth="8" strokeLinecap="round" />
            <circle ref={dotRef} r="15" fill="#171717" stroke="#FF6B1A" strokeWidth="5" />
          </svg>
          <div className="jst">
            {STEPS.map(([t, d]) => (
              <div key={t} className="js"><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}