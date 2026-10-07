/**
 * "Developed by" imzası: EKG monitör ışını "Kadir TAŞ" ismini tek çizgiyle yazar,
 * iki kelime arasında bir QRS atımı yapar. Yazılan iz bir süre parlak kalır, söner
 * ve ışın yeniden yazar — sürekli döngü (globals.css › .sig-ecg).
 * Site sahibinin isteğiyle hareket azaltma tercihinde de oynar (bilinçli istisna).
 * İsim her an okunur kalsın diye altta soluk bir taban iz durur.
 */

/** Tek çizgilik (monoline) yol: 95×27 birimlik tuval, taban çizgisi y=20 (izoelektrik hat). */
function imzaYolu(): string {
  // "Kadir": küçük P dalgası, K, a, d, i (nokta ayrı alt yol), r
  let p =
    "M0 20 L1.2 20 Q2.2 17.6 3.2 20 L4 20 L4 4 L4 13 L12 4 L7 10.2 L12.5 20 L15 20 L22 20 L22 12.5 " +
    "Q22 10.5 18.8 10.5 Q15.5 10.5 15.5 15.3 Q15.5 20.2 18.8 20.2 Q22 20.2 22 16 L22 20 L24.5 20 L31.5 20 " +
    "L31.5 4 L31.5 16 Q31.5 20.2 28.2 20.2 Q25 20.2 25 15.3 Q25 10.5 28.2 10.5 Q31.5 10.5 31.5 13 L31.5 20 " +
    "L35.5 20 L35.5 11 M35.5 7.9 L35.5 7.1 M35.5 20 L38 20 L38 11 L38 14 Q39.5 10.8 43 11 M43.5 20 ";
  // Kelimeler arası atım: Q–R–S, ardından T dalgası
  p += "L46 20 L47.2 21.6 L49 5 L51 23 L52.4 20 Q54.4 16.8 56.4 20 L59 20 ";
  // "TAŞ"
  const X = 59;
  const x = (v: number) => (X + v).toFixed(1);
  p +=
    `L${x(4.5)} 20 L${x(4.5)} 4 L${x(0)} 4 L${x(9)} 4 L${x(4.5)} 4 L${x(4.5)} 20 ` +
    `L${x(11)} 20 L${x(16)} 4 L${x(21)} 20 M${x(13.2)} 13.5 L${x(18.8)} 13.5 ` +
    `M${x(31)} 7 Q${x(30)} 4 ${x(27)} 4 Q${x(23.3)} 4 ${x(23.3)} 7.6 Q${x(23.3)} 11.2 ${x(27)} 12 ` +
    `Q${x(31)} 12.8 ${x(31)} 16.4 Q${x(31)} 20 ${x(27)} 20 Q${x(24)} 20 ${x(23)} 17 ` +
    `M${x(27)} 20.4 L${x(27)} 22 Q${x(29)} 22.2 ${x(28.5)} 23.5 Q${x(28)} 24.6 ${x(26.2)} 24.3`;
  return p;
}

const YOL = imzaYolu();

export function SignatureEcg({ name }: { name: string }) {
  return (
    <svg className="sig-ecg" viewBox="0 0 95 27" height="18" role="img" aria-label={name}>
      <path className="sig-base" d={YOL} />
      <path className="sig-lit" pathLength={1} d={YOL} />
      <path className="sig-head" pathLength={1} d={YOL} />
    </svg>
  );
}
