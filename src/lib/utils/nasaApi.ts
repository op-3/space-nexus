// nasaApi.ts
import type { CelestialObjectInfo } from "$lib/types/celestialObject";

const NASA_API_BASE = "https://images-api.nasa.gov";

const objectData: { [key: string]: Partial<CelestialObjectInfo> } = {
  Mercury: {
    gravity: 3.7,
    meanRadius: 2439.7,
    sideralOrbit: 87.97,
    sideralRotation: 1407.6,
    moons: 0,
    description:
      "Mercury is the smallest planet in our solar system and the closest to the Sun. It's a rocky world with a heavily cratered surface.",
  },
  Venus: {
    gravity: 8.87,
    meanRadius: 6051.8,
    sideralOrbit: 224.7,
    sideralRotation: -5832.5,
    moons: 0,
    description:
      "Venus is often called Earth's twin because of their similar size and mass. However, its thick atmosphere makes it the hottest planet in our solar system.",
  },
  Earth: {
    gravity: 9.8,
    meanRadius: 6371,
    sideralOrbit: 365.26,
    sideralRotation: 23.9345,
    moons: 1,
    description:
      "Earth is the only known planet to support life. It's the third planet from the Sun and has one natural satellite, the Moon.",
  },
  Mars: {
    gravity: 3.71,
    meanRadius: 3389.5,
    sideralOrbit: 686.98,
    sideralRotation: 24.6229,
    moons: 2,
    description:
      "Mars is known as the Red Planet due to its reddish appearance. It has seasons, polar ice caps, and the largest volcano in the solar system.",
  },
  Jupiter: {
    gravity: 24.79,
    meanRadius: 69911,
    sideralOrbit: 4332.59,
    sideralRotation: 9.925,
    moons: 79,
    description:
      "Jupiter is the largest planet in our solar system. It's a gas giant with a Great Red Spot, which is a giant storm that has lasted for hundreds of years.",
  },
  Saturn: {
    gravity: 10.44,
    meanRadius: 58232,
    sideralOrbit: 10759.22,
    sideralRotation: 10.656,
    moons: 82,
    description:
      "Saturn is famous for its beautiful ring system. It's another gas giant and is the least dense planet in the solar system.",
  },
  Uranus: {
    gravity: 8.69,
    meanRadius: 25362,
    sideralOrbit: 30688.5,
    sideralRotation: -17.24,
    moons: 27,
    description:
      "Uranus is an ice giant, composed mainly of icy materials. It's unique for rotating on its side, causing extreme seasons.",
  },
  Neptune: {
    gravity: 11.15,
    meanRadius: 24622,
    sideralOrbit: 60182,
    sideralRotation: 16.11,
    moons: 14,
    description:
      "Neptune is the windiest planet in our solar system and the last of the ice giants. It has a dark spot similar to Jupiter's Great Red Spot.",
  },
  Sun: {
    gravity: 274,
    meanRadius: 696340,
    sideralRotation: 609.12,
    moons: 0,
    description:
      "The Sun is the star at the center of our Solar System. It's a nearly perfect sphere of hot plasma, generating its energy through nuclear fusion.",
  },
  "Andromeda Galaxy": {
    description:
      "The Andromeda Galaxy, also known as Messier 31, is the nearest major galaxy to the Milky Way. It's a spiral galaxy about 2.5 million light-years away.",
  },
  "Triangulum Galaxy": {
    description:
      "The Triangulum Galaxy, also known as Messier 33, is a spiral galaxy about 3 million light-years from Earth. It's the third-largest member of the Local Group of galaxies, which includes the Milky Way and Andromeda.",
  },
};

async function fetchWithErrorHandling(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getCelestialObjectInfo(
  objectName: string,
  page: number = 1,
  pageSize: number = 50
): Promise<CelestialObjectInfo> {
  try {
    const searchUrl = `${NASA_API_BASE}/search?q=${encodeURIComponent(
      objectName
    )}&media_type=image&keywords=${encodeURIComponent(
      objectName
    )}&description=${encodeURIComponent(
      objectName
    )}&page=${page}&page_size=${pageSize}`;
    const data = await fetchWithErrorHandling(searchUrl);

    const images = await Promise.all(
      data.collection.items.map(async (item) => {
        const assetData = await fetchWithErrorHandling(
          `${NASA_API_BASE}/asset/${item.data[0].nasa_id}`
        );
        return (
          assetData.collection.items.find(
            (asset) =>
              asset.href.endsWith("~orig.jpg") ||
              asset.href.endsWith("~large.jpg")
          )?.href || item.links[0].href
        );
      })
    );

    const staticData = objectData[objectName] || {};

    return {
      name: objectName,
      englishName: objectName,
      isPlanet: !objectName.includes("Galaxy") && objectName !== "Sun",
      gravity: staticData.gravity || 0,
      meanRadius: staticData.meanRadius || 0,
      sideralOrbit: staticData.sideralOrbit || 0,
      sideralRotation: staticData.sideralRotation || 0,
      moons: staticData.moons || 0,
      description:
        staticData.description ||
        data.collection.items[0]?.data[0]?.description ||
        "No description available.",
      images: images,
      totalHits: data.collection.metadata.total_hits,
    };
  } catch (error) {
    console.error("Error fetching celestial object info:", error);
    throw new Error(`Failed to fetch info for ${objectName}: ${error.message}`);
  }
}

export async function getCelestialObjectSound(
  objectName: string
): Promise<string | null> {
  try {
    const searchUrl = `${NASA_API_BASE}/search?q=${encodeURIComponent(
      objectName
    )}&media_type=audio`;
    const data = await fetchWithErrorHandling(searchUrl);

    if (data.collection.items.length > 0) {
      const audioAssetData = await fetchWithErrorHandling(
        `${NASA_API_BASE}/asset/${data.collection.items[0].data[0].nasa_id}`
      );
      return (
        audioAssetData.collection.items.find((asset) =>
          asset.href.endsWith(".mp3")
        )?.href || null
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

// New function to get a list of images for an album
export async function getAlbumImages(
  albumName: string,
  page: number = 1,
  pageSize: number = 100
): Promise<string[]> {
  try {
    const albumUrl = `${NASA_API_BASE}/album/${encodeURIComponent(
      albumName
    )}?page=${page}&page_size=${pageSize}`;
    const data = await fetchWithErrorHandling(albumUrl);

    const images = data.collection.items.map((item) => item.links[0].href);
    return images;
  } catch (error) {
    console.error(`Error fetching album images for ${albumName}:`, error);
    throw new Error(
      `Failed to fetch album images for ${albumName}: ${error.message}`
    );
  }
}
