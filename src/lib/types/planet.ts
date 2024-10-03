export interface PlanetData {
  name: string;
  texture: string;
  size: number;
  distance: number;
  rotationSpeed: number;
  orbitSpeed: number;
}
// $lib/types/planet.ts
export interface PlanetInfo {
  name: string;
  englishName: string;
  isPlanet: boolean;
  gravity: number;
  meanRadius: number;
  sideralOrbit: number;
  sideralRotation: number;
  avgTemp: number;
  density: number;
  moons: number;
  mass: {
    massValue: number;
    massExponent: number;
  };
  vol: {
    volValue: number;
    volExponent: number;
  };
  description: string;
  image: string;
}
