// nasaApi.ts

import type { CelestialObjectInfo } from "$lib/types/celestialObject";

const NASA_SOLAR_SYSTEM_API = "https://api.le-systeme-solaire.net/rest/bodies";
const NASA_EXOPLANET_API =
  "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI";
const NASA_IMAGE_API_BASE = "https://images-api.nasa.gov";

// معلومات ثابتة للمجرات
const GALAXY_INFO: { [key: string]: Partial<CelestialObjectInfo> } = {
  "Andromeda Galaxy": {
    name: "Andromeda Galaxy",
    englishName: "Andromeda Galaxy",
    isPlanet: false,
    gravity: 0,
    meanRadius: 110000,
    sideralOrbit: 0,
    sideralRotation: 0,
    moons: 0,
    description:
      "The Andromeda Galaxy, also known as Messier 31, is the nearest major galaxy to the Milky Way. It's a spiral galaxy about 2.5 million light-years away.",
  },
  "Triangulum Galaxy": {
    name: "Triangulum Galaxy",
    englishName: "Triangulum Galaxy",
    isPlanet: false,
    gravity: 0,
    meanRadius: 30000,
    sideralOrbit: 0,
    sideralRotation: 0,
    moons: 0,
    description:
      "The Triangulum Galaxy, also known as Messier 33, is a spiral galaxy about 3 million light-years from Earth. It's the third-largest member of the Local Group of galaxies, which includes the Milky Way and Andromeda.",
  },
};

async function fetchWithErrorHandling(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Invalid JSON response");
  }
}

export async function getCelestialObjectInfo(
  objectName: string
): Promise<CelestialObjectInfo> {
  try {
    let planetInfo;

    // Check if it's a galaxy first
    if (GALAXY_INFO[objectName]) {
      planetInfo = GALAXY_INFO[objectName];
    } else {
      // Try Solar System API first
      try {
        const solarSystemUrl = `${NASA_SOLAR_SYSTEM_API}/${objectName}`;
        planetInfo = await fetchWithErrorHandling(solarSystemUrl);
      } catch (error) {
        console.log("Not found in Solar System API, trying Exoplanet API");
        // If not found, try Exoplanet API
        const exoplanetUrl = `${NASA_EXOPLANET_API}?table=exoplanets&where=pl_name like '${encodeURIComponent(
          objectName
        )}%'&order=pl_name&format=json`;
        const exoplanetData = await fetchWithErrorHandling(exoplanetUrl);
        if (exoplanetData.length > 0) {
          planetInfo = exoplanetData[0];
        } else {
          throw new Error(`No information found for ${objectName}`);
        }
      }
    }

    // Fetch images from NASA Image and Video Library
    const imageSearchUrl = `${NASA_IMAGE_API_BASE}/search?q=${encodeURIComponent(
      objectName
    )}&media_type=image`;
    const imageData = await fetchWithErrorHandling(imageSearchUrl);

    return {
      name: planetInfo.name || planetInfo.pl_name,
      englishName: planetInfo.englishName || planetInfo.pl_name,
      isPlanet: planetInfo.isPlanet !== undefined ? planetInfo.isPlanet : true,
      gravity: planetInfo.gravity || planetInfo.pl_g || 0,
      meanRadius:
        planetInfo.meanRadius ||
        (planetInfo.pl_rade ? planetInfo.pl_rade * 6371 : 0),
      sideralOrbit: planetInfo.sideralOrbit || planetInfo.pl_orbper || 0,
      sideralRotation: planetInfo.sideralRotation || 0,
      moons: planetInfo.moons ? planetInfo.moons.length : 0,
      description:
        planetInfo.description ||
        imageData.collection.items[0]?.data[0]?.description ||
        "No description available.",
      images: imageData.collection.items.map((item: any) => item.links[0].href),
      totalHits: imageData.collection.metadata.total_hits,
    };
  } catch (error) {
    console.error("Error fetching celestial object info:", error);
    throw new Error(`Failed to fetch info for ${objectName}: ${error.message}`);
  }
}

export async function getAnswer(question: string): Promise<string> {
  const objectName = question.replace(/^give me info (about )?/i, "").trim();
  try {
    const info = await getCelestialObjectInfo(objectName);

    let answer = `Here's some information about ${info.name}:\n\n`;
    answer += `Type: ${info.isPlanet ? "Planet" : "Celestial Object"}\n`;
    answer += `Gravity: ${info.gravity} m/s²\n`;
    answer += `Mean Radius: ${info.meanRadius} km\n`;
    answer += `Orbital Period: ${info.sideralOrbit} Earth days\n`;
    answer += `Rotation Period: ${info.sideralRotation} hours\n`;
    answer += `Number of Moons: ${info.moons}\n\n`;
    answer += `Description: ${info.description}\n`;

    return answer;
  } catch (error) {
    return `I'm sorry, but I couldn't find information about ${objectName}. ${error.message}`;
  }
}

export async function getCelestialObjectSound(
  objectName: string
): Promise<string | null> {
  try {
    const searchUrl = `${NASA_IMAGE_API_BASE}/search?q=${encodeURIComponent(
      objectName
    )}&media_type=audio`;
    const data = await fetchWithErrorHandling(searchUrl);

    if (data.collection.items.length > 0) {
      const audioAssetData = await fetchWithErrorHandling(
        data.collection.items[0].href
      );
      return (
        audioAssetData.find((asset: string) => asset.endsWith(".mp3")) || null
      );
    } else {
      console.log(`No sound found for ${objectName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching sound for ${objectName}:`, error);
    return null;
  }
}

export async function getAlbumImages(
  albumName: string,
  page: number = 1,
  pageSize: number = 100
): Promise<string[]> {
  try {
    const albumUrl = `${NASA_IMAGE_API_BASE}/search?q=${encodeURIComponent(
      albumName
    )}&media_type=image&page=${page}&page_size=${pageSize}`;
    const data = await fetchWithErrorHandling(albumUrl);

    const images = await Promise.all(
      data.collection.items.map(async (item: any) => {
        const assetData = await fetchWithErrorHandling(item.href);
        return (
          assetData.find(
            (asset: string) =>
              asset.endsWith("~orig.jpg") || asset.endsWith("~large.jpg")
          ) || item.links[0].href
        );
      })
    );

    return images;
  } catch (error) {
    console.error(`Error fetching album images for ${albumName}:`, error);
    throw new Error(
      `Failed to fetch album images for ${albumName}: ${error.message}`
    );
  }
}
