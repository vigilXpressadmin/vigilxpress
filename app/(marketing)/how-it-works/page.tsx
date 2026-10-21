import Link from "next/link";
import Reveal from "@/components/Reveal";

const STEPS = [
  ["Pick your food", "Browse verified kitchens & stores near your saved address. Add items to one cart, even from different stores where available."],
  ["Pay online", "See delivery and service fees before you pay. Your order is confirmed only after our servers verify the Paystack payment."],
  ["Kitchen prepares", "The restaurant gets a loud alert, accepts, and starts cooking. A rider is lined up early so food does not wait."],
  ["Rider delivers", "A verified rider collects your order and heads to you. You see each status change as it happens."],
  ["Give your PIN", "Share your delivery PIN once the food is in your hands. That completes the order — and proves it reached you."],
  ["Rate it", "Leave a quick star rating. Good kitchens and riders rise to the top."],
] as const;

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <>
      <div className="ph"><div className="container-x relative z-[1]">
        <p className="eb">How it works</p>
        <h1>From craving to doorstep, step by step.</h1>
        <p>Every stage is recorded by our servers, so you always know where your order is.</p>
      </div></div>

      <section className="py-20"><div className="container-x">
        <Reveal><h2>Six steps. Zero guesswork.</h2>
        <p className="text-mut max-w-[56ch] mb-9">The same flow every time, whether it is one bowl of amala or a full spread from three kitchens & stores.</p></Reveal>
        <div className="grid gap-4">
          {STEPS.map(([h, p], i) => (
            <Reveal key={h} className="card !pl-[76px] relative">
              <span className="absolute left-[22px] top-[22px] w-10 h-10 rounded-full bg-brand-500 grid place-items-center font-extrabold text-ink">{i + 1}</span>
              <h3 className="text-[22px] mb-2">{h}</h3>
              <p className="text-mut text-[15px] m-0">{p}</p>
            </Reveal>
          ))}
        </div>
      </div></section>

      <section className="bg-soft py-20"><div className="container-x max-w-[640px]">
        <Reveal><h2>Watch an order move.</h2>
        <p className="text-mut mb-8">Every status, timestamped on our servers. This is the tracker you see on a live order.</p></Reveal>
        <Reveal className="card">
          <div className="flex justify-between items-baseline mb-3">
            <b>Order #4823</b><span className="text-mut text-sm">Jollof rice ×2 · Suya ×1</span>
          </div>
          <ul className="tl">
            <li className="done"><i />Payment verified<small className="text-mut ml-2">12:04</small></li>
            <li className="done"><i />Kitchen accepted<small className="text-mut ml-2">12:05</small></li>
            <li className="done"><i />Rider picked up<small className="text-mut ml-2">12:24</small></li>
            <li className="now"><i />Arriving<small className="text-mut ml-2">now</small></li>
            <li><i />Delivered — PIN confirmed</li>
          </ul>
        </Reveal>
      </div></section>

      <section className="bg-brand-500 text-ink py-16">
        <div className="container-x text-center">
          <h2 className="m-0">Ready to order?</h2>
          <Link href="/stores" className="btn-primary mt-4" style={{ background: "#171717", color: "#fff" }}>Browse stores →</Link>
        </div>
      </section>
    </>
  );
}