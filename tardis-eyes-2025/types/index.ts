export interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  created_at?: string;
  is_historical?: boolean;
}

export interface TourPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
}

export type PlanetType = "moon" | "mars" | "earth";
