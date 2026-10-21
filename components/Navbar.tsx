'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Info,
  HelpCircle,
  Store,
  ChevronDown,
  LogIn,
  UserPlus,
  PackageSearch,
  Handshake,
  MenuIcon,
  X,
  MessageSquare,
  Zap,
} from 'lucide-react';

// ─── Nav data ──────────────────────────────────────────────────────────────
const EXPLORE = [
  { label: 'Home',         href: '/',             icon: Home },
  { label: 'How it works', href: '/how-it-works', icon: Zap },
  { label: 'Stores',       href: '/stores',        icon: Store },
  { label: 'About',        href: '/about',         icon: Info },
  { label: 'FAQs',         href: '/faq',           icon: HelpCircle },
  { label: 'Contact',      href: '/contact',       icon: MessageSquare },
];

const ACCOUNT = [
  { label: 'Log in',    href: '/login',    icon: LogIn },
  { label: 'Register',  href: '/register', icon: UserPlus },
  { label: 'My Orders', href: '/orders',   icon: PackageSearch },
];

const PARTNERS = [
  { label: 'Become a partner', href: '/contact', icon: Handshake },
];

interface NavGroup {
  heading: string;
  items: typeof EXPLORE;
}

const GROUPS: NavGroup[] = [
  { heading: 'Explore',  items: EXPLORE },
  { heading: 'Account',  items: ACCOUNT },
  { heading: 'Partners', items: PARTNERS },
];

// ─── Desktop dropdown ──────────────────────────────────────────────────────
function Dropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full pt-2 w-[520px] z-[9999]"
    >
      <div className="relative rounded-2xl border border-white/10 bg-ink/90 backdrop-blur-2xl shadow-2xl p-4 grid grid-cols-3 gap-3 before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:content-['']">
      {GROUPS.map(({ heading, items }) => (
        <div key={heading}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1.5 px-1">
            {heading}
          </p>
          {items.map(({ label, href, icon: Icon }) => (
            <Link
              key={href + label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[14px] text-white/80 font-medium hover:bg-white/10 hover:text-white transition-colors no-underline"
            >
              <Icon size={15} className="flex-none text-brand-500" />
              {label}
            </Link>
          ))}
        </div>
      ))}
      </div>
    </div>
  );
}

// ─── Mobile full-screen panel ─────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-0 top-[68px] z-[9998] bg-neutral-900/95 backdrop-blur-2xl border-t border-neutral-800 pb-8 overflow-y-auto antialiased"
      style={{
        maxHeight: 'calc(100dvh - 68px)',
        WebkitFontSmoothing: 'antialiased',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      <div className="container-x pt-6 grid gap-6">
        {GROUPS.map(({ heading, items }) => (
          <div key={heading}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
              {heading}
            </p>
            <div className="grid gap-1">
              {items.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href + label}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-[16px] text-white/85 font-medium hover:bg-white/10 hover:text-white transition-colors no-underline"
                >
                  <span className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 grid place-items-center flex-none">
                    <Icon size={16} className="text-brand-500" />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-ink/70 backdrop-blur-xl border-b border-white/10'
            : ''
        }`}
      >
        <div className="container-x">
          <nav aria-label="Main" className="flex items-center gap-4 h-[68px] text-white">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-extrabold text-[22px] tracking-tight no-underline"
            >
              <Image src="/assets/logo.png" alt="VigilXpress logo" width={38} height={38} priority />
              <span>
                Vigil<b className="text-brand-500">Xpress</b>
              </span>
            </Link>

            {/* Desktop: Order now + Menu dropdown */}
            <div className="hidden md:flex items-center gap-3 ml-auto">
              <Link href="/stores" className="btn-primary !py-2.5 !px-5 text-[15px]">
                Order now
              </Link>

              {/* Menu dropdown trigger */}
              <div className="relative">
                <button
                  id="nav-menu-trigger"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[15px] font-semibold border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors"
                >
                  Menu
                  <ChevronDown
                    size={16}
                    className={dropdownOpen ? 'rotate-180' : ''}
                  />
                </button>

                {dropdownOpen && (
                  <Dropdown onClose={() => setDropdownOpen(false)} />
                )}
              </div>
            </div>

            {/* Mobile: Order now + Hamburger */}
            <div className="flex items-center gap-2 ml-auto md:hidden">
              <Link href="/stores" className="btn-primary !py-2 !px-4 text-[14px]">
                Order now
              </Link>
              <button
                id="nav-hamburger"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              >
                {mobileOpen ? (
                  <X size={24} className="w-6 h-6 text-white flex-none" />
                ) : (
                  <MenuIcon size={24} className="w-6 h-6 text-white flex-none" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}