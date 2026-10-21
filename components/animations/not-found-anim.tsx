'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

const RUNNER_SVGS = [
  '/animations/runner-1.svg',
  '/animations/runner-2.svg',
  '/animations/runner-3.svg',
  '/animations/runner-4.svg',
  '/animations/runner-5.svg',
];

interface Particle {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  vx: number;
  vy: number;
  opacity: number;
  growth: number;
  color: string;
}

export function NotFoundAnimation() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runnersContainerRef = useRef<HTMLDivElement | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    if (mq.matches) {
      setShowMessage(true);
      return;
    }

    // Snappy message reveal at 400ms
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Layer 1: Canvas circle burst and drift left animation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isCancelled = false;

    // Cap devicePixelRatio at 2 for sharpness and optimal performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize particles: circles with white/10 opacity expanding and drifting left
    const particles: Particle[] = [];
    const count = 32;

    for (let i = 0; i < count; i++) {
      const isAccent = i % 6 === 0;
      particles.push({
        x: width * 0.45 + (Math.random() - 0.5) * (width * 0.5),
        y: height * 0.5 + (Math.random() - 0.5) * (height * 0.6),
        radius: 8 + Math.random() * 20,
        maxRadius: 60 + Math.random() * 120,
        vx: -(1.5 + Math.random() * 3.5), // Drifts left
        vy: (Math.random() - 0.5) * 1.2,
        opacity: 0.14 + Math.random() * 0.12,
        growth: 0.35 + Math.random() * 0.7,
        color: isAccent ? 'rgba(255, 107, 26, ' : 'rgba(255, 255, 255, ',
      });
    }

    let frameCount = 0;
    const maxFrames = 280; // Complete loop after ~4.5s and stop RAF

    const render = () => {
      if (isCancelled) return;
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      let anyAlive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;

        // Fade out as radius approaches maxRadius
        const life = 1 - Math.min(p.radius / p.maxRadius, 1);
        const currentOpacity = p.opacity * life;

        if (life > 0.01 && p.x + p.radius > 0) {
          anyAlive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, p.radius), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity.toFixed(3)})`;
          ctx.fill();
        }
      }

      // Stop RAF loop after animation completes
      if (anyAlive && frameCount < maxFrames) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  // Layer 2: Stick-figure characters animation via the Web Animations API
  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = runnersContainerRef.current;
    if (!container) return;

    const figures = container.querySelectorAll<HTMLImageElement>('.runner-figure');
    const animations: Animation[] = [];

    figures.forEach((fig, index) => {
      const delay = index * 280;
      const duration = 2800 + index * 200;

      // WAAPI native animation
      const anim = fig.animate(
        [
          {
            transform: 'translateX(110vw) translateY(0px) scale(0.9)',
            opacity: 0,
          },
          {
            transform: 'translateX(70vw) translateY(-14px) scale(1)',
            opacity: 0.9,
            offset: 0.25,
          },
          {
            transform: 'translateX(35vw) translateY(12px) scale(1.05)',
            opacity: 1,
            offset: 0.6,
          },
          {
            transform: 'translateX(-25vw) translateY(-6px) scale(0.95)',
            opacity: 0,
          },
        ],
        {
          duration,
          delay,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards',
        }
      );

      animations.push(anim);
    });

    return () => {
      animations.forEach((a) => a.cancel());
    };
  }, [prefersReducedMotion]);

  return (
    <div className="relative min-h-[100svh] w-full bg-ink text-white overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Background radial glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-brand-500/15 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Layer 1: Canvas circle burst / drift */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      {/* Layer 2: Stick-figure runners track */}
      {!prefersReducedMotion && (
        <div
          ref={runnersContainerRef}
          className="absolute inset-x-0 bottom-12 h-36 pointer-events-none z-10 overflow-hidden"
          aria-hidden="true"
        >
          {RUNNER_SVGS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="runner-figure absolute bottom-0 left-0 w-24 h-24 opacity-0 drop-shadow-[0_4px_12px_rgba(255,107,26,0.3)]"
            />
          ))}
        </div>
      )}

      {/* Layer 3: Message Overlay */}
      <div
        className={`relative z-20 container-x max-w-xl text-center px-4 transition-all duration-300 ${
          showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {/* Logo linking home */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200"
          >
            <Image
              src="/assets/logo.png"
              alt="VigilXpress logo"
              width={48}
              height={48}
              priority
              className="mx-auto drop-shadow-[0_8px_24px_rgba(255,107,26,0.45)]"
            />
          </Link>
        </div>

        {/* Big 404 in brand orange */}
        <h1 className="text-[clamp(80px,18vw,200px)] font-extrabold text-brand-500 tracking-tighter leading-none m-0 select-none drop-shadow-[0_12px_40px_rgba(255,107,26,0.25)]">
          404
        </h1>

        {/* Heading & description */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mt-2 mb-3">
          That page is not on the menu.
        </h2>
        <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
          The link you followed might be broken, or the page may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => router.back()}
            className="glass-btn !py-3 !px-5 text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="btn-primary !py-3 !px-6 text-sm sm:text-base inline-flex items-center gap-2 no-underline shadow-lg"
          >
            <Home size={18} />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
