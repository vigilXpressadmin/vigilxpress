import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MapPin, ShieldCheck, KeyRound, ShoppingBag } from "lucide-react";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import OrderStatusCard from "@/components/OrderStatusCard";
import Faq from "@/components/Faq";

const Journey = dynamic(() => import("@/components/Journey"), {
  loading: () => null,
  ssr: true,
});

const AREAS_TO_CONFIRM = [
  "Sagamu",
  "Ilishan",
  "Iperu",
  "Ikenne",
  "Aiyepe",
  "Odogbolu",
];

const PLANNED_AREAS = [
  "Abeokuta Metro & Corridors",
  "Additional Ogun State Hubs",
];

const HOME_FAQ = [
  {
    q: "Where does VigiXpress deliver?",
    a: "Delivery availability must be confirmed for your community before you order. Contact our team to check current coverage. Abeokuta is a planned expansion, not an active delivery location.",
  },
  {
    q: "Can I order from more than one restaurant at once?",
    a: "Yes — where available, you can add dishes from different kitchens to one cart and pay once. One order, one tracker.",
  },
  {
    q: "What is the delivery PIN?",
    a: "A short code shown only to you. Share it with your rider once the food or package is in your hands. Entering it completes the order and proves handover.",
  },
  {
    q: "Do riders carry cash?",
    a: "No. Payment is completed online via Paystack before dispatch, so riders never handle cash. That keeps every naira traceable and everyone safer.",
  },
  {
    q: "Are there hidden fees?",
    a: "Never. Delivery and service fees are shown on the checkout screen before you pay. The total you see is the total you pay.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container-x grid gap-8 sm:gap-10 md:gap-12 items-center relative md:grid-cols-[1.1fr_.9fr] w-full">
          <div className="flex flex-col items-start w-full">
            <Link
              href="/contact"
              className="eyebrow-chip mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Check delivery availability in Ogun State by contacting our team"
            >
              <MapPin size={13} className="text-brand-500 shrink-0" aria-hidden="true" />
              <span>Check delivery availability in Ogun State</span>
            </Link>

            <h1 className="text-[clamp(38px,7.5vw,76px)] leading-[1.08] tracking-tight [text-wrap:balance]">
              <span className="hline"><i>Your Everyday</i></span>
              {" "}
              <span className="hline"><i>Essentials,</i></span>
              {" "}
              <span className="hline"><i>Delivered.</i></span>
            </h1>

            <p className="fade-in max-w-[48ch] text-neutral-200 text-[15px] sm:text-base md:text-[18px] leading-relaxed my-5 sm:my-6" style={{ animationDelay: ".2s" }}>
              Order food, groceries and everyday essentials from local kitchens and stores. Contact us to confirm delivery availability in your community. Pay securely, track your order, and confirm handover with your delivery PIN.
            </p>

            <div className="fade-in flex flex-col min-[350px]:flex-row gap-3 w-full sm:w-auto my-2" style={{ animationDelay: ".3s" }}>
              <Link
                href="/stores"
                className="h-12 px-6 rounded-xl font-bold text-[15px] sm:text-base inline-flex items-center justify-center bg-brand-500 text-ink hover:bg-brand-400 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink shadow-[0_10px_24px_-8px_rgba(255,107,26,0.6)]"
              >
                Browse stores
              </Link>
              <Link
                href="/how-it-works"
                className="h-12 px-6 rounded-xl font-bold text-[15px] sm:text-base inline-flex items-center justify-center border border-white/30 text-white hover:border-white hover:bg-white/5 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                How it works
              </Link>
            </div>

            <ul className="fade-in flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-neutral-300 list-none p-0 mt-5" style={{ animationDelay: ".45s" }}>
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-brand-500 shrink-0" aria-hidden="true" />
                <span>Verified riders</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <KeyRound size={15} className="text-brand-500 shrink-0" aria-hidden="true" />
                <span>Secure PIN handover</span>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShoppingBag size={15} className="text-brand-500 shrink-0" aria-hidden="true" />
                <span>Food, groceries &amp; essentials</span>
              </li>
            </ul>
          </div>

          <div className="relative flex items-center justify-center w-full min-h-[360px] sm:min-h-[420px] py-4">
            {/* Contained warm radial glow centered behind centerpiece card */}
            <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
            <OrderStatusCard />
          </div>
        </div>
      </section>

      <Marquee />

      {/* JOURNEY */}
      <Journey />

      {/* ONE CART */}
      <section className="py-24">
        <div className="container-x grid gap-12 items-center md:grid-cols-2">
          <Reveal>
            <h2>One cart. Many kitchens.</h2>
            <p className="text-mut max-w-[56ch] mb-6">
              Craving amala from one kitchen and suya from another? Add both to a single
              order, pay once, and track everything in one place.
            </p>
            <div className="bg-white border border-line rounded-2xl p-4 mb-3 font-bold">
              Mama Risikat&apos;s Kitchen<small className="block font-normal text-mut">Amala + Ewedu ×2</small>
            </div>
            <div className="bg-white border border-line rounded-2xl p-4 mb-3 font-bold">
              Suya Spot Sagamu<small className="block font-normal text-mut">Beef suya ×1 · Extra yaji</small>
            </div>
          </Reveal>
          <Reveal className="cartbox">
            <ul>
              <li><span>Subtotal</span><span>₦8,400</span></li>
              <li><span>Delivery fee</span><span>₦800</span></li>
              <li><span>Service fee</span><span>₦350</span></li>
              <li className="t"><span>Total</span><span>₦9,550</span></li>
            </ul>
            <p className="text-sm text-[#b5b5b5] mt-3">Fees always shown before you pay. No surprises after.</p>
          </Reveal>
        </div>
      </section>

      {/* TRUST */}
      <section className="dark bg-ink text-white py-24">
        <div className="container-x">
          <Reveal>
            <h2>Built for clear handovers.</h2>
            <p className="text-[#b5b5b5] max-w-[56ch] mb-9">Four promises we built into the platform itself — not just the marketing.</p>
          </Reveal>
          <div className="cards">
            <Reveal className="c">
              <h3>Secure online payment</h3>
              <p>Pay with card, bank transfer or USSD through Paystack. Your order is confirmed only after our servers verify the payment.</p>
            </Reveal>
            <Reveal className="c">
              <h3>Delivery PIN</h3>
              <p>A handover PIN completes every order. It proves your food reached you — and no one else&apos;s hands.</p>
              <div className="pin"><b>4</b><b>8</b><b>2</b><b>3</b></div>
            </Reveal>
            <Reveal className="c">
              <h3>Verified riders</h3>
              <p>Every rider is identity-verified and approved before their first delivery. No cash carried, ever.</p>
            </Reveal>
            <Reveal className="c">
              <h3>Live order tracking</h3>
              <p>Payment verified, kitchen accepted, preparing, picked up, arriving. Every status timestamped on our servers.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DELIVERY COVERAGE */}
      <section className="py-24 bg-soft border-y border-line">
        <div className="container-x">
          <Reveal>
            <span className="eb">Delivery coverage</span>
            <h2>Check delivery availability in your community.</h2>
            <p className="text-mut max-w-[62ch] mb-12">
              Delivery coverage depends on the kitchens, stores, and riders currently operating in each area.
              Contact us to confirm availability before placing an order.
            </p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal className="card border-2 border-brand-500/30 bg-white">
              <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 border border-line">
                  Confirm Availability
                </span>
                <span className="text-xs font-medium text-mut">Ogun State Network</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Ogun State Areas to Confirm</h3>
              <p className="text-mut text-sm mb-5">
                Ask our team to confirm current coverage in these communities:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AREAS_TO_CONFIRM.map((town) => (
                  <div
                    key={town}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-soft border border-line text-xs font-bold text-ink"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-none" />
                    <span>{town}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-mut mt-5 pt-4 border-t border-line">
                Availability may vary by address, merchant, and rider coverage.
              </p>
            </Reveal>

            <Reveal className="card bg-white">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 border border-line">
                  ⏳ Planned Expansion
                </span>
                <span className="text-xs font-medium text-mut">Next Phase</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upcoming Launch Zones</h3>
              <p className="text-mut text-sm mb-5">
                Merchant onboarding, partner kitchen verification, and rider route mapping are scheduled for:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PLANNED_AREAS.map((zone) => (
                  <div
                    key={zone}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-soft/50 border border-line/60 text-xs font-medium text-neutral-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 flex-none" />
                    <span>{zone}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-mut mt-5 pt-4 border-t border-line">
                Want your favorite local store or kitchen added? <Link href="/contact" className="text-brand-600 font-bold hover:underline">Let us know</Link> or join as a partner.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-24">
        <div className="container-x">
          <Reveal>
            <h2>For local food businesses and riders.</h2>
            <p className="text-mut max-w-[56ch] mb-9">Grow with us. Launch partners get 0% commission for their first month.</p>
          </Reveal>
          <div className="cards">
            <Reveal className="c">
              <h3>Restaurants &amp; Stores</h3>
              <p>Apply, get verified, add your catalogue and start receiving orders. Most stores go live within a day of approval.</p>
              <Link href="/contact" className="btn-primary !border-ink mt-4" style={{ border: "2px solid #171717" }}>Partner with us</Link>
            </Reveal>
            <Reveal className="c">
              <h3>Riders</h3>
              <p>Own a bike with valid papers? Get approved within 48 hours and go online whenever you want. Weekly settlements.</p>
              <Link href="/contact" className="btn-primary !border-ink mt-4" style={{ border: "2px solid #171717" }}>Apply to ride</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 text-ink py-16">
        <div className="container-x flex gap-6 items-center justify-between flex-wrap">
          <div>
            <h2 className="m-0">Hungry right now?</h2>
            <p className="text-[#2b2b2b] mt-1.5 mb-0">Your next meal or essential item is a few taps away.</p>
          </div>
          <Link href="/stores" className="btn-primary !bg-ink !text-white hover:!bg-black" style={{ background: "#171717", color: "#fff" }}>Browse stores →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container-x max-w-[820px]">
          <h2>Quick answers</h2>
          <p className="text-mut mb-8">Anything else? <Link href="/contact" className="text-brand-600 font-bold">Message us</Link> — we reply within one business day.</p>
          <Faq items={HOME_FAQ} />
        </div>
      </section>
    </>
  );
}