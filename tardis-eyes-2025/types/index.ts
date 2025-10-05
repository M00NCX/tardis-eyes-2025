export interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
  planet: 'moon' | 'mars' | 'earth';
  is_historical?: boolean;
}

export interface TourPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
  planet: 'moon' | 'mars' | 'earth';
}

export type PlanetType = 'moon' | 'mars' | 'earth';

type InfoModalProps = {
  title: string;
  content: string;
  onClose: () => void;
};
