"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/use-cart";
import {
  navigationLinks,
  type NavigationLink,
  type SubmenuItem,
} from "./navigation-links";
import { MobileMenu } from "./mobile-menu";
import { NavbarAuthSlot } from "./navbar-auth-slot";
import "./navbar-animations.css";

// ─── Desktop dropdown content renderers ────────────────────────────────────

function DescriptionPanel({ items, onLinkClick }: { items: SubmenuItem[]; onLinkClick?: () => void }) {
  return (
    <ul className="grid gap-1 p-2 w-[420px] md:grid-cols-2">
      {items.map((item) => {
        if (item.type !== "description") return null;
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className="group flex items-start gap-3 rounded-xl p-3 text-[14px] no-underline outline-none nav-interactive ring-1 ring-transparent hover:ring-black/10 dark:hover:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:ring-brand-500 focus-visible:ring-2"
            >
              <span className="flex-none mt-0.5 w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 grid place-items-center">
                <Icon
                  size={16}
                  className="text-brand-500"
                />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold text-ink dark:text-white leading-tight">
                  {item.title}
                </span>
                <span className="text-[12px] text-mut dark:text-white/50 leading-snug">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function IconPanel({ items, onLinkClick }: { items: SubmenuItem[]; onLinkClick?: () => void }) {
  return (
    <ul className="grid gap-1 p-2 w-[320px] md:grid-cols-2">
      {items.map((item) => {
        if (item.type !== "icon") return null;
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className="flex items-center gap-2.5 rounded-xl p-3 text-[14px] font-medium no-underline outline-none nav-interactive ring-1 ring-transparent hover:ring-black/10 dark:hover:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-white/80 hover:text-ink dark:hover:text-white transition-colors focus-visible:ring-brand-500 focus-visible:ring-2"
            >
              <Icon
                size={16}
                className="flex-none text-brand-500"
              />
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SimplePanel({ items, onLinkClick }: { items: SubmenuItem[]; onLinkClick?: () => void }) {
  return (
    <ul className="grid gap-0.5 p-2 w-[220px]">
      {items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            onClick={onLinkClick}
            className="block rounded-xl px-3 py-2.5 text-[14px] font-medium no-underline outline-none nav-interactive ring-1 ring-transparent hover:ring-black/10 dark:hover:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-white/80 hover:text-ink dark:hover:text-white transition-colors focus-visible:ring-brand-500 focus-visible:ring-2"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ─── Resolve which panel to render ─────────────────────────────────────────
function DropdownPanel({ children, onLinkClick }: { children: SubmenuItem[]; onLinkClick?: () => void }) {
  const firstType = children[0]?.type;
  switch (firstType) {
    case "description":
      return <DescriptionPanel items={children} onLinkClick={onLinkClick} />;
    case "icon":
      return <IconPanel items={children} onLinkClick={onLinkClick} />;
    case "simple":
    default:
      return <SimplePanel items={children} onLinkClick={onLinkClick} />;
  }
}

// ─── Desktop navigation component ──────────────────────────────────────────
function DesktopNav({
  activeDropdown,
  onMouseEnter,
  onMouseLeave,
  onToggle,
  onLinkClick,
}: {
  activeDropdown: string;
  onMouseEnter: (label: string) => void;
  onMouseLeave: () => void;
  onToggle: (label: string) => void;
  onLinkClick: () => void;
}) {
  return (
    <div className="hidden md:flex relative flex-1 items-center justify-center gap-0.5">
      {navigationLinks.map((link) => {
        const hasChildren = Boolean(link.children && link.children.length > 0);
        const isOpen = activeDropdown === link.label;

        if (!hasChildren) {
          return (
            <Link
              key={link.label}
              href={link.href ?? "/"}
              onClick={onLinkClick}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-[14px] font-semibold text-ink dark:text-white/90 no-underline outline-none nav-interactive nav-link-indicator ring-1 ring-transparent hover:ring-black/10 dark:hover:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:ring-brand-500 focus-visible:ring-2"
            >
              {link.label}
            </Link>
          );
        }

        return (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() => onMouseEnter(link.label)}
            onMouseLeave={onMouseLeave}
          >
            <button
              type="button"
              onClick={() => onToggle(link.label)}
              aria-expanded={isOpen}
              className="group flex items-center gap-1 px-3 py-2 rounded-lg text-[14px] font-semibold text-ink dark:text-white/90 outline-none nav-interactive nav-link-indicator ring-1 ring-transparent hover:ring-black/10 dark:hover:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:ring-brand-500 focus-visible:ring-2 cursor-pointer"
            >
              {link.label}
              <ChevronDown
                size={14}
                className={cn(
                  "nav-chevron flex-none text-mut relative top-px transition-transform duration-150",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {/* Strictly static in place dropdown with invisible hover bridge & 0 horizontal shift */}
            {isOpen && (
              <div
                className={cn(
                  "absolute top-full z-50 pt-2",
                  link.label === "Support" ? "right-0" : "left-0"
                )}
                onMouseEnter={() => onMouseEnter(link.label)}
                onMouseLeave={onMouseLeave}
              >
                <div
                  className={cn(
                    "relative overflow-hidden",
                    // Invisible hover bridge pseudo-element ensuring continuous cursor contact across any subpixel gap
                    "before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:content-['']",
                    "rounded-xl border border-white/40 dark:border-white/10",
                    "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl backdrop-saturate-150",
                    "shadow-xl shadow-black/10",
                    "transition-opacity duration-150"
                  )}
                >
                  <DropdownPanel children={link.children!} onLinkClick={onLinkClick} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Hamburger icon (razor-sharp 24x24 pixel-aligned SVG with instant toggle) ───
function HamburgerIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-ink dark:text-white flex-none"
        style={{
          WebkitFontSmoothing: "antialiased",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
        aria-hidden="true"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-ink dark:text-white flex-none"
      style={{
        WebkitFontSmoothing: "antialiased",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

// ─── Main Floating Navbar ──────────────────────────────────────────────────
export default function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string>("");
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const scrolledRef = useRef(false);

  const { itemCount } = useCart();

  // Mouse-leave debounce handlers
  const handleMouseEnter = useCallback((label: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown("");
    }, 200);
  }, []);

  const handleToggle = useCallback((label: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveDropdown((prev) => (prev === label ? "" : label));
  }, []);

  const handleCloseDropdown = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveDropdown("");
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleCloseDropdown]);

  // Passive scroll listener with rAF — never blocks main thread
  useEffect(() => {
    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const shouldBeScrolled = window.scrollY > 24;
        if (shouldBeScrolled !== scrolledRef.current) {
          scrolledRef.current = shouldBeScrolled;
          setScrolled(shouldBeScrolled);
        }
        rafRef.current = 0;
      });
    }

    // Check initial scroll position
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Close mobile menu and dropdown on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      } else {
        handleCloseDropdown();
      }
    }
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [handleCloseDropdown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);
  const handleMobileToggle = useCallback(
    () => setMobileOpen((v) => !v),
    []
  );

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          // Floating pill positioning
          "fixed top-4 left-1/2 -translate-x-1/2 z-50",
          "max-w-6xl w-[calc(100%-2rem)]",
          "rounded-2xl",
          // Glass base
          "border backdrop-blur-xl backdrop-saturate-150",
          // Inner highlight + outer shadow
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shadow-lg",
          // CSS class for smooth transitions
          "glass-transition",
          // Scroll-dependent glass opacity
          scrolled
            ? "bg-white/90 dark:bg-slate-950/80 border-white/30 dark:border-white/15 shadow-black/10"
            : "bg-white/70 dark:bg-slate-950/60 border-white/40 dark:border-white/10 shadow-black/5"
        )}
      >
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 h-[56px] px-4 md:px-5"
        >
          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link
            href="/"
            onClick={handleCloseDropdown}
            className="flex items-center gap-2 font-extrabold text-[20px] tracking-tight no-underline text-ink dark:text-white mr-1 shrink-0"
          >
            <Image
              src="/assets/logo.png"
              alt="VigilXpress logo"
              width={32}
              height={32}
              priority
            />
            <span className="hidden sm:inline">
              Vigil<b className="text-brand-500">Xpress</b>
            </span>
          </Link>

          {/* ── Desktop navigation (Static in-place dropdowns with 200ms debounce) ── */}
          <DesktopNav
            activeDropdown={activeDropdown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onToggle={handleToggle}
            onLinkClick={handleCloseDropdown}
          />

          {/* ── Right side: Cart Icon & Auth Slot ─────────────────── */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Quick Shopping Cart Button */}
            <Link
              href="/cart"
              onClick={handleCloseDropdown}
              aria-label={`Shopping cart with ${itemCount} items`}
              className="relative flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl ring-1 ring-black/10 dark:ring-white/10 hover:ring-black/20 dark:hover:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 text-ink dark:text-white"
              style={{
                WebkitFontSmoothing: "antialiased",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full bg-brand-500 text-ink shadow-sm transition-transform scale-100">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <NavbarAuthSlot />
          </div>

          {/* ── Mobile: hamburger ─────────────────────────────────── */}
          <button
            type="button"
            id="nav-hamburger"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={handleMobileToggle}
            className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl ring-1 ring-black/10 dark:ring-white/10 hover:ring-black/20 dark:hover:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors nav-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 text-ink dark:text-white"
            style={{
              WebkitFontSmoothing: "antialiased",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </header>

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      <MobileMenu open={mobileOpen} onClose={handleMobileClose} />
    </>
  );
}
