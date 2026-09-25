// src/types/index.ts

// Bir adımın ne tür bir işlev göreceğini belirliyoruz
export type NodeType = 'action' | 'decision' | 'redirect';

export interface AlgorithmNode {
  id: string;              // Düğümün benzersiz kimliği (Örn: 'bradikardi_adim_1')
  type: NodeType;          // Düğümün tipi
  content: string;         // Ekranda yazacak metin (Örn: "Bilinç açık mı?", "Oksijen ver")
  
  // Eğer type === 'action' ise bir sonraki adıma geçiş için
  nextId?: string | null;  // null ise akış burada biter
  
  // Eğer type === 'decision' (Karar) ise
  yesId?: string;          // Evet seçilirse gidilecek düğümün ID'si
  noId?: string;           // Hayır seçilirse gidilecek düğümün ID'si
  
  // Eğer type === 'redirect' (Başka algoritmaya yönlendirme) ise
  targetAlgorithmId?: string; // Gidilecek yeni algoritmanın ID'si (Örn: 'arrest_yonetimi')
  
  // Arayüzde kırmızı uyarı veya dikkat çekici bir kutu için (Opsiyonel)
  isCritical?: boolean;    
}

// Bütün bir algoritmanın (Örn: Erişkin Bradikardi) ana çatısı
export interface Algorithm {
  id: string;              // (Örn: 'eriskin_bradikardi')
  title: string;           // (Örn: 'Bradikardi Algoritması')
  category: 'eriskin' | 'cocuk' | 'yenidogan';
  startNodeId: string;     // Akışın başlayacağı ilk düğümün ID'si
  nodes: Record<string, AlgorithmNode>; // ID'yi key, Node'u value olarak tutan obje
}