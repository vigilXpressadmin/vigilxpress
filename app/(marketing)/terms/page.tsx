import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 2026"
      intro="The rules for using the VigilXpress marketplace — customers, kitchens and riders.">
      <h2>1. Who we are</h2>
      <p>VigilXpress operates an online food ordering and delivery marketplace in Abeokuta, Ogun State, Nigeria. We connect customers with independent restaurants and verified delivery riders. VigilXpress is a marketplace: restaurants prepare the food, riders deliver it, and we provide the platform, payments infrastructure and order tracking.</p>

      <h2>2. Accounts</h2>
      <p>You must provide accurate information when creating an account and keep it up to date. You are responsible for everything that happens under your account. One person per account — do not share login details. We may suspend accounts involved in fraud, abuse or repeated violations of these terms.</p>

      <h2>3. Orders and pricing</h2>
      <ul>
        <li>Menus, prices and availability are set by each restaurant and may change without notice.</li>
        <li>Your order is confirmed only after payment is verified by our servers.</li>
        <li>Delivery and service fees are displayed on the checkout screen before you pay. The total shown at checkout is the total you pay.</li>
        <li>A restaurant may decline an order (for example, an item sold out). You will be notified immediately and any charge reversed per our Refunds policy.</li>
      </ul>

      <h2>4. Payments (Paystack)</h2>
      <ul>
        <li>All card and bank payments are processed by Paystack (a licensed payment processor). We never see or store your full card details.</li>
        <li>Completing a Paystack transaction authorizes the charge for your order total.</li>
        <li>If a payment is debited but not confirmed, it is automatically reversed by Paystack or refunded by us — see our Refunds policy.</li>
        <li>Paystack&apos;s own terms and privacy policy also apply to the payment step.</li>
      </ul>

      <h2>5. Delivery and handover</h2>
      <ul>
        <li>Delivery times shown are estimates, not guarantees — traffic, weather and kitchen volume all play a part.</li>
        <li>Every order is completed with a delivery PIN. Share your PIN only when the food is physically in your hands.</li>
        <li>Once your PIN is entered, the order is complete and handover is confirmed. Report any problem before or at handover where possible.</li>
        <li>Riders do not carry cash and cannot accept payment at the door except through approved digital methods.</li>
      </ul>

      <h2>6. Cancellations and refunds</h2>
      <p>Please see our <a href="/refunds" className="text-brand-600 underline">Refunds policy</a> for what can be refunded, timelines and how to request one.</p>

      <h2>7. Restaurants and riders</h2>
      <p>Restaurants and riders are independent partners, not employees of VigilXpress. We verify identity and documents before onboarding and monitor quality through ratings, but each restaurant remains responsible for the food it prepares and each rider for safe, timely delivery. Partner terms are agreed separately during onboarding.</p>

      <h2>8. Acceptable use</h2>
      <p>You agree not to misuse the platform: no fraudulent orders or payments, no harassment of riders or restaurant staff, no fake reviews, no attempts to bypass the platform to avoid fees, and no use of another person&apos;s account or payment method.</p>

      <h2>9. Intellectual property</h2>
      <p>The VigilXpress name, logo, design and software belong to us. Restaurant names, menus and images belong to the respective restaurants and are used with permission.</p>

      <h2>10. Liability</h2>
      <p>We work hard to keep every order on track, but the platform is provided &quot;as is&quot;. To the extent permitted by Nigerian law, VigilXpress is not liable for indirect losses. Nothing in these terms limits liability that cannot be limited by law, and nothing affects your statutory consumer rights.</p>

      <h2>11. Changes to these terms</h2>
      <p>We may update these terms as the service grows. The version on this page always applies. Continued use after an update means you accept it.</p>

      <h2>12. Governing law and contact</h2>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria. Questions? Email <a href={`mailto:${SITE.email}`} className="text-brand-600 underline">{SITE.email}</a> or message us on WhatsApp.</p>
    </LegalPage>
  );
}