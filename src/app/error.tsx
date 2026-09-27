"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Uygulama Hatası</h2>
      <p className="text-slate-400 mb-6">{error.message || "Bilinmeyen bir hata oluştu."}</p>
      <button onClick={() => reset()} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold">
        Yeniden Dene
      </button>
    </div>
  );
}
