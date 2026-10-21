'use client';
import { useState } from "react";

export type QA = { q: string; a: string };

export default function Faq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number>(0);
  return (
    <div>
      {items.map((item, i) => (
        <details key={i} open={open === i} onToggle={() => setOpen(i)}
          className="border-b border-line py-4 group">
          <summary className="font-bold text-lg cursor-pointer">{item.q}</summary>
          <p className="text-mut mt-2 max-w-prose">{item.a}</p>
        </details>
      ))}
    </div>
  );
}