import Link from "next/link";
import Reveal from "@/components/Reveal";

const VALUES = [
  ["Fast, but never at the cost of trust.", "Speed matters. So does knowing exactly where your food is and who has it."],
  ["No cash handling by riders.", "Digital payment via Paystack before dispatch keeps riders safe and every naira traceable."],
  ["Clear fees before you pay.", "The price on the checkout screen is the price you pay. Full stop."],
  ["Simple screens for everyone.", "Built for every level of digital comfort — from first-time smartphone users to power users."],
] as const;

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <div className="ph"><div className="container-x relative z-[1]">
        <p className="eb">About us</p>
        <h1>Eyes on every order.</h1>
        <p>Vigil means watchful. That is how we run delivery.</p>
      </div></div>

      <div className="container-x py-14">
        <p className="text-[19px] max-w-[56ch]">We are building a delivery platform for everyday Nigerian life: simple enough for anyone, strict enough to trust. Restaurants, stores, riders and customers share one system that records every step of every order.</p>
      </div>

      <section className="py-16"><div className="container-x">
        <Reveal><h2>What we believe</h2>
        <p className="text-mut max-w-[56ch] mb-9">Four rules we will not break, no matter how fast we grow.</p></Reveal>
        <div className="cards">
          {VALUES.map(([h, p]) => <Reveal key={h} className="c"><h3>{h}</h3><p>{p}</p></Reveal>)}
        </div>
      </div></section>

      <section className="bg-soft py-20"><div className="container-x">
        <Reveal><h2>Where we are</h2>
        <p className="text-mut max-w-[56ch] mb-9">Delivery availability depends on local coverage. Contact us to confirm whether service is currently available in your community.</p></Reveal>
        <ul className="space-y-6">
          <Reveal><li className="flex gap-4"><span className="w-3 h-3 rounded-full bg-brand-500 mt-2 flex-none" />
            <div><b>Ogun State · Confirm availability</b><p className="text-mut">Ask us whether local kitchens, stores, and riders are currently operating in your area before placing an order.</p></div></li></Reveal>
          <Reveal><li className="flex gap-4"><span className="w-3 h-3 rounded-full bg-line mt-2 flex-none" />
            <div><b>Next · Abeokuta &amp; Surrounding Corridors</b><p className="text-mut">Merchant onboarding and rider route planning are underway for future expansion.</p></div></li></Reveal>
          <Reveal><li className="flex gap-4"><span className="w-3 h-3 rounded-full bg-line mt-2 flex-none" />
            <div><b>Soon · More states</b><p className="text-mut">We expand only when the experience holds up — one area at a time.</p></div></li></Reveal>
        </ul>
      </div></section>

      <div className="container-x py-16 max-w-[760px]">
        <Reveal><h2>Why &quot;VigiXpress&quot;?</h2>
        <p className="mt-3">Because delivery fails quietly. Food goes cold, riders wait unpaid, payments vanish — and nobody can say whose fault it was. We built the platform so that <strong>nothing happens quietly</strong>: every status timestamped, every naira itemised, every handover confirmed with a PIN. Watchful by name, watchful by design.</p></Reveal>
      </div>

      <section className="bg-brand-500 text-ink py-16">
        <div className="container-x flex gap-6 items-center justify-between flex-wrap">
          <div><h2 className="m-0">Ready to order?</h2><p className="text-[#2b2b2b] mt-1.5 mb-0">See what local kitchens &amp; stores in Ogun State have ready.</p></div>
          <Link href="/stores" className="btn-primary" style={{ background: "#171717", color: "#fff" }}>Browse stores →</Link>
        </div>
      </section>
    </>
  );
}