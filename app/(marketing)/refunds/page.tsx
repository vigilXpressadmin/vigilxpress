import LegalPage from "@/components/LegalPage";
import { SITE, waLink } from "@/lib/site";

export const metadata = { title: "Refunds Policy" };

export default function RefundsPage() {
  return (
    <LegalPage title="Refunds Policy" updated="October 2026"
      intro="When you can get your money back, how much, and how fast.">
      <h2>1. Failed or unconfirmed payments</h2>
      <p>If money leaves your account but your order is not confirmed, the charge is automatically reversed by Paystack, or refunded by us if it already settled. This is always a full refund of the amount paid.</p>

      <h2>2. Restaurant cancels or rejects your order</h2>
      <p>If a restaurant cannot fulfil a confirmed order (item sold out, closed unexpectedly), you are notified immediately and receive a <b>full refund</b> — including delivery and service fees.</p>

      <h2>3. Wrong, missing or spoiled items</h2>
      <p>Report the problem as soon as you receive your order — ideally before entering your delivery PIN, and always within <b>2 hours of delivery</b>. After review we will refund the affected items, offer a replacement at the restaurant&apos;s discretion, or issue account credit.</p>

      <h2>4. Orders that never arrive</h2>
      <p>If tracking stalls and the order is confirmed undelivered, you receive a full refund automatically once our team verifies it.</p>

      <h2>5. What is not refundable</h2>
      <ul>
        <li>Orders completed with your delivery PIN, except for quality problems reported within 2 hours.</li>
        <li>Delivery fees on orders that were delivered but later than the estimate — lateness alone does not qualify, but tell us: patterns are tracked and repeated lateness is addressed with the restaurant or rider.</li>
        <li>Taste preferences (&quot;I did not like it&quot;) once the order is complete — though we always pass feedback to the kitchen.</li>
      </ul>

      <h2>6. Timelines</h2>
      <p>Approved refunds are sent back through Paystack to your original payment method within <b>3–5 business days</b> (occasionally longer, depending on your bank). Refund status is visible on your order page: requested → processed → completed.</p>

      <h2>7. How to request a refund</h2>
      <p>Message us on <a href={waLink("Hi VigilXpress, I need help with a refund. Order #:")} target="_blank" rel="noopener" className="text-brand-600 underline">WhatsApp</a> or email <a href={`mailto:${SITE.email}`} className="text-brand-600 underline">{SITE.email}</a> with your order number, a short description and a photo where relevant. We respond within one business day.</p>
    </LegalPage>
  );
}