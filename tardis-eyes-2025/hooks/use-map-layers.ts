import L from "leaflet";
import { useEffect } from "react";
import { getPlanetConfig } from "@/lib/planet-config";

interface MapLayerProps {
  map: L.Map | null;
  currentPlanet: "moon" | "mars" | "earth";
  // callback to report last requested tile URL
  onTileRequest?: (url: string) => void;
}

export function useMapLayers({
  map,
  currentPlanet,
  onTileRequest,
}: MapLayerProps) {
  useEffect(() => {
    if (!map) return;

    const config = getPlanetConfig(currentPlanet);
    let mainLayer: L.TileLayer | null = null;
    let fallbackLayer: L.TileLayer | null = null;
    let labelLayer: L.TileLayer | null = null;

    // Criar panes para controlar a ordem (z-index) das camadas
    try {
      if (!map.getPane("baseTiles")) {
        map.createPane("baseTiles");
        (map.getPane("baseTiles") as HTMLElement).style.zIndex = "400";
      }
      if (!map.getPane("fallbackTiles")) {
        map.createPane("fallbackTiles");
        (map.getPane("fallbackTiles") as HTMLElement).style.zIndex = "350";
      }
      if (!map.getPane("labelTiles")) {
        map.createPane("labelTiles");
        (map.getPane("labelTiles") as HTMLElement).style.zIndex = "650";
        // permitir que labels capturem eventos de ponteiro caso precise
        (map.getPane("labelTiles") as HTMLElement).style.pointerEvents = "auto";
      }
    } catch (e) {
      // ignore
    }

    // Função para formatar a data para a API da Terra
    const getEarthTime = () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    };

    // Configuração da camada principal
    const mainTileUrl =
      currentPlanet === "earth"
        ? config.tileUrl.replace("{time}", getEarthTime())
        : config.tileUrl;

    const mainOptions: L.TileLayerOptions = {
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
      bounds: config.bounds ? L.latLngBounds(config.bounds) : undefined,
      noWrap: config.noWrap,
      attribution: config.attribution,
      className: "map-tiles-layer",
      crossOrigin: true,
      // aplicar opções específicas de camada quando fornecidas
      ...(config as any).layerOptions,
      pane: "baseTiles",
      // respeitar qualquer opção tms definida na configuração do planeta
      tms: (config as any).layerOptions?.tms,
    };

    console.debug(
      "[useMapLayers] planet:",
      currentPlanet,
      "mainTileUrl:",
      mainTileUrl
    );

    mainLayer = L.tileLayer(mainTileUrl, mainOptions).addTo(map);

    // Log de tiles carregados
    mainLayer.on("tileload", (evt: any) => {
      try {
        const src = evt?.tile?.currentSrc || evt?.tile?.src || evt?.src;
        console.debug("[useMapLayers] tileload:", src);
      } catch (e) {}
    });

    // Configuração da camada de fallback
    if (config.fallbackTileUrl) {
      const fallbackTileUrl =
        currentPlanet === "earth"
          ? config.fallbackTileUrl.replace("{time}", getEarthTime())
          : config.fallbackTileUrl;

      const fallbackOptions: L.TileLayerOptions = {
        maxZoom: config.maxZoom,
        minZoom: config.minZoom,
        bounds: config.bounds ? L.latLngBounds(config.bounds) : undefined,
        noWrap: config.noWrap,
        attribution: config.attribution,
        opacity: 0,
        crossOrigin: true,
        ...(config as any).layerOptions,
        pane: "fallbackTiles",
      };

      fallbackLayer = L.tileLayer(fallbackTileUrl, fallbackOptions).addTo(map);
    }

    // Configuração da camada de labels
    if (config.labelUrl) {
      const labelOptions: L.TileLayerOptions = {
        maxZoom: config.maxZoom,
        minZoom: config.minZoom,
        bounds: config.bounds ? L.latLngBounds(config.bounds) : undefined,
        noWrap: config.noWrap,
        attribution: config.attribution,
        opacity: 0,
        crossOrigin: true,
        ...(config as any).layerOptions,
        pane: "labelTiles",
      };

      labelLayer = L.tileLayer(config.labelUrl, labelOptions).addTo(map);
    }

    // Tratamento de erros na camada principal
    mainLayer.on("tileerror", (err) => {
      console.warn("[useMapLayers] tileerror on mainLayer:", err);
      if (fallbackLayer) {
        mainLayer?.setOpacity(0);
        fallbackLayer.setOpacity(1);
      }
    });

    // report requested tile URLs
    mainLayer.on("tileloadstart", (evt: any) => {
      try {
        const src = evt?.tile?.src || evt?.src;
        if (src && onTileRequest) onTileRequest(src);
      } catch (e) {}
    });
    fallbackLayer?.on("tileloadstart", (evt: any) => {
      try {
        const src = evt?.tile?.src || evt?.src;
        if (src && onTileRequest) onTileRequest(src);
      } catch (e) {}
    });

    // Garantir que o mapa recalcule o layout (útil quando o container mudou de tamanho)
    try {
      // forçar redraw/resize
      (map as any).invalidateSize?.();
    } catch (e) {
      // noop
    }

    return () => {
      mainLayer?.remove();
      fallbackLayer?.remove();
      labelLayer?.remove();
    };
  }, [map, currentPlanet]);
}
