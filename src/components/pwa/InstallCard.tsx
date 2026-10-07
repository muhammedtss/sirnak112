"use client";

import { CheckCircle2, Plus, Share, SquarePlus } from "lucide-react";
import { promptInstall, useInstallPlatform } from "@/lib/pwa/install";

/** Çevrimdışı panelindeki "Ana ekrana ekle" bölümü: platforma göre düğme veya yönerge. */
export function InstallCard() {
  const platform = useInstallPlatform();
  if (!platform) return null;

  if (platform === "installed") {
    return (
      <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
        <CheckCircle2 className="w-4 h-4 shrink-0" /> Uygulama ana ekranınızda yüklü
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 p-3 space-y-2">
      <p className="text-sm font-bold">Ana ekrana ekle</p>

      {platform === "prompt" && (
        <>
          <p className="text-xs text-muted leading-relaxed">Uygulama gibi tam ekran açılır ve internetsiz çalışır.</p>
          <button
            type="button"
            onClick={() => promptInstall()}
            className="w-full min-h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white active:scale-[0.97] transition"
          >
            <Plus className="w-4 h-4" /> Ana ekrana ekle
          </button>
        </>
      )}

      {platform === "ios" && (
        <ol className="space-y-1.5 text-xs text-muted leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="font-bold text-fg tabular-nums">1.</span>
            <span>
              Safari&apos;de alttaki <Share className="inline w-3.5 h-3.5 -mt-0.5 text-sky-400" aria-label="Paylaş" />{" "}
              <strong className="text-fg">Paylaş</strong> düğmesine dokunun.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-fg tabular-nums">2.</span>
            <span>
              Listeyi kaydırıp <SquarePlus className="inline w-3.5 h-3.5 -mt-0.5" aria-hidden="true" />{" "}
              <strong className="text-fg">Ana Ekrana Ekle</strong>&apos;yi seçin, sonra <strong className="text-fg">Ekle</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-fg tabular-nums">3.</span>
            <span>Uygulamayı ana ekrandaki simgeden açın; çevrimdışı içerik orada kalıcı olarak saklanır.</span>
          </li>
        </ol>
      )}

      {platform === "manual" && (
        <p className="text-xs text-muted leading-relaxed">
          Tarayıcı menüsünden (⋮) <strong className="text-fg">Ana ekrana ekle</strong> veya{" "}
          <strong className="text-fg">Uygulamayı yükle</strong>&apos;yi seçin.
        </p>
      )}
    </div>
  );
}
