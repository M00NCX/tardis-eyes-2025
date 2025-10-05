declare module "leaflet" {
  export interface LatLng {
    lat: number;
    lng: number;
  }
}

import { Annotation as BaseAnnotation } from "./types";

declare global {
  type Annotation = BaseAnnotation;
}
