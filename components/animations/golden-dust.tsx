'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  baseOpacity: number;
  opacity: number;
  pulseSpeed: number;
  swaySpeed: number;
  swayAmount: number;
  phase: number;
  color: string;
  glowColor: string;
}

/**
 * Signature Golden Dust particle animation for Auth (Sign In / Sign Up) pages.
 * - Buttery-smooth 60fps canvas simulation with upward convection and swaying embers.
 * - Interactive mouse repulsion / luminescence field.
 * - Golden & amber brand palette (#FF6B1A, #FFAE42, #FFD700).
 * - Full retina display scaling (DPR up to 2) and prefers-reduced-motion safety.
 */
export function GoldenDustCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let isRunning = true;
    let width = 0;
    let height = 0;

    // Mouse coordinates for interactive repulsion
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Sizing and DPR scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      if (width === 0) width = window.innerWidth;
      if (height === 0) height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Always reset transform matrix before scaling to prevent cumulative compounding
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Warm golden & brand orange palette (#FF6B1A, #FFAE42, #FFD700)
    const GOLD_COLORS = [
      { fill: '255, 107, 26', glow: 'rgba(255, 107, 26, 0.45)' },   // Brand orange
      { fill: '255, 174, 66', glow: 'rgba(255, 174, 66, 0.45)' },   // Warm amber
      { fill: '255, 215, 0', glow: 'rgba(255, 215, 0, 0.5)' },      // Pure gold
      { fill: '255, 235, 150', glow: 'rgba(255, 235, 150, 0.4)' },  // Radiant star gold
      { fill: '255, 140, 50', glow: 'rgba(255, 140, 50, 0.35)' },   // Deep amber
    ];

    const particleCount = Math.min(Math.max(Math.floor((width * height) / 14000), 45), 90);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const col = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
      const radius = 0.8 + Math.random() * 2.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseRadius: radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: prefersReducedMotion ? 0 : -(0.35 + Math.random() * 0.85), // Static if reduced motion
        baseOpacity: 0.25 + Math.random() * 0.55,
        opacity: 0.4,
        pulseSpeed: prefersReducedMotion ? 0 : 0.015 + Math.random() * 0.03,
        swaySpeed: prefersReducedMotion ? 0 : 0.01 + Math.random() * 0.02,
        swayAmount: prefersReducedMotion ? 0 : 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        color: col.fill,
        glowColor: col.glow,
      });
    }

    let time = 0;

    const render = () => {
      if (!isRunning) return;

      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render ambient background golden bokeh orbs
      const orb1X = width * 0.3 + (prefersReducedMotion ? 0 : Math.sin(time * 0.005) * 40);
      const orb1Y = height * 0.4 + (prefersReducedMotion ? 0 : Math.cos(time * 0.004) * 30);
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, Math.max(width * 0.35, 280));
      grad1.addColorStop(0, 'rgba(255, 107, 26, 0.09)');
      grad1.addColorStop(1, 'rgba(255, 107, 26, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.7 + (prefersReducedMotion ? 0 : Math.cos(time * 0.006) * 50);
      const orb2Y = height * 0.6 + (prefersReducedMotion ? 0 : Math.sin(time * 0.005) * 40);
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, Math.max(width * 0.4, 320));
      grad2.addColorStop(0, 'rgba(255, 185, 50, 0.07)');
      grad2.addColorStop(1, 'rgba(255, 185, 50, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render individual golden dust motes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Horizontal sway
          const sway = Math.sin(time * p.swaySpeed + p.phase) * p.swayAmount;
          p.x += p.vx + sway * 0.3;
          p.y += p.vy;

          // Twinkle / pulse opacity
          const pulse = Math.sin(time * p.pulseSpeed + p.phase);
          p.opacity = Math.max(0.1, Math.min(0.95, p.baseOpacity + pulse * 0.25));

          // Interactive mouse luminescence & slight repulsion
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist);
            p.x += (dx / dist) * force * 1.8;
            p.y += (dy / dist) * force * 1.8;
          }

          // Screen wrap
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        const r = Math.max(0.5, p.radius);
        const alpha = Math.min(1, p.opacity);

        // Halo glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        // Core bright ember
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(); // Single pass render for static elegance
    } else {
      animId = requestAnimationFrame(render);
    }

    // Pause when document is hidden to conserve resources
    const handleVisibilityChange = () => {
      if (prefersReducedMotion) return;
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mounted]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 w-full h-full ${className}`}
    />
  );
}
