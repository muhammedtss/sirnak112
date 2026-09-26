"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { Search, ChevronDown, Download, FileText } from "lucide-react";

type Kategori = "Kaza & Guvenlik" | "Hasta Bakim" | "Ilac & Malzeme" | "Enfeksiyon & KKE" | "Idari";

const KAT_RENK: Record<Kategori, { bg: string; color: string; border: string }> = {
  "Kaza & Guvenlik": { bg: "rgba(239,68,68,0.15)", color: "#EF4444", border: "rgba(239,68,68,0.25)" },
  "Hasta Bakim": { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", border: "rgba(59,130,246,0.25)" },
  "Ilac & Malzeme": { bg: "rgba(168,85,247,0.15)", color: "#A855F7", border: "rgba(168,85,247,0.25)" },
  "Enfeksiyon & KKE": { bg: "rgba(16,185,129,0.15)", color: "#10B981", border: "rgba(16,185,129,0.25)" },
  "Idari": { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "rgba(245,158,11,0.25)" },
};

const KAT_LABEL: Record<Kategori, string> = {
  "Kaza & Guvenlik": "Kaza & Güvenlik",
  "Hasta Bakim": "Hasta Bakım",
  "Ilac & Malzeme": "İlaç & Malzeme",
  "Enfeksiyon & KKE": "Enfeksiyon & KKE",
  "Idari": "İdari",
};

const KAT_SIRA: Kategori[] = ["Hasta Bakim", "Kaza & Guvenlik", "Ilac & Malzeme", "Enfeksiyon & KKE", "Idari"];

interface Evrak {
  id: string;
  kod: string;
  baslik: string;
  kategori: Kategori;
  aciklama: string;
  dosya: string;
  bolumler: { baslik: string; icerik: string }[];
}

const EVRAKLAR: Evrak[] = [
  {
    id: "vaka-kayit",
    kod: "HB.FR.001",
    baslik: "Ambulans Vaka Kayıt Formu",
    kategori: "Hasta Bakim",
    aciklama: "Her vakada doldurulmasi zorunlu temel hasta takip ve kayit formu",
    dosya: "/Ambulans_Evraklar/HB.FR.001 AMBULANS VAKA KAYIT FORMU.xls",
    bolumler: [
      { baslik: "Vaka Bilgileri", icerik: "Tarih/Saat | Istasyon | Cikis Saati | Vaka No | Adres | Hasta Adi Soyadi | Yas | Cinsiyet" },
      { baslik: "Sikayet & Muayene", icerik: "Sikayet | Tasiyon | Nabiz | SpO2 | GKS | Ates | Kan Sekeri" },
      { baslik: "Yapilan Islemler", icerik: "Oksijen Verildi | IV Damar Yolu | EKG | Monitor | Defibrilasyon | Entübasyon | Ilac Uygulandı | Serum Takıldı" },
      { baslik: "Personel", icerik: "Saglik Personeli (imza) | Sofor (imza)" },
    ],
  },
  {
    id: "tedavi-red",
    kod: "HB.FR.004",
    baslik: "Tedavi Red Formu",
    kategori: "Hasta Bakim",
    aciklama: "Hastanin tibbi tedaviyi reddetmesi durumunda imzalatilan yasal zorunlu belge. Hastalik bildirilmistir, tum riskler aciklanmistir, hasta kendi iradesiyle tedaviyi reddeder.",
    dosya: "/Ambulans_Evraklar/14-HB.FR.004 TEDAVİ RED FORMU.docx",
    bolumler: [
      { baslik: "Beyan Metni", icerik: "Tarih | 112 istasyon adi | Hastaligin durumu | Reddedilme sebebi | TEDAVIYI RED EDIYORUM beyanı" },
      { baslik: "Imzalar", icerik: "Hastanin Adi Soyadi (imza) | Sorumlu Personel (imza) | Hasta Yakininin Adi Soyadi (imza)" },
      { baslik: "Belge Bilgisi", icerik: "Kod: HB.FR.004 | Yayin: 01.01.2019 | Revizyon: 07.06.2022 (Rev.02)" },
    ],
  },
  {
    id: "kaza-evraklar",
    kod: "AS.FR.010",
    baslik: "Ambulans Kazasi Durumunda Gerekli Evraklar Listesi",
    kategori: "Kaza & Guvenlik",
    aciklama: "Ambulans kazalarinda toplanmasi gereken belgelerin VAR/YOK kontrol listesi. Evraklar KKM sorumlu soforune teslim edilir, 1 nusha istasyon sorumlusunda saklanir.",
    dosya: "/Ambulans_Evraklar/23-AS.FR.010 AMBULANS KAZASI DURUMUNDA GEREKLİ EVRAKLAR LİSTESİ.docx",
    bolumler: [
      { baslik: "Bilgi Alanlari", icerik: "Kaza yapan ekip | Tarih | Plaka | Sigorta police no | Olay yeri ve saati" },
      { baslik: "Kontrol Listesi (VAR / YOK)", icerik: "1-Trafik kazasi tespit tutanagi | 2-Alkol muayene raporu | 3-Ruhsat fotokopisi | 4-Surucu belgesi fotokopisi | 5-Hasar tespit tutanagi | 6-Trafik sigortasi police fotokopisi | 7-Kasko policesi | 8-Surucu ve ekip ifade tutanagi | 9-Kaza fotograflari | 10-KKM tutanagi | 11-Ambulans Vaka Kayit Formu | 12-Ekip yaralanma raporu" },
      { baslik: "Kaza Yapan Ambulans Surucu Imzasi", icerik: "Adi Soyadi: ___ | Imza: ___" },
    ],
  },
  {
    id: "kaza-algoritma",
    kod: "AS.YD.001",
    baslik: "Ambulans Kaza Algoritmasi",
    kategori: "Kaza & Guvenlik",
    aciklama: "Ambulansin kaza yapmasi durumunda uygulanacak karar algoritmasi. Hasta/yarali hayati tehlike ve ambulans hareket durumuna gore KOD (1-9) belirlenir.",
    dosya: "/Ambulans_Evraklar/09-AS.YD.001 AMBULANS KAZA ALGORİTMASI.docx",
    bolumler: [
      { baslik: "KOD 1", icerik: "Yerinde kal, kaza ile ilgili islemleri yaptir." },
      { baslik: "KOD 2", icerik: "Yerinde kal, kaza islemlerini yaptir. Yaraliyi KKM direktifi ile baska ambulans alir." },
      { baslik: "KOD 3", icerik: "Kaza yerini isaretl. KKM 155 onayi ile yaraliyi hastaneye gotur. Donuste kaza islemlerini yaptir." },
      { baslik: "KOD 4", icerik: "Yerinde kal, kaza islemlerini yaptir. Hastay KKM direktifi ile baska ambulans alir." },
      { baslik: "KOD 5", icerik: "Kaza yerini isaretle. KKM onayi ile hastay hastaneye gotur. Donuste kaza islemlerini yaptir." },
      { baslik: "KOD 6", icerik: "Yerinde kal, kaza islemlerini yaptir. Hasta ve yaraliyi KKM direktifi ile baska ambulanslar alir." },
      { baslik: "KOD 7", icerik: "Kaza yerini isaretle. KKM onayi ile yaraliyi da ambulansa alabiliyorsan al. Alamiyorsan saglik personelini yaralinin yaninda birak, hayati tehlikesi olan hastay hastaneye gotur." },
      { baslik: "KOD 8", icerik: "Mudahaleni yap. KKM direktifi ile baska ambulanslar hastay ve yaraliyi alir. Kaza islemlerini yaptir." },
      { baslik: "KOD 9", icerik: "Kaza yerini isaretle. KKM onayi ile yaraliyi ambulansa al. Alamiyorsan hastay sedye ile indir, personeli yaninda birak, yaraliyi al ve hastaneye gotur." },
    ],
  },
  {
    id: "kaza-formu",
    kod: "AS.FR.006",
    baslik: "Ambulans Kaza Formu",
    kategori: "Kaza & Guvenlik",
    aciklama: "Ambulans kaza durumunda doldurulan resmi kayit formu",
    dosya: "/Ambulans_Evraklar/16-AS.FR.006 AMBULANS KAZA FORMU.xlsx",
    bolumler: [
      { baslik: "Genel Bilgiler", icerik: "Tarih | Saat | Plaka | Istasyon | Surucu Adi Soyadi | Ekip Uyeleri" },
      { baslik: "Kaza Detaylari", icerik: "Kaza Yeri/Adresi | Kaza Tanimi" },
      { baslik: "Hasar & Yarali Durumu", icerik: "Ambulans hasar durumu: Hasar Yok / Hafif / Agir | Yarali/Hayati Tehlike: Ekip Yarali / Hasta Etkilendi / 3. Sahis Etkilendi" },
      { baslik: "Imzalar", icerik: "Surucu Imzasi | Istasyon Sorumlusu Imzasi" },
    ],
  },
  {
    id: "advers-etki",
    kod: "IY.FR.001",
    baslik: "Advers Etki Bildirim Formu",
    kategori: "Ilac & Malzeme",
    aciklama: "Turkiye Farmakovigilans Merkezi'ne ilac yan etki bildirimi icin kullanilan form",
    dosya: "/Ambulans_Evraklar/6-İY.FR.001 ADVERS ETKİ BİLDİRİM FORMU.docx",
    bolumler: [
      { baslik: "A. Hastaya Ait Bilgiler", icerik: "Bas harfleri | Dogum tarihi/Yas | Boy | Agirlik | Cinsiyet: Kadin/Erkek | Ciddiyet: Ciddi/Ciddi olmayan" },
      { baslik: "Ciddiyet Kriterleri", icerik: "Olum | Hayati Tehdit Edici | Hastaneye Yatisa Sebep Olma | Kalici/Belirgin Sakatlik | Konjenital Anomali | Tibbi olarak Onemli" },
      { baslik: "B. Advers Etki(ler)", icerik: "Etki tanimi | Baslangic tarihi | Bitis tarihi | Sonuc: Iyilesti / Iyilesiyor / Sekel birakarak iyilesti / Devam ediyor / Olumle sonuclandi / Bilinmiyor | Laboratuvar bulgulari | Tibbi oyku" },
      { baslik: "C. Kullanilan Tibbi Urun", icerik: "Ilac adi | Verilis yolu | Gunluk doz | Endikasyon | Baslama/Kesilme tarihi | Ilac kesildi mi? | Kesilince etki azaldi mi? | Ilac yeniden verildi mi?" },
      { baslik: "D. Bildirimi Yapan", icerik: "Adi soyadi | Meslegi | Adresi | Tarih | Imza" },
    ],
  },
  {
    id: "miadli-ilac",
    kod: "IY.FR.003",
    baslik: "Miadı Geçmiş İlaç ve Malzeme Teslim Formu",
    kategori: "Ilac & Malzeme",
    aciklama: "Son kullanma tarihi gecmis ilac ve malzemelerin teslim kaydi",
    dosya: "/Ambulans_Evraklar/8-İY.FR.003 MİADI GEÇMİŞ İLAÇ VE MALZEME TESLİM FORMU.doc",
    bolumler: [
      { baslik: "Teslim Bilgileri", icerik: "Teslim eden istasyon | Tarih | Teslim eden personel | Teslim alan personel" },
      { baslik: "Teslim Edilen Urunler (Tablo)", icerik: "Sira | Ilac/Malzeme Adi | Miktari | SKT | Aciklama" },
      { baslik: "Imzalar", icerik: "Teslim Eden Imzasi | Teslim Alan Imzasi" },
    ],
  },
  {
    id: "ilac-kontrol",
    kod: "IY.FR.006",
    baslik: "Ambulansta Bulundurulacak İlaç ve Serumlar Kontrol Formu",
    kategori: "Ilac & Malzeme",
    aciklama: "Ambulanstaki ilac ve serum stok kontrolu ve vardiya teslim formu",
    dosya: "/Ambulans_Evraklar/12-İY.FR.006 AMBULANSTA BULUNDURULACAK İLAÇ VE SERUMLAR KONTROL VE TESLİM  FORMU.doc",
    bolumler: [
      { baslik: "Istasyon & Vardiya", icerik: "Istasyon | Tarih | Devreden personel | Devralan personel" },
      { baslik: "Ilac Kontrol Listesi (Tablo)", icerik: "Sira | Ilac/Serum Adi | Olmasi Gereken | Mevcut | SKT | Durum — Adrenalin, Atropin, Diazepam, Dopamin, Furosemid, Lidokain, Metilprednizolon, Midazolam, Morfin, NaHCO3, Nitrogliserin, G5 Serum, Izotonik 0.9, Ringer Laktat, Dekstroz 10" },
      { baslik: "Imzalar", icerik: "Devreden Personel Imzasi | Devralan Personel Imzasi" },
    ],
  },
  {
    id: "esya-teslim",
    kod: "KY.FR.008",
    baslik: "Hasta Eşyaları Teslim Formu",
    kategori: "Hasta Bakim",
    aciklama: "Hastaya ait esyalarin teslim alindigi belge",
    dosya: "/Ambulans_Evraklar/11-KY.FR.008 HASTA EŞYALARI TESLİM FORMU.doc",
    bolumler: [
      { baslik: "Hasta Bilgileri", icerik: "Hasta Adi Soyadi | Tarih/Saat | Vaka No" },
      { baslik: "Esya Listesi (Tablo)", icerik: "Sira | Esya Adi | Adet | Aciklama (10 satirlik bos tablo)" },
      { baslik: "Imzalar", icerik: "Teslim Eden | Teslim Alan" },
    ],
  },
  {
    id: "vefat",
    kod: "HB.FR.003",
    baslik: "Vefat Durumları Bilgilendirme Formu",
    kategori: "Hasta Bakim",
    aciklama: "Vefat vakalarinda hasta yakinlarinin bilgilendirilmesi icin kullanilan form",
    dosya: "/Ambulans_Evraklar/12-HB.FR.003 VEFAT DURUMLARI İÇİN BİLGİLENDİRME FORMU.doc",
    bolumler: [
      { baslik: "Beyan Metni", icerik: "Tarih | Adres | Yapilan degerlendirilmede hastanin vefat ettigi tespit edilmistir. CPR girisimi sonucsuz kalmistir." },
      { baslik: "Hasta Bilgileri", icerik: "Hastanin Adi Soyadi | Dogum Tarihi | TC Kimlik | Vefat Yeri | Vefat Tarihi/Saati | Tahmini Vefat Saati" },
      { baslik: "Bilgilendirilen Yakin", icerik: "Yakin Adi Soyadi | Yakinlik Derecesi | Iletisim No" },
      { baslik: "Imzalar", icerik: "Ekip Gorevlisi | Hasta Yakini" },
    ],
  },
  {
    id: "dogum-raporu",
    kod: "HB.FR.007",
    baslik: "Ambulansta Gerçekleşen Doğum Raporu",
    kategori: "Hasta Bakim",
    aciklama: "Ambulansta gerceklesen dogum vakalarinin resmi kayit altina alindigi belge",
    dosya: "/Ambulans_Evraklar/19-HB.FR.007 AMBULANSTA GERÇEKLEŞEN DOĞUM RAPORU.docx",
    bolumler: [
      { baslik: "Anne Bilgileri", icerik: "Anne Adi Soyadi | TC Kimlik | Yas | Gebelik Sayisi (Parite/Gravida)" },
      { baslik: "Dogum Detaylari", icerik: "Dogum Tarihi | Saati | Plaka | APGAR (1. ve 5. Dk) | Plasenta Ayrildi mi?" },
      { baslik: "Bebek Bilgileri", icerik: "Cinsiyet | Cilt Rengi | Aglama Durumu" },
      { baslik: "Imzalar", icerik: "Dogumu Gerceklestiren (Imza) | Ekip Gorevlisi (Imza)" },
    ],
  },
  {
    id: "sozel-order",
    kod: "HB.FR.002",
    baslik: "Sözel Order Formu",
    kategori: "Hasta Bakim",
    aciklama: "Doktor tarafindan telefon ile verilen ilac/tedavi emirlerinin kayit altina alindigi form",
    dosya: "/Ambulans_Evraklar/8-HB.FR.002 SÖZEL ORDER FORMU.doc",
    bolumler: [
      { baslik: "Bilgi Alanlari", icerik: "Tarih/Saat | Vaka No | Hasta Adi | Order veren doktorun adi | Doktorun kurumu/bransi" },
      { baslik: "Order Icerik", icerik: "Order icerigi | Uygulanan ilac/doz/yol" },
      { baslik: "Tekrar Onay", icerik: "Order geri okunarak onaylatildi mi? Evet / Hayir" },
      { baslik: "Imzalar", icerik: "Uygulayan Personel | Tanik" },
    ],
  },
  {
    id: "refakatci-onam",
    kod: "HE.FR.001",
    baslik: "Ambulans Refakatçi Onam Formu",
    kategori: "Hasta Bakim",
    aciklama: "Hasta ile ambulansa binen refakatcinin bilgilendirilmis onam belgesi",
    dosya: "/Ambulans_Evraklar/9-HE.FR.001 AMBULANS REFAKATÇİ ONAM FORMU.doc",
    bolumler: [
      { baslik: "Beyan Metni", icerik: "Tarih | Ambulans no | Hastanin refakatcisi olarak ambulansa binmek istiyorum. Ekibin calismalarinai mudahale etmeyecegimi, talimatlara uyacagimi ve gerektiginde aractan inebilecegimi kabul ederim." },
      { baslik: "Refakatci Bilgileri", icerik: "Adi Soyadi | TC Kimlik | Yakinlik Derecesi | Tarih/Saat | Hastanin Adi Soyadi" },
      { baslik: "Imzalar", icerik: "Refakatci | Ekip Gorevlisi" },
    ],
  },
  {
    id: "kke-listesi",
    kod: "EN.YD.003",
    baslik: "Kişisel Koruyucu Ekipmanlar (KKE) Listesi",
    kategori: "Enfeksiyon & KKE",
    aciklama: "Ambulansta bulunmasi gereken KKE listesi",
    dosya: "/Ambulans_Evraklar/9-EN.YD.003 KİŞİSEL KORUYUCU EKİPMANLAR LİSTESİ.docx",
    bolumler: [
      { baslik: "Steril Eldiven", icerik: "Kullanim: Invazif islemler, damar yolu, pelvik muayene, endotrakeal aspirasyon | Miktar: 10luk paket | Sure: Tek kullanimlik" },
      { baslik: "Non-Steril Nitril Eldiven", icerik: "Kullanim: Kan, vucut sivisi, sekresyon temas islemleri | Miktar: 100luk paket | Sure: Tek kullanimlik" },
      { baslik: "Cerrahi Maske", icerik: "Kullanim: Damlacik izolasyonu, genel koruma | Miktar: 50 adet | Sure: 4-8 saat" },
      { baslik: "FFP2/N95 Maske", icerik: "Kullanim: Havayolu enfeksiyonlari (TB, COVID vb.) | Miktar: 10 adet | Sure: Tek kullanimlik" },
      { baslik: "Yuz Siperi / Gozluk", icerik: "Kullanim: Sivi sicrama riski | Miktar: 2 adet | Sure: Hasar gorunde degistir" },
      { baslik: "Onluk / Tulum", icerik: "Kullanim: Yuksek riskli izolasyon vakalari | Tulum: 2 adet, Onluk: 10 adet | Sure: Tek kullanimlik" },
    ],
  },
  {
    id: "enfeksiyon-sema",
    kod: "EN.YD.001",
    baslik: "Enfeksiyon Önleme İşleyiş Şeması",
    kategori: "Enfeksiyon & KKE",
    aciklama: "Ambulansta enfeksiyon onleme ve kontrol prosedurlerinin adim adim isleyisi",
    dosya: "/Ambulans_Evraklar/07-EN.YD.001 ENFEKSİYONLARIN ÖNLENMESİNE YÖNELİK İŞLEYİŞ ŞEMASI (1).doc",
    bolumler: [
      { baslik: "1. Hasta Kabulunden Once", icerik: "KKE degerlendirmesi yap | Ambulans ici dezenfeksiyon kontrolu | Kullanici ekipmanlarini hazirla" },
      { baslik: "2. Vaka Sirasinda", icerik: "Uygun KKE kullan | Tibbi atiklari sari torbaya at | Kesici/delici aletleri guvenli kaba koy | Hasta temas sonrasi el hijyeni" },
      { baslik: "3. Hastane Teslimat Sonrasi", icerik: "Tek kullanimlik malzemeleri at | Yuzeyler dezenfektanla temizle | KKEyi cikar ve at | El dezenfeksiyonu uygula" },
      { baslik: "4. Izolasyon Vakalarinda Ek Onlemler", icerik: "Tum ekip FFP2 maske, tulum ve yuz siperi kullanir | Ambulansi ventile et | Tum malzemeleri imha et | Istasyona bildirim yap" },
    ],
  },
  {
    id: "kesici-yaralanma",
    kod: "KG.FR.016",
    baslik: "Kesici Delici Alet Yaralanma Veri Toplama Formu",
    kategori: "Enfeksiyon & KKE",
    aciklama: "Kesici delici alet yaralanmalarinin kayit ve bildirimi",
    dosya: "/Ambulans_Evraklar/16-KG.FR.016 KESİCİ DELİCİ ALET YARALANMA ORANI VERİ TOPLAMA FORMU.docx",
    bolumler: [
      { baslik: "Bilgi Alanlari", icerik: "Bildirimi yapan birim | Ait oldugu ay/yil" },
      { baslik: "Olay Bilgileri", icerik: "Yaralanan calisanin adi soyadi | Gorevi | Olaya neden olan alet | Olayın meydana geldigi yer | Yaralanma bolgesi" },
      { baslik: "Risk Degerlendirmesi", icerik: "Alet kontamine miydi? Evet/Hayir | Kan yolu bulasmasi riski var mi? Evet/Hayir | KKE kullanildi mi? Evet/Hayir" },
      { baslik: "Alinan Onlemler", icerik: "Yaralanma sonrasi yapilan islem | Basvurulan saglik birimi" },
    ],
  },
  {
    id: "ramak-kala",
    kod: "IO.FR.001",
    baslik: "Ramak Kala Olay Formu",
    kategori: "Kaza & Guvenlik",
    aciklama: "Zarar vermemis ancak zarar verme potansiyeli olan olaylarin bildirimi",
    dosya: "/Ambulans_Evraklar/3-İO.FR.001 RAMAK KALA OLAY FORMU.doc",
    bolumler: [
      { baslik: "Tanim", icerik: "Ramak Kala Olay: Zarar vermemis ancak zarar verme potansiyeli olan; guvenli olmayan durum, eylem veya kararlari ifade eder." },
      { baslik: "Bilgi Alanlari", icerik: "Tarih/Saat | Birim/Istasyon | Bildirimi yapan | Olayın gerceklestigi yer" },
      { baslik: "Katkida Bulunan Faktorler", icerik: "Iletisim sorunu | Donanim/Ekipman | Egitim eksikligi | Yorgunluk | Ortam kosullari | Prosedur eksikligi" },
      { baslik: "Oneri", icerik: "Tekrarlanmamasi icin oneriniz" },
    ],
  },
  {
    id: "istenmeyen-olay",
    kod: "IO.FR.005",
    baslik: "İstenmeyen Olay Bildirim Formu",
    kategori: "Idari",
    aciklama: "Beklenmedik ve olumsuz sonuclanan olaylarin sistemsel bildirimi",
    dosya: "/Ambulans_Evraklar/7-İO.FR.005 İSTENMEYEN OLAY BİLDİRİM FORMU.doc",
    bolumler: [
      { baslik: "Olay Turu", icerik: "Ilac Hatasi | Dusme | Tibbi Cihaz Arizasi | Enfeksiyon | Hasta Kimlik Hatasi | Tani Gecikmesi | Kaza | Diger" },
      { baslik: "Olay Detayi", icerik: "Olay tanimi | Olayın hastaya etkisi | Alinan anlik onlemler" },
      { baslik: "Ciddiyeti", icerik: "Zararsiz | Hafif Hasar | Orta Hasar | Agir Hasar | Olum | Potansiyel Hasar" },
      { baslik: "Imzalar", icerik: "Bildirimi yapan | Yonetici" },
    ],
  },
  {
    id: "is-kazasi",
    kod: "KY.FR.006",
    baslik: "İş Kazası Bildirim Formu",
    kategori: "Kaza & Guvenlik",
    aciklama: "Personelin is kazasi gecirmesi durumunda yasal bildirim formu",
    dosya: "/Ambulans_Evraklar/9-KY.FR.006 İŞ KAZASI BİLDİRİM FORMU.doc",
    bolumler: [
      { baslik: "Bilgi Alanlari", icerik: "Kazanin tarihi/saati | Istasyon/birim | Kazaya ugrayan personel | TC Kimlik | Gorevi | Kaza yeri" },
      { baslik: "Kaza Turu", icerik: "Dusme | Carpma/Takilma | Kesici/Delici Alet | Kimyasal Temas | Arac Kazasi | Zorlanma/Gerilme | Elektrik Carpmasi | Diger" },
      { baslik: "Yaralanma Detayi", icerik: "Yaralanan vucut bolgesi | Yaralanma turu | Basvurulan saglik birimi | Kaza tanimi" },
      { baslik: "Imzalar", icerik: "Kazaya ugrayan | Istasyon sorumlusu" },
    ],
  },
  {
    id: "zimmet",
    kod: "AS.FR.010",
    baslik: "Ambulansta Bulunan Malzemelerin Zimmet Formu",
    kategori: "Idari",
    aciklama: "Ambulanstaki malzeme ve ekipmanlarin personele zimmetlenmesi",
    dosya: "/Ambulans_Evraklar/AS.FR.010 AMBULANSTA BULUNAN MALZEMELERİN ZİMMET FORMU.doc",
    bolumler: [
      { baslik: "Zimmet Bilgileri", icerik: "Ambulans Plakasi | Istasyon | Zimmet Tarihi | Personel Adi Soyadi" },
      { baslik: "Zimmetlenen Malzemeler (Tablo)", icerik: "Defibrilator | Monitor | Pulse Oksimetre | Tansiyon Aleti | Glukometer | Laringoskop Seti | Suction Cihazi | Oksijen Tupu | Seyyar Sedye | Tasima Sandalyesi | Boyunluk Seti | Vakum Atel Seti — (Sira | Malzeme | Marka/Model | Seri No | Adet | Durum)" },
      { baslik: "Imzalar", icerik: "Zimmet alan | Zimmet veren yetkili" },
    ],
  },
];

function EvrakKart({ evrak }: { evrak: Evrak }) {
  const [acik, setAcik] = useState(false);
  const tagColor = KAT_RENK[evrak.kategori];

  return (
    <div className="glass-card overflow-hidden" style={{ borderColor: acik ? tagColor.border : "var(--glass-border)" }}>
      <button className="w-full text-left" onClick={() => setAcik((v) => !v)} aria-expanded={acik}>
        <div className="px-4 py-3.5 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-bold mb-1 opacity-70" style={{ color: tagColor.color }}>{evrak.kod}</div>
            <h3 className="font-bold text-sm sm:text-base leading-tight">{evrak.baslik}</h3>
          </div>
          <motion.div
            animate={{ rotate: acik ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5"
          >
            <ChevronDown className="w-4 h-4 text-subtle" />
          </motion.div>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between gap-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
          <p className="text-subtle text-xs leading-snug flex-1 line-clamp-2">{evrak.aciklama}</p>
          <span
            className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{ background: tagColor.bg, color: tagColor.color, borderColor: tagColor.border }}
          >
            {KAT_LABEL[evrak.kategori]}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {acik && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t" style={{ borderColor: "var(--glass-border)" }}>
              <div className="px-4 py-4 space-y-3">
                {evrak.bolumler.map((b, i) => (
                  <div key={i} className="rounded-xl border p-3" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--glass-border)" }}>
                    <div className="text-[11px] font-bold tracking-wide uppercase mb-2" style={{ color: tagColor.color }}>{b.baslik}</div>
                    <div className="text-xs leading-relaxed space-y-1">
                      {b.icerik.split(" | ").map((item, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: tagColor.color, opacity: 0.5 }} />
                          <span className="text-muted">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <a
                  href={evrak.dosya}
                  download
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl active:scale-[0.97] transition-all border"
                  style={{ background: tagColor.bg, color: tagColor.color, borderColor: tagColor.border }}
                >
                  <Download style={{ width: 16, height: 16 }} />
                  Orijinal Dosyayı İndir
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EvraklarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [seciliKat, setSeciliKat] = useState<Kategori | "Tumu">("Tumu");

  const filtrelenmis = EVRAKLAR.filter((e) => {
    const aramaUyumu =
      e.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.kod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.aciklama.toLowerCase().includes(searchTerm.toLowerCase());
    const katUyumu = seciliKat === "Tumu" || e.kategori === seciliKat;
    return aramaUyumu && katUyumu;
  });

  const kategorilerGrubu = seciliKat === "Tumu" ? KAT_SIRA : [seciliKat as Kategori];

  return (
    <PageShell>
      <AppHeader
        title="Evraklar"
        back="/"
        icon={<FileText style={{ width: 16, height: 16 }} />}
        badge={EVRAKLAR.length}
      />

      <div className="sticky top-[57px] z-10 px-4 py-3 glass border-b space-y-3" style={{ borderColor: "var(--glass-border)" }}>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-subtle" style={{ width: 15, height: 15 }} />
          <input
            type="text"
            className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
            placeholder="Evrak ara (kod veya başlık)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5 max-w-2xl mx-auto">
          {(["Tumu", ...KAT_SIRA] as (Kategori | "Tumu")[]).map((kat) => {
            const isActive = seciliKat === kat;
            const style = kat !== "Tumu"
              ? (isActive
                  ? { background: KAT_RENK[kat].bg, color: KAT_RENK[kat].color, borderColor: KAT_RENK[kat].border }
                  : { background: "rgba(255,255,255,0.04)", color: "var(--fg-muted)", borderColor: "var(--glass-border)" })
              : (isActive
                  ? { background: "rgba(255,255,255,0.15)", color: "var(--fg)", borderColor: "rgba(255,255,255,0.25)" }
                  : { background: "rgba(255,255,255,0.04)", color: "var(--fg-muted)", borderColor: "var(--glass-border)" });
            
            return (
              <button
                key={kat}
                onClick={() => setSeciliKat(kat)}
                className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
                style={style}
              >
                {kat === "Tumu" ? "Tümü" : KAT_LABEL[kat]}
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-6">
        {filtrelenmis.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm font-medium">Sonuç bulunamadı.</div>
        ) : (
          kategorilerGrubu.map((kat) => {
            const katEvraklar = filtrelenmis.filter((e) => e.kategori === kat);
            if (katEvraklar.length === 0) return null;
            const tagColor = KAT_RENK[kat];
            return (
              <div key={kat}>
                <h2
                  className="text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl mb-3 inline-block"
                  style={{ color: tagColor.color, background: tagColor.bg }}
                >
                  {KAT_LABEL[kat]} ({katEvraklar.length})
                </h2>
                <div className="space-y-3">
                  {katEvraklar.map((e) => <EvrakKart key={e.id} evrak={e} />)}
                </div>
              </div>
            );
          })
        )}
      </main>
    </PageShell>
  );
}
