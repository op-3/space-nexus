// src/lib/utils/planetPositions.ts

import { PLANET_DATA } from "./constants";

export function calculatePlanetPositions(date: Date) {
  const baseDate = new Date("2000-01-01T00:00:00Z");
  const daysSinceBase =
    (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24);

  return PLANET_DATA.map((planet) => {
    const angle = (planet.orbitSpeed * daysSinceBase) % (2 * Math.PI);
    const x = Math.cos(angle) * planet.distance;
    const z = Math.sin(angle) * planet.distance;
    console.log(`Calculated position for ${planet.name}:`, x, z);
    return {
      name: planet.name,
      x,
      z,
    };
  });
}
