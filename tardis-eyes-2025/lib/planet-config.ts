interface PlanetConfig {
  center: [number, number];
  zoom: number;
  maxZoom: number;
  minZoom?: number;
  tileUrl: string;
  attribution: string;
  bounds?: [number, number][];
  noWrap?: boolean;
}

interface PlanetConfigs {
  moon: PlanetConfig;
  mars: PlanetConfig;
  earth: PlanetConfig;
}

export const planetConfigs: PlanetConfigs = {
  moon: {
    center: [0, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 8,
    // URL oficial do WMTS da NASA para a Lua
    tileUrl:
      "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    attribution: "© NASA / GSFC / ASU",
    noWrap: true,
  },
  mars: {
    center: [0, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 8,
    // URL oficial do Mars Reconnaissance Orbiter da NASA
    tileUrl:
      "https://api.nasa.gov/mars-wmts/mars/Mars_MGS_MOLA_DEM_mosaic_global_463m/default/default028mm/{z}/{y}/{x}.png?api_key=DEMO_KEY",
    attribution: "© NASA / JPL / USGS",
    noWrap: true,
  },
  earth: {
    center: [0, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 9,
    // URL oficial do NASA GIBS (Global Imagery Browse Services)
    tileUrl:
      "https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    attribution: "© NASA EOSDIS GIBS",
    noWrap: false, // Permite "dar a volta" na Terra
  },
};

export function getPlanetConfig(
  planet: "moon" | "mars" | "earth"
): PlanetConfig {
  return planetConfigs[planet];
}
