"use client";

import { useSyncExternalStore } from "react";

/* ════════════════════════════════════════════════════════════════
   Service worker istemcisi — kayıt, mesajlaşma ve durum store'u.
   public/sw.js ile şu mesajlarla konuşur:
     → SYNC | GET_STATUS | DOWNLOAD_PACK | REMOVE_PACK
     ← SW_STATUS | SW_PROGRESS | SW_NETWORK
   ════════════════════════════════════════════════════════════════ */

export interface PackStatus {
  label: string;
  files: number;
  bytes: number;
  cached: number;
  cachedBytes: number;
  enabled: boolean;
}

export interface SyncProgress {
  phase: "pages" | "assets";
  done: number;
  total: number;
  pack?: string;
}

export interface OfflineState {
  /** "unsupported": tarayıcı SW desteklemiyor · "disabled": geliştirme modu */
  mode: "pending" | "unsupported" | "disabled" | "active";
  /** Tarayıcı çevrimiçi VE sunucuya ulaşılabiliyor (SW'nin gözlemi) */
  online: boolean;
  version: string | null;
  complete: boolean;
  pagesCached: number;
  pagesTotal: number;
  lastSync: string | null;
  syncing: boolean;
  progress: SyncProgress | null;
  packs: Record<string, PackStatus>;
}

const SW_URL = "/sw.js";

const initialState: OfflineState = {
  mode: "pending",
  online: true,
  version: null,
  complete: false,
  pagesCached: 0,
  pagesTotal: 0,
  lastSync: null,
  syncing: false,
  progress: null,
  packs: {},
};

let state: OfflineState = initialState;
const listeners = new Set<() => void>();

// online = navigator.onLine && sunucu ulaşılabilir (null: henüz bilinmiyor)
let browserOnline = true;
let reachable: boolean | null = null;

function setState(patch: Partial<OfflineState>) {
  state = { ...state, ...patch, online: browserOnline && reachable !== false };
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOfflineState(): OfflineState {
  return useSyncExternalStore(subscribe, () => state, () => initialState);
}

async function post(message: Record<string, unknown>) {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  (navigator.serviceWorker.controller ?? reg.active)?.postMessage(message);
}

export const requestSync = () => post({ type: "SYNC" });
export const downloadPack = (pack: string) => post({ type: "DOWNLOAD_PACK", pack });
export const removePack = (pack: string) => post({ type: "REMOVE_PACK", pack });

let started = false;

/** Uygulama açılışında bir kez çağrılır (OfflineManager). */
export function startServiceWorker() {
  if (started || typeof window === "undefined") return;
  started = true;

  browserOnline = navigator.onLine;
  setState({});
  window.addEventListener("offline", () => {
    browserOnline = false;
    setState({});
  });
  window.addEventListener("online", () => {
    browserOnline = true;
    reachable = null;
    setState({});
    requestSync(); // bağlantı geri geldi: eksikleri tamamla
  });

  // Sunucuya ulaşılamıyorken (internetsiz Wi-Fi vb.) periyodik kontrol;
  // SYNC isteği manifesti dener ve SW sonucu SW_NETWORK ile bildirir.
  window.setInterval(() => {
    if (reachable === false && browserOnline && document.visibilityState === "visible") requestSync();
  }, 20_000);

  if (!("serviceWorker" in navigator) || !("caches" in window)) {
    setState({ mode: "unsupported" });
    return;
  }

  // Geliştirmede SW, HMR ve güncel kodla çakışır → kayıtlı olanı kaldır.
  if (process.env.NODE_ENV !== "production") {
    setState({ mode: "disabled" });
    navigator.serviceWorker.getRegistrations().then(regs =>
      regs.filter(r => r.active?.scriptURL.endsWith(SW_URL)).forEach(r => r.unregister())
    );
    return;
  }

  navigator.serviceWorker.addEventListener("message", (event: MessageEvent) => {
    const data = event.data ?? {};
    if (data.type === "SW_STATUS") {
      if (typeof data.status?.reachable === "boolean") reachable = data.status.reachable;
      setState({ ...data.status, mode: "active" });
    } else if (data.type === "SW_NETWORK") {
      reachable = !!data.reachable;
      setState({});
    } else if (data.type === "SW_PROGRESS") {
      setState({ progress: data.progress, syncing: true });
    }
  });
  navigator.serviceWorker.startMessages();

  navigator.serviceWorker
    .register(SW_URL, { scope: "/", updateViaCache: "none" })
    .then(reg => {
      setState({ mode: "active" });
      reg.update().catch(() => {}); // yeni deploy varsa hemen al
      return navigator.serviceWorker.ready;
    })
    .then(() => {
      post({ type: "GET_STATUS" });
      requestSync();
    })
    .catch(err => {
      console.warn("[pwa] service worker kaydedilemedi", err);
      setState({ mode: "unsupported" });
    });

  // Tarayıcı depolamayı yer darlığında silmesin (özellikle Android/Chrome)
  navigator.storage?.persist?.().catch(() => {});
}
