import {
  Home,
  Store,
  Info,
  Zap,
  HelpCircle,
  MessageSquare,
  PackageSearch,
  Shield,
  Truck,
  Utensils,
  Handshake,
  Building2,
  type LucideIcon,
} from "lucide-react";

// ─── Submenu item types ────────────────────────────────────────────────────
export interface DescriptionItem {
  type: "description";
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface SimpleItem {
  type: "simple";
  title: string;
  href: string;
}

export interface IconItem {
  type: "icon";
  title: string;
  href: string;
  icon: LucideIcon;
}

export type SubmenuItem = DescriptionItem | SimpleItem | IconItem;

// ─── Navigation link shape ─────────────────────────────────────────────────
export interface NavigationLink {
  /** Label shown in the nav trigger / link */
  label: string;
  /** Direct href (for links with no dropdown) */
  href?: string;
  /** Submenu items — presence triggers a dropdown */
  children?: SubmenuItem[];
}

// ─── Shared navigation data (module-level const, never re-allocated) ───────
export const navigationLinks: readonly NavigationLink[] = [
  {
    label: "Explore",
    children: [
      {
        type: "description",
        title: "Home",
        description: "Welcome page & current promotions",
        href: "/",
        icon: Home,
      },
      {
        type: "description",
        title: "How It Works",
        description: "3-step ordering flow explained",
        href: "/how-it-works",
        icon: Zap,
      },
      {
        type: "description",
        title: "Browse Stores",
        description: "Find kitchens & grocery stores near you",
        href: "/stores",
        icon: Store,
      },
      {
        type: "description",
        title: "About Us",
        description: "Our mission, team & story",
        href: "/about",
        icon: Info,
      },
    ],
  },
  {
    label: "Services",
    children: [
      {
        type: "icon",
        title: "Food Delivery",
        href: "/stores",
        icon: Utensils,
      },
      {
        type: "icon",
        title: "Grocery Delivery",
        href: "/stores",
        icon: PackageSearch,
      },
      {
        type: "icon",
        title: "Rider Network",
        href: "/about",
        icon: Truck,
      },
      {
        type: "icon",
        title: "Secure Payments",
        href: "/about",
        icon: Shield,
      },
    ],
  },
  {
    label: "Partners",
    children: [
      {
        type: "simple",
        title: "Become a Merchant",
        href: "/contact",
      },
      {
        type: "simple",
        title: "Become a Rider",
        href: "/contact",
      },
      {
        type: "simple",
        title: "Business Partnerships",
        href: "/contact",
      },
    ],
  },
  {
    label: "Support",
    children: [
      {
        type: "icon",
        title: "FAQs",
        href: "/faq",
        icon: HelpCircle,
      },
      {
        type: "icon",
        title: "Contact Us",
        href: "/contact",
        icon: MessageSquare,
      },
      {
        type: "icon",
        title: "Partner Help",
        href: "/contact",
        icon: Handshake,
      },
      {
        type: "icon",
        title: "For Businesses",
        href: "/contact",
        icon: Building2,
      },
    ],
  },
] as const;
