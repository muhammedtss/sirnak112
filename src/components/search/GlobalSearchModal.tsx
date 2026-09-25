"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import eriskinData from "@/data/eriskin.json";
import cocukData from "@/data/cocuk.json";
import yenidoganData from "@/data/yenidogan.json";

export interface SearchResultItem {
  id: string;
  title: string;
  category: "Erişkin" | "Çocuk" | "Yenidoğan" | "Genel Özellik";
  type: "algoritma" | "sayfa";
  url: string;
  description?: string;
}

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Hepsi");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
      setSelectedCategory("Hepsi");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Index all search items
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [
      // Static Pages & Features
      {
        id: "page-algoritmalar",
        title: "Algoritmalar (Tüm Kategoriler)",
        category: "Genel Özellik",
        type: "sayfa",
        url: "/algoritmalar",
        description: "Erişkin, çocuk ve yenidoğan acil algoritmaları ana menüsü",
      },
      {
        id: "page-eriskin-algoritmalar",
        title: "Erişkin Algoritmaları Listesi",
        category: "Erişkin",
        type: "sayfa",
        url: "/algoritmalar/eriskin",
        description: "41 adet erişkin acil algoritması",
      },
      {
        id: "page-cocuk-algoritmalar",
        title: "Çocuk Algoritmaları Listesi",
        category: "Çocuk",
        type: "sayfa",
        url: "/algoritmalar/cocuk",
        description: "30 adet çocuk acil algoritması",
      },
      {
        id: "page-yenidogan-algoritmalar",
        title: "Yenidoğan Algoritmaları Listesi",
        category: "Yenidoğan",
        type: "sayfa",
        url: "/algoritmalar/yenidogan",
        description: "7 adet yenidoğan acil algoritması",
      },
      {
        id: "page-ilac-doz",
        title: "İlaç Doz Hesaplamaları",
        category: "Genel Özellik",
        type: "sayfa",
        url: "/ilac-doz",
        description: "Acil ilaç doz hesaplama aracı",
      },
      {
        id: "page-ilac-doz-eriskin",
        title: "Erişkin İlaç Dozları",
        category: "Erişkin",
        type: "sayfa",
        url: "/ilac-doz/eriskin",
        description: "Erişkin hastalar için ilaç doz rehberi",
      },
      {
        id: "page-ilac-doz-cocuk",
        title: "Çocuk İlaç Dozları",
        category: "Çocuk",
        type: "sayfa",
        url: "/ilac-doz/cocuk",
        description: "Pediyatrik hastalar için ilaç doz rehberi",
      },
      {
        id: "page-ilac-doz-yenidogan",
        title: "Yenidoğan İlaç Dozları",
        category: "Yenidoğan",
        type: "sayfa",
        url: "/ilac-doz/yenidogan",
        description: "Yenidoğan hastalar için ilaç doz rehberi",
      },
    ];

    // Add Erişkin Algorithms
    Object.values(eriskinData).forEach((algo: any) => {
      items.push({
        id: `eriskin-${algo.id}`,
        title: algo.title,
        category: "Erişkin",
        type: "algoritma",
        url: `/algoritmalar/eriskin/${algo.id}`,
      });
    });

    // Add Çocuk Algorithms
    Object.values(cocukData).forEach((algo: any) => {
      items.push({
        id: `cocuk-${algo.id}`,
        title: algo.title,
        category: "Çocuk",
        type: "algoritma",
        url: `/algoritmalar/cocuk/${algo.id}`,
      });
    });

    // Add Yenidoğan Algorithms
    Object.values(yenidoganData).forEach((algo: any) => {
      items.push({
        id: `yenidogan-${algo.id}`,
        title: algo.title,
        category: "Yenidoğan",
        type: "algoritma",
        url: `/algoritmalar/yenidogan/${algo.id}`,
      });
    });

    return items;
  }, []);

  // Filtered Search Results
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const query = searchTerm.toLowerCase().trim();

    return allSearchItems.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "Hepsi" || item.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [allSearchItems, searchTerm, selectedCategory]);

  const getCategoryBadgeClass = (category: SearchResultItem["category"]) => {
    switch (category) {
      case "Erişkin":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "Çocuk":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "Yenidoğan":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <>
      {/* Search Button for Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full text-slate-600 hover:text-teal-600 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5"
        title="Genel Arama"
        aria-label="Genel Arama"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-12 sm:pt-20 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header / Search Bar */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
              <svg
                className="w-6 h-6 text-teal-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>

              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Algoritma, ilaç veya özellik ara..."
                className="flex-1 bg-transparent text-slate-800 text-lg placeholder-slate-400 focus:outline-none"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar">
              {["Hepsi", "Erişkin", "Çocuk", "Yenidoğan", "Genel Özellik"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Results Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {!searchTerm.trim() ? (
                <div className="text-center py-10 text-slate-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <p className="font-semibold text-slate-600">Aramak istediğiniz terimi yazın</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Örn: "Arrest", "Astım", "Şok", "İlaç Doz"
                  </p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="font-bold text-lg">Sonuç bulunamadı</p>
                  <p className="text-sm text-slate-400 mt-1">
                    "{searchTerm}" ile eşleşen algoritma veya özellik bulunamadı.
                  </p>
                </div>
              ) : (
                filteredResults.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="block bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 p-3.5 rounded-xl transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    )}
                  </Link>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>{filteredResults.length} sonuç bulundu</span>
              <span className="text-[11px] text-slate-400">Şırnak 112 Acil Protokol</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
