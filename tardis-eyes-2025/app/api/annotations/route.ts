import { NextRequest, NextResponse } from "next/server";

interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
  planet: "moon" | "mars" | "earth";
  is_historical?: boolean;
}

// Base de dados simulada
let annotations: Annotation[] = [
  // Marcos Históricos da Lua
  {
    id: "t1_moon",
    lat: 0.67408,
    lng: 23.47297,
    title: "Pouso da Apollo 11",
    description:
      "Local do primeiro pouso lunar tripulado em 20 de julho de 1969. 'Um pequeno passo para o homem, um salto gigante para a humanidade.'",
    author: "NASA",
    created_at: new Date("1969-07-20").toISOString(),
    planet: "moon",
    is_historical: true,
  },
  // Marcos Históricos de Marte
  {
    id: "t1_mars",
    lat: -1.9462,
    lng: 354.4734,
    title: "Pouso do Perseverance",
    description:
      "Local de pouso do rover Perseverance em Marte, na cratera Jezero.",
    author: "NASA",
    created_at: new Date("2021-02-18").toISOString(),
    planet: "mars",
    is_historical: true,
  },
  {
    id: "t2_mars",
    lat: -4.5895,
    lng: 137.4417,
    title: "Cratera Gale - Curiosity",
    description:
      "Local onde o rover Curiosity estuda a geologia e o clima de Marte desde 2012.",
    author: "NASA",
    created_at: new Date("2012-08-06").toISOString(),
    planet: "mars",
    is_historical: true,
  },
  // Marcos Históricos da Terra
  {
    id: "t1_earth",
    lat: 28.5728,
    lng: -80.649,
    title: "Centro Espacial Kennedy",
    description: "Principal centro de lançamentos espaciais da NASA.",
    author: "NASA",
    created_at: new Date("1962-07-01").toISOString(),
    planet: "earth",
    is_historical: true,
  },
  {
    id: "t2_moon",
    lat: -3.01239,
    lng: -23.42157,
    title: "Pouso da Apollo 12",
    description:
      "Nesta missão, os astronautas pousaram perto da sonda Surveyor 3, que havia chegado à Lua dois anos antes.",
    author: "NASA",
    created_at: new Date("1969-11-19").toISOString(),
    planet: "moon",
    is_historical: true,
  },
  {
    id: "t3_moon",
    lat: 20.1908,
    lng: 30.7723,
    title: "Pouso da Apollo 17",
    description:
      "A última missão do programa Apollo, que levou o geólogo Harrison Schmitt à Lua.",
    author: "NASA",
    created_at: new Date("1972-12-11").toISOString(),
    planet: "moon",
    is_historical: true,
  },

  // Marcos Históricos de Marte
  {
    id: "t1_mars",
    lat: 19.33,
    lng: 335.79,
    title: "Pouso da Viking 1",
    description:
      "Primeira sonda americana a pousar com sucesso em Marte e realizar sua missão.",
    author: "NASA",
    created_at: new Date("1976-07-20").toISOString(),
    planet: "mars",
    is_historical: true,
  },
  {
    id: "t2_mars",
    lat: -4.5895,
    lng: 137.4417,
    title: "Cratera Gale (Curiosity)",
    description:
      "Local de pouso do rover Curiosity, que explora a geologia e o clima do planeta.",
    author: "NASA",
    created_at: new Date("2012-08-06").toISOString(),
    planet: "mars",
    is_historical: true,
  },
  {
    id: "t3_mars",
    lat: 18.444,
    lng: 77.451,
    title: "Cratera Jezero (Perseverance)",
    description:
      "Local de pouso do rover Perseverance, buscando sinais de vida microbiana antiga.",
    author: "NASA",
    created_at: new Date("2021-02-18").toISOString(),
    planet: "mars",
    is_historical: true,
  },

  // Marcos Históricos da Terra
  {
    id: "t1_earth",
    lat: 27.9881,
    lng: 86.925,
    title: "Monte Everest",
    description:
      "O pico mais alto da Terra, atingindo 8.848 metros acima do nível do mar.",
    author: "Geografia",
    created_at: new Date().toISOString(),
    planet: "earth",
    is_historical: true,
  },
  {
    id: "t2_earth",
    lat: -22.9519,
    lng: -43.2105,
    title: "Cristo Redentor",
    description:
      "Monumento icônico no Rio de Janeiro, Brasil, uma das Novas Sete Maravilhas do Mundo.",
    author: "Cultura",
    created_at: new Date().toISOString(),
    planet: "earth",
    is_historical: true,
  },
  {
    id: "t3_earth",
    lat: 48.8584,
    lng: 2.2945,
    title: "Torre Eiffel",
    description:
      "Um marco de treliça de ferro forjado em Paris, França, e um ícone cultural global.",
    author: "História",
    created_at: new Date().toISOString(),
    planet: "earth",
    is_historical: true,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planet = searchParams.get("planet") as "moon" | "mars" | "earth" | null;

  if (planet) {
    const filteredAnnotations = annotations.filter(
      (ann) => ann.planet === planet
    );
    return NextResponse.json(filteredAnnotations);
  }

  // Se nenhum planeta for especificado, retorna todas (ou pode retornar um erro)
  return NextResponse.json(annotations);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, title, description, author, planet } = body;

    if (!lat || !lng || !title || !description || !author || !planet) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const newAnnotation: Annotation = {
      id: `user-${Date.now()}`,
      lat,
      lng,
      title,
      description,
      author,
      created_at: new Date().toISOString(),
      planet,
      is_historical: false,
    };

    annotations.push(newAnnotation);
    return NextResponse.json(newAnnotation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao criar anotação" },
      { status: 500 }
    );
  }
}
