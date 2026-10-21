import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Cookies Policy" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies Policy" updated="October 2026"
      intro="The small files that keep VigilXpress running smoothly.">
      <h2>1. What cookies are</h2>
      <p>Cookies are small text files a website stores on your device to remember things between visits. Similar technologies (local storage) are covered by this policy too.</p>
      <h2>2. Cookies we use</h2>
      <ul>
        <li><b>Essential:</b> keep you signed in, remember your cart and secure your session. The site will not work properly without these.</li>
        <li><b>Preferences:</b> remember choices like your saved delivery address.</li>
        <li><b>Analytics:</b> help us understand how the site is used so we can improve it. Aggregated and anonymized.</li>
      </ul>
      <p>Payments on the checkout page are handled by Paystack, which may set its own cookies as part of fraud prevention — see Paystack&apos;s cookie policy.</p>
      <h2>3. Managing cookies</h2>
      <p>You can block or delete cookies in your browser settings. Blocking essential cookies may prevent sign-in, checkout or the order tracker from working.</p>
      <h2>4. Contact</h2>
      <p>Questions? Email <a href={`mailto:${SITE.email}`} className="text-brand-600 underline">{SITE.email}</a>.</p>
    </LegalPage>
  );
}