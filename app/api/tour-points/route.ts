import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
interface TourPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
  planet: 'moon' | 'mars' | 'earth';
}

// Usamos os mesmos dados dos marcos históricos para o tour
const allTourPoints: TourPoint[] = [
  // Pontos de Tour da Lua (Missões Apollo)
  {
    id: 't1_moon',
    lat: 0.67408,
    lng: 23.47297,
    title: 'Apollo 11',
    description: 'O local histórico do primeiro pouso lunar tripulado.',
    order: 1,
    planet: 'moon',
  },
  {
    id: 't2_moon',
    lat: -3.01239,
    lng: -23.42157,
    title: 'Apollo 12',
    description: 'Pouso de precisão perto da sonda Surveyor 3.',
    order: 2,
    planet: 'moon',
  },
  {
    id: 't3_moon',
    lat: 20.1908,
    lng: 30.7723,
    title: 'Apollo 17',
    description: 'A última missão tripulada à Lua, com um geólogo a bordo.',
    order: 3,
    planet: 'moon',
  },
  {
    id: 't4_moon',
    lat: -43.31,
    lng: -11.36,
    title: 'Cratera Tycho',
    description:
      'Uma das crateras mais jovens e visíveis da Lua. Seus raios de material ejetado se estendem por mais de 1.500 km pela superfície lunar.',
    order: 1,
    planet: 'moon',
  },
  {
    id: 't5_moon',
    lat: 26.13,
    lng: 3.63,
    title: 'Mons Hadley',
    description:
      'Uma montanha imponente próxima ao local de pouso da Apollo 15. Foi aqui que os astronautas usaram o Rover Lunar pela primeira vez.',
    order: 2,
    planet: 'moon',
  },
  {
    id: 't6_moon',
    lat: -45.45,
    lng: 177.6,
    title: "Pouso da Chang'e 4",
    description:
      'Local histórico na cratera Von Kármán onde a China realizou o primeiro pouso bem-sucedido no lado oculto da Lua.',
    order: 3,
    planet: 'moon',
  },
  {
    id: 't7_moon',
    lat: 7.5,
    lng: -59.0,
    title: 'Reiner Gamma',
    description:
      "Uma misteriosa 'mancha' brilhante na superfície lunar. Não é uma cratera nem montanha, mas uma anomalia magnética que intriga os cientistas.",
    order: 4,
    planet: 'moon',
  },
  // Pontos de Tour de Marte (Rovers)
  {
    id: 't1_mars',
    lat: 19.33,
    lng: 335.79,
    title: 'Viking 1',
    description:
      'A primeira sonda a operar com sucesso na superfície marciana.',
    order: 1,
    planet: 'mars',
  },
  {
    id: 't2_mars',
    lat: -4.5895,
    lng: 137.4417,
    title: 'Curiosity',
    description: 'Explorando a Cratera Gale em busca de ambientes habitáveis.',
    order: 2,
    planet: 'mars',
  },
  {
    id: 't3_mars',
    lat: 18.444,
    lng: 77.451,
    title: 'Perseverance',
    description:
      'Coletando amostras na Cratera Jezero para futuro retorno à Terra.',
    order: 3,
    planet: 'mars',
  },
  {
    id: 't4_mars',
    lat: 18.65,
    lng: -133.8, // Marte usa longitude Leste (0-360), mas Leaflet prefere -180 a 180. Convertido de 226.2 E.
    title: 'Olympus Mons (Monte Olimpo)',
    description:
      'O maior vulcão do Sistema Solar. Com quase 22 km de altura, é quase três vezes mais alto que o Monte Everest.',
    order: 1,
    planet: 'mars',
  },
  {
    id: 't5_mars',
    lat: -13.9,
    lng: -59.2, // Convertido de 300.8 E.
    title: 'Valles Marineris',
    description:
      'Um sistema de cânions gigantesco que se estende por 4.000 km, o equivalente à distância de Lisboa a Moscou. Faz o Grand Canyon parecer pequeno.',
    order: 2,
    planet: 'mars',
  },
  {
    id: 't6_mars',
    lat: -42.7,
    lng: 70.0,
    title: 'Hellas Planitia',
    description:
      'Uma vasta planície circular formada por um impacto de asteroide. É uma das maiores crateras de impacto conhecidas, com 2.300 km de diâmetro.',
    order: 3,
    planet: 'mars',
  },
  {
    id: 't7_mars',
    lat: 40.75,
    lng: -9.46, // Convertido de 350.54 E.
    title: "A 'Face de Marte' (Cydonia)",
    description:
      'Uma formação rochosa que, em imagens de baixa resolução da Viking 1, parecia um rosto humano. Imagens modernas mostram ser apenas um morro erodido.',
    order: 4,
    planet: 'mars',
  },
  // Pontos de Tour da Terra (Marcos Geográficos)
  {
    id: 't1_earth',
    lat: 28.5728,
    lng: -80.649,
    title: 'Kennedy Space Center',
    description: 'Centro histórico de lançamentos espaciais da NASA',
    order: 1,
    planet: 'earth',
  },
  {
    id: 't2_earth',
    lat: 27.9881,
    lng: 86.925,
    title: 'Monte Everest',
    description: 'O ponto mais alto da Terra, um desafio monumental.',
    order: 2,
    planet: 'earth',
  },
  {
    id: 't3_earth',
    lat: -22.9519,
    lng: -43.2105,
    title: 'Cristo Redentor',
    description:
      'Um ícone do Brasil, com uma vista deslumbrante do Rio de Janeiro.',
    order: 3,
    planet: 'earth',
  },
  {
    id: 't4_earth',
    lat: 48.8584,
    lng: 2.2945,
    title: 'Torre Eiffel',
    description:
      'O símbolo de Paris e uma maravilha da engenharia do século XIX.',
    order: 4,
    planet: 'earth',
  },
  {
    id: 't5_earth',
    lat: 36.05,
    lng: -112.14,
    title: 'Grand Canyon',
    description:
      'Uma maravilha geológica esculpida pelo Rio Colorado nos Estados Unidos, revelando milhões de anos da história da Terra em suas camadas de rocha.',
    order: 1,
    planet: 'earth',
  },
  {
    id: 't6_earth',
    lat: -16.92,
    lng: 145.77,
    title: 'Grande Barreira de Coral',
    description:
      'A maior estrutura do mundo feita por organismos vivos, visível do espaço. Um ecossistema vibrante e complexo na costa da Austrália.',
    order: 2,
    planet: 'earth',
  },
  {
    id: 't7_earth',
    lat: -3.11,
    lng: -60.02,
    title: 'Floresta Amazônica - Manaus',
    description:
      'O coração da maior floresta tropical do mundo. Representa a incrível biodiversidade e a importância vital da Amazônia para o clima global.',
    order: 3,
    planet: 'earth',
  },
  {
    id: 't8_earth',
    lat: -17.92,
    lng: 25.85,
    title: 'Cataratas Vitória',
    description:
      "Conhecidas localmente como 'A Fumaça que Troveja', formam a maior cortina de água do mundo na fronteira entre Zâmbia e Zimbábue.",
    order: 4,
    planet: 'earth',
  },
];

export async function GET(request: NextRequest) {
  // Usando a forma recomendada para pegar os parâmetros
  const { searchParams } = request.nextUrl;
  const planet = searchParams.get('planet');

  if (planet) {
    const filteredPoints = allTourPoints.filter(
      (point) => point.planet === planet
    );
    return NextResponse.json(filteredPoints);
  }

  return NextResponse.json(
    { error: "O parâmetro 'planet' é obrigatório." },
    { status: 400 }
  );
}
