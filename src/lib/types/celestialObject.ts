// $lib/types/celestialObject.ts
export interface CelestialObjectInfo {
  name: string;
  englishName: string;
  isPlanet: boolean;
  gravity: number;
  meanRadius: number;
  sideralOrbit: number;
  sideralRotation: number;
  moons: number;
  description: string;
  images: string[];
}
