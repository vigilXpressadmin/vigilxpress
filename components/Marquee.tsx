'use client';

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
  // Duplicating ITEMS within each track ensures adequate span width across ultra-wide viewports
  const trackItems = [...ITEMS, ...ITEMS];

  return (
    <div
      className="mq overflow-hidden whitespace-nowrap w-full select-none"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max">
        {/* Primary Track */}
        <div className="flex shrink-0 items-center">
          {trackItems.map((item, idx) => (
            <span key={`primary-${idx}`}>{item}</span>
          ))}
        </div>
        {/* Duplicate Track: exact duplicate ensures seamless 0% -> -50% loop with zero snap */}
        <div className="flex shrink-0 items-center">
          {trackItems.map((item, idx) => (
            <span key={`duplicate-${idx}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
