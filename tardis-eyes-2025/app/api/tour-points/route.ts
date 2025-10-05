import { NextRequest, NextResponse } from "next/server";

interface TourPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
  planet: "moon" | "mars" | "earth";
}

// Usamos os mesmos dados dos marcos históricos para o tour
const allTourPoints: TourPoint[] = [
  // Pontos de Tour da Lua (Missões Apollo)
  {
    id: "t1_moon",
    lat: 0.67408,
    lng: 23.47297,
    title: "Apollo 11",
    description: "O local histórico do primeiro pouso lunar tripulado.",
    order: 1,
    planet: "moon",
  },
  // Pontos de Tour de Marte
  {
    id: "t1_mars",
    lat: -1.9462,
    lng: 354.4734,
    title: "Perseverance",
    description:
      "Cratera Jezero - Local de busca por sinais de vida antiga em Marte",
    order: 1,
    planet: "mars",
  },
  {
    id: "t2_mars",
    lat: -4.5895,
    lng: 137.4417,
    title: "Curiosity",
    description: "Monte Sharp - Análise da história geológica de Marte",
    order: 2,
    planet: "mars",
  },
  // Pontos de Tour da Terra
  {
    id: "t1_earth",
    lat: 28.5728,
    lng: -80.649,
    title: "Kennedy Space Center",
    description: "Centro histórico de lançamentos espaciais da NASA",
    order: 1,
    planet: "earth",
  },
  {
    id: "t2_moon",
    lat: -3.01239,
    lng: -23.42157,
    title: "Apollo 12",
    description: "Pouso de precisão perto da sonda Surveyor 3.",
    order: 2,
    planet: "moon",
  },
  {
    id: "t3_moon",
    lat: 20.1908,
    lng: 30.7723,
    title: "Apollo 17",
    description: "A última missão tripulada à Lua, com um geólogo a bordo.",
    order: 3,
    planet: "moon",
  },

  // Pontos de Tour de Marte (Rovers)
  {
    id: "t1_mars",
    lat: 19.33,
    lng: 335.79,
    title: "Viking 1",
    description:
      "A primeira sonda a operar com sucesso na superfície marciana.",
    order: 1,
    planet: "mars",
  },
  {
    id: "t2_mars",
    lat: -4.5895,
    lng: 137.4417,
    title: "Curiosity",
    description: "Explorando a Cratera Gale em busca de ambientes habitáveis.",
    order: 2,
    planet: "mars",
  },
  {
    id: "t3_mars",
    lat: 18.444,
    lng: 77.451,
    title: "Perseverance",
    description:
      "Coletando amostras na Cratera Jezero para futuro retorno à Terra.",
    order: 3,
    planet: "mars",
  },

  // Pontos de Tour da Terra (Marcos Geográficos)
  {
    id: "t1_earth",
    lat: 27.9881,
    lng: 86.925,
    title: "Monte Everest",
    description: "O ponto mais alto da Terra, um desafio monumental.",
    order: 1,
    planet: "earth",
  },
  {
    id: "t2_earth",
    lat: -22.9519,
    lng: -43.2105,
    title: "Cristo Redentor",
    description:
      "Um ícone do Brasil, com uma vista deslumbrante do Rio de Janeiro.",
    order: 2,
    planet: "earth",
  },
  {
    id: "t3_earth",
    lat: 48.8584,
    lng: 2.2945,
    title: "Torre Eiffel",
    description:
      "O símbolo de Paris e uma maravilha da engenharia do século XIX.",
    order: 3,
    planet: "earth",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planet = searchParams.get("planet") as "moon" | "mars" | "earth" | null;

  if (planet) {
    const filteredPoints = allTourPoints.filter(
      (point) => point.planet === planet
    );
    return NextResponse.json(filteredPoints);
  }

  // Retorna todos se nenhum planeta for especificado
  return NextResponse.json(allTourPoints);
}
