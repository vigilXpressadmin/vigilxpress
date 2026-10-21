import { SITE, waLink } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <div className="ph"><div className="container-x relative z-[1]">
        <p className="eb">Contact</p>
        <h1>Talk to us.</h1>
        <p>Orders, partnerships, rider applications — we typically reply within one business day.</p>
      </div></div>

      <section className="py-20"><div className="container-x grid gap-10 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl mb-6">Get in touch</h2>
          <div className="space-y-3">
            <a href={`mailto:${SITE.email}`} className="card flex items-center gap-4 no-underline hover:-translate-y-0.5 transition">
              <b>Email</b><span className="text-mut">{SITE.email}</span>
            </a>
            <a href={waLink("Hi VigilXpress, I have a question.")} target="_blank" rel="noopener"
              className="card flex items-center gap-4 no-underline hover:-translate-y-0.5 transition">
              <b>WhatsApp</b><span className="text-mut">{SITE.whatsappDisplay} — fastest response</span>
            </a>
            <a href={SITE.instagram} target="_blank" rel="noopener"
              className="card flex items-center gap-4 no-underline hover:-translate-y-0.5 transition">
              <b>Instagram</b><span className="text-mut">@vigilxpress</span>
            </a>
          </div>
          <p className="text-mut mt-6 text-[15px]">
            For help with an existing order, include your order number so we can resolve it faster.
          </p>
        </Reveal>
        <Reveal className="card">
          <h3 className="text-xl mb-2">Partners & riders</h3>
          <p className="text-mut text-[15px] mb-5">Restaurants: message us on WhatsApp with your kitchen name and location.
          Riders: include your name and that you have a motorcycle with valid papers.</p>
          <a href={waLink("Hi VigilXpress, I'd like to partner / apply as a rider.")} target="_blank" rel="noopener" className="btn-primary w-full">Message us on WhatsApp →</a>
          <p className="text-sm text-mut mt-4">Serving {SITE.area}.</p>
        </Reveal>
      </div></section>
    </>
  );
}