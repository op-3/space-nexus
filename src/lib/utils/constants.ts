export const PLANET_DATA = [
  {
    name: "Mercury",
    texture: "mercury.jpg",
    size: 0.4,
    distance: 10,
    rotationSpeed: 0.005,
    orbitSpeed: 0.01,
  },
  {
    name: "Venus",
    texture: "venus.jpg",
    size: 0.9,
    distance: 15,
    rotationSpeed: 0.003,
    orbitSpeed: 0.007,
  },
  {
    name: "Earth",
    texture: "earth.jpg",
    size: 1,
    distance: 20,
    rotationSpeed: 0.004,
    orbitSpeed: 0.005,
  },
  {
    name: "Mars",
    texture: "mars.jpg",
    size: 0.5,
    distance: 25,
    rotationSpeed: 0.003,
    orbitSpeed: 0.004,
  },
  {
    name: "Jupiter",
    texture: "jupiter.jpg",
    size: 2,
    distance: 40,
    rotationSpeed: 0.002,
    orbitSpeed: 0.002,
  },
  {
    name: "Saturn",
    texture: "saturn.jpg",
    size: 1.8,
    distance: 55,
    rotationSpeed: 0.002,
    orbitSpeed: 0.0015,
  },
  {
    name: "Uranus",
    texture: "uranus.jpg",
    size: 1.3,
    distance: 70,
    rotationSpeed: 0.001,
    orbitSpeed: 0.001,
  },
  {
    name: "Neptune",
    texture: "neptune.jpg",
    size: 1.2,
    distance: 85,
    rotationSpeed: 0.001,
    orbitSpeed: 0.0008,
  },
];

export const SUN_SIZE = 5;
export const CAMERA_INITIAL_POSITION = [0, 30, 100] as const;
export const ORBITAL_CAMERA_LIMITS = {
  minDistance: 10,
  maxDistance: 500,
  maxPolarAngle: Math.PI / 2,
} as const;

export const MOON_DATA = {
  name: "Moon",
  texture: "moon.jpg",
  size: 0.27, // نسبة إلى حجم الأرض
  distance: 2, // المسافة من الأرض
  rotationSpeed: 0.001,
  orbitSpeed: 0.05,
};

export const SATURN_RING_DATA = {
  innerRadius: 2.3,
  outerRadius: 3.5,
  texture: "saturn_rings.png",
};

export const NEARBY_GALAXIES = [
  {
    name: "Andromeda Galaxy",
    radius: 100,
    height: 10,
    branches: 6,
    spin: 1,
    particleCount: 100000,
    particleSize: 0.05,
    colorInside: "#ff6030",
    colorOutside: "#1b3984",
    position: { x: 500, y: 0, z: -1000 },
  },
  {
    name: "Triangulum Galaxy",
    radius: 80, // حجم أصغر من أندروميدا
    height: 8,
    branches: 3, // مجرة المثلث معروفة بأذرعها الحلزونية الثلاثة
    spin: 1.2,
    particleCount: 80000, // عدد أقل من الجسيمات مقارنة بأندروميدا
    particleSize: 0.04,
    colorInside: "#ff9d00", // لون داخلي يميل إلى البرتقالي
    colorOutside: "#4b0082", // لون خارجي أرجواني غامق
    position: { x: -400, y: 50, z: -800 }, // موقع مختلف عن أندروميدا
  },
  // يمكنك إضافة المزيد من المجرات هنا
];

export const EARTH_SATELLITES = [
  { name: "ISS", size: 0.1, distance: 2, orbitSpeed: 0.5, color: 0xffffff },
  {
    name: "Hubble",
    size: 0.05,
    distance: 2.1,
    orbitSpeed: 0.3,
    color: 0xcccccc,
  },
  {
    name: "GPS Satellite",
    size: 0.03,
    distance: 2.2,
    orbitSpeed: 0.2,
    color: 0xdddddd,
  },
];

export const SMALL_BODIES = [
  { name: "Ceres", size: 0.5, distance: 25, orbitSpeed: 0.1, color: 0xaaaaaa },
  { name: "Vesta", size: 0.3, distance: 26, orbitSpeed: 0.15, color: 0x999999 },
  {
    name: "Halley's Comet",
    size: 0.2,
    distance: 35,
    orbitSpeed: 0.05,
    color: 0xeeeeee,
  },
];
