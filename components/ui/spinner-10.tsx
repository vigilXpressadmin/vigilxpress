'use client';

import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextMorphProps {
  words?: string[];
  interval?: number;
  className?: string;
}

const DEFAULT_WORDS = [
  'Loading assets ...',
  'Preparing animation ...',
  'Loading up preview ...',
];

/**
 * TextMorph Component
 * Cycles through words with subtle character-by-character blur/opacity transitions.
 * Preserves spaces and ensures clean screen reader accessibility.
 */
export function TextMorph({
  words = DEFAULT_WORDS,
  interval = 2200,
  className,
}: TextMorphProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!words || words.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  if (!words || words.length === 0) return null;

  const currentWord = words[currentIndex % words.length] || '';

  if (shouldReduceMotion) {
    return (
      <div className={cn('text-sm text-neutral-600 dark:text-neutral-400 font-medium', className)}>
        {currentWord}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center min-h-[1.5rem] overflow-hidden text-sm text-neutral-600 dark:text-neutral-400 font-medium',
        className
      )}
    >
      <span className="sr-only">{currentWord}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentWord}
          className="flex items-center justify-center tracking-normal"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentWord.split('').map((char, i) => (
            <motion.span
              key={`${currentWord}-${i}-${char}`}
              aria-hidden="true"
              className="inline-block whitespace-pre"
              variants={{
                hidden: { opacity: 0, y: 4, filter: 'blur(3px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.22, delay: i * 0.015 },
                },
                exit: {
                  opacity: 0,
                  y: -4,
                  filter: 'blur(3px)',
                  transition: { duration: 0.15 },
                },
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export interface LiquidWaveSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
  words?: string[];
  interval?: number;
  className?: string;
  spinnerClassName?: string;
}

/**
 * LiquidWaveSpinner Component
 * Unified animated circular liquid-wave loading spinner.
 * Features dual parallax wave layers, balanced circular mask geometry,
 * theme-aware colors, and screen reader / reduced-motion support.
 */
export function LiquidWaveSpinner({
  size = 'md',
  hideText,
  words = DEFAULT_WORDS,
  interval = 2200,
  className,
  spinnerClassName,
  ...props
}: LiquidWaveSpinnerProps) {
  const clipId = useId();
  const shouldReduceMotion = useReducedMotion();

  // Sizing definitions
  // sm: button / compact inline (default hides text unless explicitly disabled)
  // md: section / card loader
  // lg: full-page loader
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const svgDimensions = isSm
    ? 'w-4 h-4 sm:w-4.5 sm:h-4.5'
    : isLg
    ? 'w-20 h-20 sm:w-24 sm:h-24'
    : 'w-12 h-12 sm:w-14 sm:h-14';

  const shouldHideText = hideText ?? isSm;

  // Seamless wave path spanning 1000px (loops every 500px)
  const wavePath =
    'M 0 0 C 125 35 125 -35 250 0 C 375 35 375 -35 500 0 C 625 35 625 -35 750 0 C 875 35 875 -35 1000 0 V 420 H 0 Z';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex flex-col items-center justify-center gap-3',
        isSm ? 'gap-1.5' : isLg ? 'gap-4' : 'gap-3',
        className
      )}
      {...props}
    >
      <div className={cn('relative flex-none aspect-square', svgDimensions, spinnerClassName)}>
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full block overflow-visible"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={clipId}>
              {/* Perfectly centered circle inside 500x500 box without any edge clipping */}
              <circle cx="250" cy="250" r="107.5" />
            </clipPath>
          </defs>

          {/* Background fill behind waves */}
          <circle
            cx="250"
            cy="250"
            r="107.5"
            className="fill-brand-50/50 dark:fill-brand-950/40"
          />

          {/* Masked liquid waves */}
          <g clipPath={`url(#${clipId})`}>
            {/* Background parallax wave */}
            {shouldReduceMotion ? (
              <path
                d={wavePath}
                transform="translate(0, 240)"
                className="fill-brand-400/40 dark:fill-brand-300/30"
              />
            ) : (
              <motion.path
                d={wavePath}
                className="fill-brand-400/40 dark:fill-brand-300/30"
                animate={{
                  x: [-500, 0],
                  y: [245, 220, 245],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    duration: 4.2,
                    ease: 'linear',
                  },
                  y: {
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                  },
                }}
              />
            )}

            {/* Foreground liquid wave */}
            {shouldReduceMotion ? (
              <path
                d={wavePath}
                transform="translate(0, 235)"
                className="fill-brand-500"
              />
            ) : (
              <motion.path
                d={wavePath}
                className="fill-brand-500"
                animate={{
                  x: [0, -500],
                  y: [225, 255, 225],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    duration: 2.8,
                    ease: 'linear',
                  },
                  y: {
                    repeat: Infinity,
                    duration: 2.2,
                    ease: 'easeInOut',
                  },
                }}
              />
            )}
          </g>

          {/* Subtle outer static containment ring */}
          <circle
            cx="250"
            cy="250"
            r="107.5"
            fill="none"
            className="stroke-brand-500/25 dark:stroke-brand-400/30"
            strokeWidth={isSm ? 14 : 10}
          />

          {/* Animated decorative ring */}
          {!shouldReduceMotion && (
            <motion.circle
              cx="250"
              cy="250"
              r="107.5"
              fill="none"
              className="stroke-brand-500"
              strokeWidth={isSm ? 12 : 8}
              strokeLinecap="round"
              strokeDasharray="40 30"
              animate={{ rotate: 360 }}
              style={{ originX: '250px', originY: '250px' }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: 'linear',
              }}
            />
          )}
        </svg>
      </div>

      {!shouldHideText && (
        <TextMorph
          words={words}
          interval={interval}
          className={cn(
            isLg
              ? 'text-base font-semibold text-neutral-800 dark:text-neutral-200'
              : 'text-xs sm:text-sm text-neutral-600 dark:text-neutral-400'
          )}
        />
      )}
    </div>
  );
}

export default LiquidWaveSpinner;
