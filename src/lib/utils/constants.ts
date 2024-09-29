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
