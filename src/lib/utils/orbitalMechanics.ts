// $lib/utils/orbitalMechanics.ts

// تعريف واجهة الكوكب
export interface Planet {
  name: string;
  texture: string;
  a: number; // شبه المحور الأكبر (بوحدات الوحدة الفلكية)
  e: number; // اللامركزية
  i: number; // الميل (بالدرجات)
  L: number; // الطول المتوسط (بالدرجات)
  wbar: number; // طول الحضيض (بالدرجات)
  O: number; // طول العقدة الصاعدة (بالدرجات)
  aRate: number; // معدل تغير شبه المحور الأكبر
  eRate: number; // معدل تغير اللامركزية
  iRate: number; // معدل تغير الميل
  LRate: number; // معدل تغير الطول المتوسط
  wbarRate: number; // معدل تغير طول الحضيض
  ORate: number; // معدل تغير طول العقدة الصاعدة
}

const J2000 = new Date("2000-01-01T12:00:00Z").getTime();
const DAY = 86400000; // عدد الميلي ثانية في اليوم
const CENTURY = 36525 * DAY; // عدد الميلي ثانية في قرن يوليان

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeAngle(angle: number): number {
  return angle - Math.floor(angle / 360) * 360;
}

function calculateOrbitalElements(T: number, planet: Planet): Planet {
  return {
    ...planet,
    a: planet.a + planet.aRate * T,
    e: planet.e + planet.eRate * T,
    i: normalizeAngle(planet.i + planet.iRate * T),
    L: normalizeAngle(planet.L + planet.LRate * T),
    wbar: normalizeAngle(planet.wbar + planet.wbarRate * T),
    O: normalizeAngle(planet.O + planet.ORate * T),
  };
}

function solveKeplerEquation(M: number, e: number): number {
  let E = M;
  const maxIterations = 30;
  const epsilon = 1e-6;
  for (let i = 0; i < maxIterations; i++) {
    const deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < epsilon) break;
  }
  return E;
}

export function calculatePlanetPosition(
  planet: Planet,
  date: Date
): [number, number, number] {
  const T = (date.getTime() - J2000) / CENTURY;
  const updatedPlanet = calculateOrbitalElements(T, planet);

  const { a, e, i, L, wbar, O } = updatedPlanet;
  const M = degToRad(normalizeAngle(L - wbar));
  const E = solveKeplerEquation(M, e);

  const xPrime = a * (Math.cos(E) - e);
  const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cosO = Math.cos(degToRad(O));
  const sinO = Math.sin(degToRad(O));
  const cosi = Math.cos(degToRad(i));
  const sini = Math.sin(degToRad(i));
  const cosw = Math.cos(degToRad(wbar - O));
  const sinw = Math.sin(degToRad(wbar - O));

  const x =
    (cosO * cosw - sinO * sinw * cosi) * xPrime +
    (-cosO * sinw - sinO * cosw * cosi) * yPrime;
  const y =
    (sinO * cosw + cosO * sinw * cosi) * xPrime +
    (-sinO * sinw + cosO * cosw * cosi) * yPrime;
  const z = sinw * sini * xPrime + cosw * sini * yPrime;

  // تحقق من القيم قبل إرجاعها
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    console.error("NaN values detected in planet position calculation", {
      planet,
      date,
      x,
      y,
      z,
    });
    return [0, 0, 0]; // قيمة افتراضية آمنة
  }

  return [x, y, z];
}

export function calculatePlanetVelocity(
  planet: Planet,
  date: Date
): [number, number, number] {
  // يمكن إضافة حساب السرعة هنا إذا كنت بحاجة إليها
  // هذه الوظيفة ستكون مفيدة لحساب اتجاه حركة الكوكب
  return [0, 0, 0]; // قيمة مؤقتة
}

export function getOrbitalPeriod(planet: Planet): number {
  // حساب الفترة المدارية بالأيام
  return 365.25 * Math.sqrt(Math.pow(planet.a, 3));
}

export function getCurrentCentury(): number {
  return (Date.now() - J2000) / CENTURY;
}
