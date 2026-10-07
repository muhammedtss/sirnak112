import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";

/** Kurumsal bilgi sayfaları (Hakkında, Gizlilik, Erişilebilirlik, Değişiklikler) için ortak iskelet. */
export function InfoPage({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <PageShell>
      <AppHeader title={title} back="/" icon={icon} />
      <main className="flex-1 px-4 pt-4 pb-10 w-full max-w-2xl mx-auto space-y-4">{children}</main>
    </PageShell>
  );
}

export function InfoSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="glass-card p-5 space-y-3 scroll-mt-20">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="text-sm leading-relaxed text-muted space-y-2.5 [&_strong]:text-fg [&_strong]:font-semibold">{children}</div>
    </section>
  );
}

export function InfoList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" aria-hidden="true" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
