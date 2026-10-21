'use client';

import { useEffect, useRef, useState } from "react";

const STEPS = [
  ["Choose", "Browse verified local kitchens and stores across active delivery areas in Ogun State."],
  ["Pay", "Pay online with Paystack. Fees are shown before you confirm — the total is the total."],
  ["Prepare", "The kitchen accepts and starts cooking. A rider is lined up so food never waits."],
  ["Ride", "A verified rider collects your order. Every status change appears live on your tracker."],
  ["Confirm", "Share your delivery PIN once the food is in your hands. No PIN, no completed order."],
] as const;

const D = "M20 70 C160 0 260 130 400 70 S640 10 760 70 S920 120 980 60";
const PATH_LENGTH_FALLBACK = 1025;

export default function Journey() {
  const [mounted, setMounted] = useState(false);
  const jrRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = pathRef.current;
    const jr = jrRef.current;
    if (!path || !jr) return;

    let len = PATH_LENGTH_FALLBACK;
    try {
      const measured = path.getTotalLength();
      if (measured && measured > 10) {
        len = measured;
      }
    } catch {
      len = PATH_LENGTH_FALLBACK;
    }

    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    const js = jr.querySelectorAll(".js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;

    const update = () => {
      if (!jr || !path) return;

      let p = 0;
      if (reduced) {
        p = 1;
      } else {
        const r = jr.getBoundingClientRect();
        const denom = r.height - window.innerHeight;
        if (denom > 0) {
          p = Math.min(1, Math.max(0, -r.top / denom));
        } else {
          const scrollableDist = window.innerHeight + r.height;
          p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / scrollableDist));
        }
      }

      // Re-measure length if layout refreshed
      try {
        const currentMeasured = path.getTotalLength();
        if (currentMeasured && currentMeasured > 10 && Math.abs(currentMeasured - len) > 5) {
          len = currentMeasured;
          path.style.strokeDasharray = `${len}`;
        }
      } catch {
        // Keep existing len
      }

      path.style.strokeDashoffset = `${len * (1 - p)}`;

      try {
        const pt = path.getPointAtLength(len * p);
        if (pt && !isNaN(pt.x) && !isNaN(pt.y)) {
          dotRef.current?.setAttribute("cx", String(pt.x));
          dotRef.current?.setAttribute("cy", String(pt.y));
        }
      } catch {
        // Fallback for non-rendered SVG environments
      }

      const stepThresholds = [0, 0.2, 0.4, 0.6, 0.8];
      js.forEach((s, i) => {
        const threshold = stepThresholds[i] ?? (i / 5);
        s.classList.toggle("on", p >= threshold - 0.02);
      });
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        update();
        rafId = 0;
      });
    };

    // Initial calculation frame
    update();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [mounted]);

  return (
    <section className="jr" id="how" ref={jrRef}>
      <div className="jin">
        <div className="container-x">
          <h2>From kitchen to door, watchfully.</h2>
          <p className="text-mut max-w-[56ch] mb-9">
            Five steps. Every one recorded and timestamped on our servers, so you always know exactly where your order is.
          </p>
          <svg
            viewBox="0 0 1000 130"
            className="w-full h-auto overflow-visible my-2"
            aria-hidden="true"
          >
            {/* Background path track */}
            <path
              d={D}
              fill="none"
              stroke="#E7E7E4"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Animated progress stroke path */}
            <path
              ref={pathRef}
              d={D}
              fill="none"
              stroke="#FF6B1A"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={PATH_LENGTH_FALLBACK}
              strokeDashoffset={PATH_LENGTH_FALLBACK}
            />
            {/* Moving progress dot */}
            <circle
              ref={dotRef}
              cx="20"
              cy="70"
              r="15"
              fill="#171717"
              stroke="#FF6B1A"
              strokeWidth="5"
            />
          </svg>
          <div className="jst">
            {STEPS.map(([t, d], i) => (
              <div key={t} className={`js ${i === 0 ? "on" : ""}`}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
