import { styled } from "@/components/theme-provider";

export const MapContainer = styled("div", {
  width: "90%",
  height: "85vh",
  margin: "2rem auto",
  borderRadius: "1rem",
  overflow: "hidden",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",

  ".leaflet-container": {
    width: "100%",
    height: "100%",
    background: "var(--map-background) !important",
  },

  ".leaflet-control-zoom": {
    border: "none !important",
    borderRadius: "0.5rem !important",
    overflow: "hidden",

    a: {
      background: "rgba(255, 255, 255, 0.9) !important",
      color: "#333 !important",
      transition: "all 0.2s ease",

      "&:hover": {
        background: "rgba(255, 255, 255, 1) !important",
        color: "#000 !important",
      },
    },
  },

  ".leaflet-popup-content-wrapper": {
    background: "var(--annotation-bg)",
    borderRadius: "0.5rem",
    boxShadow: "var(--annotation-shadow)",
  },

  ".leaflet-popup-content": {
    margin: "0.75rem 1rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  ".custom-marker img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  ".custom-rover-marker": {
    transition: "all 0.3s ease",
  },

  ".custom-flag-marker img, .custom-flag-fixed img": {
    width: "24px",
    height: "40px",
  },
});
