interface NasaApiConfig {
  endpoint: string;
  apiKey: string;
}

const NASA_API_KEY = "DEMO_KEY"; // Substitua por sua chave API da NASA (https://api.nasa.gov)

export const nasaApiConfig: Record<string, NasaApiConfig> = {
  moon: {
    endpoint: "https://trek.nasa.gov/tiles/Moon/EQ",
    apiKey: NASA_API_KEY,
  },
  mars: {
    endpoint: "https://trek.nasa.gov/tiles/Mars/EQ",
    apiKey: NASA_API_KEY,
  },
  earth: {
    endpoint: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best",
    apiKey: NASA_API_KEY,
  },
};

export const getTileUrl = (planet: "moon" | "mars" | "earth") => {
  const config = nasaApiConfig[planet];

  switch (planet) {
    case "moon":
      // LRO LOLA Digital Elevation Model (DEM) Color Hillshade
      return `${config.endpoint}/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/WMTSCapabilities.xml/default/default028mm/{z}/{y}/{x}.jpg`;

    case "mars":
      // Mars Reconnaissance Orbiter CTX Mosaic
      return `${config.endpoint}/CTX_Mosaic_Global_Coverage/1.0.0/default/default028mm/{z}/{y}/{x}.png`;

    case "earth":
      // NASA GIBS - Terra/MODIS imagery
      const today = new Date().toISOString().split("T")[0];
      return `${config.endpoint}/MODIS_Terra_CorrectedReflectance_TrueColor/default/${today}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    default:
      throw new Error(`Planeta não suportado: ${planet}`);
  }
};
