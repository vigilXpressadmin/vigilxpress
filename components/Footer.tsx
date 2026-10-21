import Link from "next/link";
import Image from "next/image";
import { SITE, waLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-[#b5b5b5] py-14 text-[15px]">
      <div className="container-x grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[22px] text-white no-underline">
            <Image src="/assets/logo.png" alt="" width={38} height={38} />
            <span>Vigil<b className="text-brand-500">Xpress</b></span>
          </Link>
          <p className="mt-2.5">{SITE.tagline}</p>
        </div>
        <div>
          <h3 className="text-white text-base mb-2.5 font-bold">Explore</h3>
          <Link className="block py-[3px] hover:text-white no-underline" href="/how-it-works">How it works</Link>
          <Link className="block py-[3px] hover:text-white no-underline" href="/stores">Stores</Link>
          <Link className="block py-[3px] hover:text-white no-underline" href="/faq">FAQs</Link>
          <Link className="block py-[3px] hover:text-white no-underline" href="/about">About</Link>
          <Link className="block py-[3px] hover:text-white no-underline" href="/contact">Contact</Link>
          <p className="py-[3px]">
            <Link className="hover:text-white no-underline" href="/login">Log in</Link>
            <span aria-hidden="true"> / </span>
            <Link className="hover:text-white no-underline" href="/register">Register</Link>
          </p>
        </div>
        <div>
          <h3 className="text-white text-base mb-2.5 font-bold">Legal</h3>
          {["terms","privacy","refunds","cookies"].map(p => (
            <Link key={p} className="block py-[3px] capitalize hover:text-white no-underline" href={`/${p}`}>{p}</Link>
          ))}
        </div>
        <div>
          <h3 className="text-white text-base mb-2.5 font-bold">Contact</h3>
          <a className="block py-[3px] hover:text-white no-underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a className="block py-[3px] hover:text-white no-underline" href={waLink()} target="_blank" rel="noopener">Chat on WhatsApp</a>
          <a className="block py-[3px] hover:text-white no-underline" href={SITE.instagram} target="_blank" rel="noopener">Instagram</a>
          <a className="block py-[3px] hover:text-white no-underline" href={SITE.facebook} target="_blank" rel="noopener">Facebook</a>
          <a className="block py-[3px] hover:text-white no-underline" href={SITE.x} target="_blank" rel="noopener">X</a>
        </div>
      </div>
      <div className="container-x mt-8 text-[13px]">
        © {new Date().getFullYear()} {SITE.name} · {SITE.url.replace("https://","")}
      </div>
    </footer>
  );
}