// $lib/utils/orbitalMechanics.ts

interface OrbitalElements {
  a: number; // شبه المحور الأكبر (بوحدات الوحدة الفلكية)
  e: number; // اللامركزية
  i: number; // الميل (بالدرجات)
  L: number; // الطول المتوسط (بالدرجات)
  wbar: number; // طول الحضيض (بالدرجات)
  O: number; // طول العقدة الصاعدة (بالدرجات)
}

const J2000 = new Date("2000-01-01T12:00:00Z").getTime();
const DAY = 86400000; // عدد الميلي ثانية في اليوم
const CENTURY = 36525 * DAY; // عدد الميلي ثانية في قرن يوليان

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function getCurrentCentury(): number {
  return (Date.now() - J2000) / CENTURY;
}

function calculateOrbitalElements(
  T: number,
  planet: OrbitalElements
): OrbitalElements {
  const { a, e, i, L, wbar, O } = planet;
  return {
    a: a + planet.aRate * T,
    e: e + planet.eRate * T,
    i: i + planet.iRate * T,
    L: (L + planet.LRate * T) % 360,
    wbar: (wbar + planet.wbarRate * T) % 360,
    O: (O + planet.ORate * T) % 360,
  };
}

function calculatePosition(
  elements: OrbitalElements
): [number, number, number] {
  const { a, e, i, L, wbar, O } = elements;
  const M = degToRad(L - wbar);
  const E = solveKeplerEquation(M, e);

  const x = a * (Math.cos(E) - e);
  const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const xEcliptic =
    (Math.cos(O) * Math.cos(wbar - O) -
      Math.sin(O) * Math.sin(wbar - O) * Math.cos(i)) *
      x +
    (-Math.cos(O) * Math.sin(wbar - O) -
      Math.sin(O) * Math.cos(wbar - O) * Math.cos(i)) *
      y;
  const yEcliptic =
    (Math.sin(O) * Math.cos(wbar - O) +
      Math.cos(O) * Math.sin(wbar - O) * Math.cos(i)) *
      x +
    (-Math.sin(O) * Math.sin(wbar - O) +
      Math.cos(O) * Math.cos(wbar - O) * Math.cos(i)) *
      y;
  const zEcliptic =
    Math.sin(i) * Math.sin(wbar - O) * x + Math.sin(i) * Math.cos(wbar - O) * y;

  return [xEcliptic, yEcliptic, zEcliptic];
}

function solveKeplerEquation(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 10; i++) {
    E = M + e * Math.sin(E);
  }
  return E;
}

export function getPlanetPosition(
  planet: OrbitalElements,
  time: number
): [number, number, number] {
  const T = time / (36525 * 86400); // تحويل الوقت إلى قرون يوليان
  const currentElements = calculateOrbitalElements(T, planet);
  return calculatePosition(currentElements);
}
