"use client";

import { useSyncExternalStore } from "react";

/* "Ana ekrana ekle" durumu.
   - Android/Chrome/Edge: tarayıcı `beforeinstallprompt` olayını bir kez yollar; saklanır ve
     kullanıcı düğmeye bastığında `prompt()` çağrılır.
   - iOS: kurulum API'si yoktur; yalnızca Paylaş → Ana Ekrana Ekle ile kurulur (yönerge gösterilir).
   - Uygulama ana ekrandan açıldıysa (standalone) hiçbir şey gösterilmez. */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPlatform = "installed" | "prompt" | "ios" | "manual";

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

/** Kök layout'ta bir kez çağrılır; olay sayfa yüklenirken erken gelebilir. */
export function startInstallListener() {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); // Tarayıcının kendi mini bilgi çubuğu yerine kendi düğmemiz
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    emit();
  });
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  const ua = navigator.userAgent;
  // iPadOS 13+ masaüstü Safari gibi görünür; dokunmatik Mac yoktur
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

function snapshot(): InstallPlatform {
  if (installed || isStandalone()) return "installed";
  if (deferred) return "prompt";
  if (isIos()) return "ios";
  return "manual";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

export function useInstallPlatform(): InstallPlatform | null {
  return useSyncExternalStore<InstallPlatform | null>(subscribe, snapshot, () => null);
}

/** Android/Chrome kurulum penceresini açar. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const e = deferred;
  deferred = null;
  await e.prompt();
  const { outcome } = await e.userChoice;
  emit();
  return outcome === "accepted";
}
