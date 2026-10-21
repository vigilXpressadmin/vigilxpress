import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026"
      intro="What data we collect, why, and who we share it with.">
      <h2>1. What we collect</h2>
      <ul>
        <li><b>Account data:</b> name, email address and phone number when you sign up.</li>
        <li><b>Order data:</b> delivery address, order contents, amounts, statuses and your delivery PIN usage.</li>
        <li><b>Payment data:</b> processed entirely by Paystack. We receive only a confirmation and transaction reference — we never see or store your card number, PIN or CVV.</li>
        <li><b>Support conversations:</b> messages you send us by email or WhatsApp.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To process and deliver your orders, and to keep the live order tracker accurate.</li>
        <li>To verify payments and prevent fraud.</li>
        <li>To provide customer support and resolve disputes.</li>
        <li>To improve the platform (we may aggregate and anonymize data for this).</li>
        <li>To send service updates. Marketing messages are optional and you can opt out anytime.</li>
      </ul>

      <h2>3. Who we share it with</h2>
      <ul>
        <li><b>Restaurants</b> receive your name, delivery address and order contents — nothing more.</li>
        <li><b>Riders</b> receive your name, phone number (masked where possible), delivery address and order ID. Riders never receive payment details.</li>
        <li><b>Paystack</b> processes your payment information under its own privacy policy.</li>
        <li><b>Hosting and infrastructure providers</b> that keep VigilXpress running, under data-processing agreements.</li>
        <li>We do not sell personal data. Period.</li>
      </ul>

      <h2>4. Retention and security</h2>
      <p>We keep order records as required for accounting, tax and dispute-resolution purposes, then delete or anonymize them. Data is encrypted in transit and access inside our team is limited to those who need it.</p>

      <h2>5. Your rights</h2>
      <p>You can request a copy of your data, correct it, or ask us to delete your account at any time by emailing <a href={`mailto:${SITE.email}`} className="text-brand-600 underline">{SITE.email}</a>. We respond within a reasonable time, in line with the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act 2023.</p>

      <h2>6. Cookies</h2>
      <p>See our <a href="/cookies" className="text-brand-600 underline">Cookies policy</a>.</p>

      <h2>7. Changes</h2>
      <p>If we make material changes to this policy, we will update this page. Continued use after an update means you accept the revised policy.</p>
    </LegalPage>
  );
}