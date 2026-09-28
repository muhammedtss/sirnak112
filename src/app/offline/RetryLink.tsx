"use client";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";

/** SW, kayıtlı olmayan sayfayı /offline?from=<yol> adresine yönlendirir; bu bağlantı o sayfayı tekrar dener. */
export function RetryLink() {
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("from");
    // Yalnızca site içi yollar (açık yönlendirmeye karşı)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL yalnızca istemcide okunabilir (statik sayfa)
    if (target && target.startsWith("/") && !target.startsWith("//")) setFrom(target);
  }, []);

  if (!from) return null;

  return (
    // Düz <a>: tam sayfa yüklemesi service worker'dan geçmeli
    <a
      href={from}
      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border"
      style={{ borderColor: "var(--glass-border-h)", color: "var(--fg)" }}
    >
      <RotateCw style={{ width: 15, height: 15 }} /> Tekrar Dene
    </a>
  );
}
