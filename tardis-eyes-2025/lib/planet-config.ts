interface PlanetConfig {
  center: [number, number];
  zoom: number;
  maxZoom: number;
  minZoom?: number;
  tileUrl: string;
  fallbackTileUrl?: string; // URL de fallback caso a principal falhe
  labelUrl?: string; // Nova propriedade para a camada de nomes
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
    zoom: 3,
    minZoom: 1,
    maxZoom: 12,
    // Usar o mosaic WAC global (formato {z}/{y}/{x} compatível com Leaflet)
    tileUrl:
      "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    fallbackTileUrl:
      "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_ClrShade_19S070E_150cmp/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    labelUrl:
      "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Nomenclature/1.0.0/default/default028mm/{z}/{y}/{x}.png",
    attribution: "© NASA/GSFC/ASU - Lunar Reconnaissance Orbiter",
    noWrap: true,
    bounds: [
      [-90, -180],
      [90, 180],
    ],
  },
  mars: {
    center: [0, 0],
    zoom: 3,
    minZoom: 1,
    maxZoom: 12,
    // Mapa base global colorido (MOLA)
    tileUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    // Fallback: mosaic Viking (caso o MOLA falhe)
    fallbackTileUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    // Camada de nomes oficiais (rótulos)
    labelUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_Nomenclature/1.0.0/default/default028mm/{z}/{y}/{x}.png",
    attribution:
      "© NASA/JPL/USGS - Mars Reconnaissance Orbiter (MOLA, Viking, HiRISE)",
    noWrap: true,
    bounds: [
      [-90, -180],
      [90, 180],
    ],
  },  
  earth: {
    center: [0, 0],
    zoom: 3,
    minZoom: 1,
    maxZoom: 13,
    tileUrl:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    fallbackTileUrl:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
    labelUrl:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Reference_Labels/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png",
    attribution: "© NASA Earth Observatory (VIIRS/SNPP)",
    noWrap: false,
    bounds: [
      [-85, -180],
      [85, 180],
    ],
  },
};

export function getPlanetConfig(
  planet: "moon" | "mars" | "earth"
): PlanetConfig {
  return planetConfigs[planet];
}
