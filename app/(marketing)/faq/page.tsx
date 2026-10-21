import Faq from "@/components/Faq";

export const metadata = { title: "FAQs" };

const FAQS = [
  { q: "Where does VigiXpress deliver?", a: "Delivery availability depends on your community. Contact us to confirm current coverage before placing an order. Abeokuta is a planned expansion, not an active delivery location." },
  { q: "Can I order from more than one restaurant at once?", a: "Yes — where available, add dishes from different kitchens to one cart and pay once. One order, one tracker." },
  { q: "What is the delivery PIN?", a: "A short code shown only to you. Share it once the food is in your hands. Entering it completes the order and proves handover — no PIN, no completed order." },
  { q: "How do I track my order?", a: "Every order has a live tracker: payment verified, kitchen accepted, preparing, rider assigned, picked up, delivered. Each status is timestamped on our servers." },
  { q: "Do riders take cash?", a: "No. Pay online via Paystack before dispatch, or digitally at the door before handover. Riders never carry cash." },
  { q: "Are there hidden fees?", a: "No. Delivery and service fees are shown before you pay — the total on the checkout screen is the total you pay." },
  { q: "What if my payment fails or my order is rejected?", a: "You are told why straight away. Any refund shows its status on your order — requested, processed, or completed." },
  { q: "How do restaurants & stores join?", a: "Message us on WhatsApp or via the contact page. Get verified, add your menu, set your bank details and go live — most kitchens within a day of menu approval." },
  { q: "How do riders join?", a: "You need a motorcycle (owned or leased, with papers or an authorization letter), a smartphone, a valid ID and a helmet. Approval usually within 48 hours." },
];

export default function FaqPage() {
  return (
    <>
      <div className="ph"><div className="container-x relative z-[1]">
        <p className="eb">FAQs</p>
        <h1>Quick answers.</h1>
        <p>Anything else? Message us — we reply within one business day.</p>
      </div></div>
      <div className="container-x py-16 max-w-[820px]"><Faq items={FAQS} /></div>
    </>
  );
}