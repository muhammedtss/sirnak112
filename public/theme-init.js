/* Kayıtlı temayı ilk boyamadan önce uygular (açık temada koyu parlamayı önler). layout.tsx <head> içinden eşzamanlı yüklenir. */
try {
  var t = localStorage.getItem("theme");
  if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
