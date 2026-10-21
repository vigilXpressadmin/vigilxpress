    import type { ReactNode } from "react";

export default function LegalPage({ title, updated, intro, children }: {
  title: string; updated: string; intro: string; children: ReactNode;
}) {
  return (
    <>
      <div className="ph"><div className="container-x relative z-[1]">
        <p className="eb">Legal</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div></div>
      <div className="prose-legal">{children}</div>
      <p className="prose-legal text-sm text-mut !py-0 !pb-16">Last updated: {updated}</p>
    </>
  );
}