const ITEMS = [
  "FOOD & GROCERIES",
  "EVERYDAY ESSENTIALS",
  "ACTIVE IN OGUN STATE",
  "PAY ONLINE WITH PAYSTACK",
  "ONE CART",
  "DELIVERY PIN",
  "VERIFIED RIDERS",
  "NO CASH TO RIDERS",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="mq" aria-hidden="true">
      <div>{row.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}