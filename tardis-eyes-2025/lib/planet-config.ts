interface PlanetConfig {
  center: [number, number];
  zoom: number;
  tileUrl: string;
  maxZoom: number;
  attribution: string;
  bounds?: [number, number][];
  noWrap?: boolean;
  tms?: boolean;
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
    tileUrl:
      "https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png",
    maxZoom: 8,
    attribution: "© OpenPlanetary",
  },
  mars: {
    center: [0, 0],
    zoom: 2,
    tileUrl:
      "https://api.nasa.gov/mars-wmts/catalog/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    maxZoom: 8,
    attribution: "© NASA",
    bounds: [
      [-90, -180],
      [90, 180],
    ],
    noWrap: true,
    tms: false,
  },
  earth: {
    center: [0, 0],
    zoom: 2,
    tileUrl:
      "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/{date}/EPSG4326_500m/{z}/{y}/{x}.jpeg",
    maxZoom: 8,
    attribution: "© NASA",
  },
};

export function getPlanetConfig(
  planet: "moon" | "mars" | "earth"
): PlanetConfig {
  return planetConfigs[planet];
}
