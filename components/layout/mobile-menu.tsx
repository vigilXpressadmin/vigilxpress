"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  navigationLinks,
  type NavigationLink,
  type SubmenuItem,
} from "./navigation-links";
import { NavbarAuthSlot } from "./navbar-auth-slot";

// ─── Accordion submenu item ────────────────────────────────────────────────
function MobileAccordionGroup({
  link,
  onLinkClick,
}: {
  link: NavigationLink;
  onLinkClick: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!link.children) {
    return (
      <Link
        href={link.href ?? "/"}
        onClick={onLinkClick}
        className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-[15px] font-semibold text-ink dark:text-white/90 ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/20 dark:hover:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors no-underline nav-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 min-h-[44px] rounded-xl text-[15px] font-semibold text-ink dark:text-white/90 ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/20 dark:hover:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors nav-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <span>{link.label}</span>
        <ChevronDown
          size={16}
          className={cn("nav-chevron flex-none text-mut")}
          data-state={open ? "open" : "closed"}
        />
      </button>

      {/* Accordion body — CSS grid animation for smooth expand */}
      <div
        className="mobile-accordion-content"
        data-state={open ? "open" : "closed"}
      >
        <div className="mobile-accordion-inner">
          <div className="mt-1 ml-2 pl-3 border-l-2 border-brand-200 dark:border-brand-800/40 space-y-0.5">
            {link.children.map((item) => (
              <MobileSubmenuItem
                key={item.title + ("href" in item ? item.href : "")}
                item={item}
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Individual submenu item (renders all three types) ─────────────────────
function MobileSubmenuItem({
  item,
  onLinkClick,
}: {
  item: SubmenuItem;
  onLinkClick: () => void;
}) {
  const Icon = "icon" in item ? item.icon : null;

  return (
    <Link
      href={item.href}
      onClick={onLinkClick}
      className="flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-[14px] font-medium text-ink/80 dark:text-white/70 hover:ring-1 hover:ring-black/10 dark:hover:ring-white/15 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white transition-colors no-underline nav-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {Icon && (
        <span className="flex-none w-7 h-7 rounded-md bg-brand-500/10 border border-brand-500/20 grid place-items-center">
          <Icon size={14} className="text-brand-500" />
        </span>
      )}
      <span className="flex flex-col">
        <span className="leading-tight">{item.title}</span>
        {item.type === "description" && (
          <span className="text-[12px] text-mut dark:text-white/40 leading-snug mt-0.5">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}

// ─── Mobile Menu (animated popover panel) ──────────────────────────────────
export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Panel — razor-sharp container with integer pixels and zero subpixel translation */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Mobile navigation menu"
        className={cn(
          "fixed left-3 right-3 mx-auto z-50 max-w-lg max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain",
          "rounded-xl border border-neutral-200 dark:border-neutral-800",
          "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl",
          "shadow-2xl shadow-black/25",
          "p-3 space-y-1 antialiased"
        )}
        style={{
          top: "4.5rem",
          WebkitFontSmoothing: "antialiased",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {/* Nav links */}
        {navigationLinks.map((link) => (
          <MobileAccordionGroup
            key={link.label}
            link={link}
            onLinkClick={handleLinkClick}
          />
        ))}

        {/* Divider */}
        <div className="h-px bg-black/10 dark:bg-white/10 my-2" />

        {/* Auth slot (renders dynamic role profile or Sign In / Get Started) */}
        <NavbarAuthSlot mode="mobile" onNavigate={handleLinkClick} />
      </div>
    </>
  );
}
