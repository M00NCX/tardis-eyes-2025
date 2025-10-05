import { NextRequest, NextResponse } from 'next/server';

interface EasterEgg {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
  is_easteregg?: boolean;
  planet: 'moon' | 'mars' | 'earth';
}

/* -------------------------------------------------------
 * 🛰️ Easter Eggs da LUA
 * ----------------------------------------------------- */
const moonEasterEggs: EasterEgg[] = [
  {
    id: 'e1_moon',
    lat: -33.0,
    lng: 163.0,
    title: 'Mare Ingenii – O "Mar do Gênio"',
    description:
      'Uma das poucas regiões do lado oculto coberta por mares de lava. Possui redemoinhos magnéticos brilhantes visíveis do espaço.',
    order: 1,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e2_moon',
    lat: 7.5,
    lng: -59.0,
    title: 'Reiner Gamma – O redemoinho magnético',
    description:
      'Região com brilho incomum causado por campos magnéticos locais que desviam o vento solar. Nenhuma elevação — apenas um padrão óptico misterioso.',
    order: 2,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e3_moon',
    lat: -89.9,
    lng: 0.0,
    title: 'Pólo Sul Lunar – Sombras eternas',
    description:
      'Algumas crateras, como Shackleton, nunca recebem luz solar direta. Elas contêm gelo de água preservado por bilhões de anos.',
    order: 3,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e4_moon',
    lat: 36.0,
    lng: 102.0,
    title: 'Cratera Giordano Bruno',
    description:
      'Uma das crateras mais jovens e brilhantes da Lua, possivelmente formada há apenas 800 anos — em escala geológica, “ontem”.',
    order: 4,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e5_moon',
    lat: 27.0,
    lng: 148.0,
    title: 'Mare Moscoviense',
    description:
      'A única grande planície de lava no lado oculto da Lua. Descoberta pela sonda soviética Luna 3 em 1959.',
    order: 5,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e6_moon',
    lat: 1.4,
    lng: 23.2,
    title: 'A pegada esquecida da Surveyor 5',
    description:
      'Antes das Apollo, as sondas Surveyor testaram pousos suaves. A Surveyor 5 deixou a primeira pegada mecânica em solo lunar em 1967 — ainda lá.',
    order: 6,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e7_moon',
    lat: 47.0,
    lng: -34.0,
    title: 'Montes Jura – O arco de um antigo impacto',
    description:
      'Montanhas curvas que cercam o Mare Imbrium, restos de uma cratera colossal destruída por lava — um exemplo de geologia lunar antiga.',
    order: 7,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e8_moon',
    lat: 0.0,
    lng: 180.0,
    title: 'O misterioso som da Apollo 10',
    description:
      'Durante uma órbita do lado oculto em 1969, os astronautas relataram “música espacial” — sons de rádio que hoje sabemos ser interferência entre canais da nave.',
    order: 8,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e9_moon',
    lat: 23.7,
    lng: -47.4,
    title: 'Cratera Aristarchus – O farol lunar',
    description:
      'Uma das regiões mais brilhantes da Lua, onde já foram observados “fenômenos lunares transitórios” — luzes e brilhos inexplicáveis.',
    order: 9,
    planet: 'moon',
    is_easteregg: true,
  },
  {
    id: 'e10_moon',
    lat: -8.97,
    lng: 15.51,
    title: 'A assinatura esquecida da Apollo 16',
    description:
      'Os astronautas deixaram um pequeno disco com assinaturas e mensagens de líderes mundiais, ainda repousando silenciosamente no Descartes Highlands.',
    order: 10,
    planet: 'moon',
    is_easteregg: true,
  },
];

/* -------------------------------------------------------
 * 🔴 Easter Eggs de MARTE
 * ----------------------------------------------------- */
const marsEasterEggs: EasterEgg[] = [
  {
    id: 'e1_mars',
    lat: -14.6,
    lng: -59.3, // Valles Marineris
    title: 'Valles Marineris – O Grand Canyon de Marte',
    description:
      'Um sistema de cânions tão vasto que se estende por 4.000 km — já foi cogitado que poderia abrigar colônias subterrâneas futuras.',
    order: 1,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e2_mars',
    lat: 18.65,
    lng: -133.8, // Olympus Mons
    title: 'Olympus Mons – O gigante adormecido',
    description:
      'O maior vulcão do Sistema Solar. Alguns cientistas acreditam que ainda pode estar ativo, apenas em repouso há milhões de anos.',
    order: 2,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e3_mars',
    lat: 40.75,
    lng: -9.46,
    title: "A 'Face de Marte' (Cydonia)",
    description:
      'Em 1976, imagens da Viking 1 mostraram o que parecia ser um rosto humano. Hoje sabemos que é apenas uma colina iluminada pelo ângulo certo do Sol.',
    order: 3,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e4_mars',
    lat: -42.7,
    lng: 70.0,
    title: 'Hellas Planitia – A cicatriz colossal',
    description:
      'Uma cratera tão profunda que o ar ali é significativamente mais denso — se um astronauta removesse o capacete, teria alguns segundos extras de oxigênio.',
    order: 4,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e5_mars',
    lat: 19.33,
    lng: 335.79,
    title: 'Viking 1 – O silêncio eterno',
    description:
      'A primeira sonda a pousar com sucesso em Marte ainda está lá, intocada desde 1982. Uma cápsula do tempo marciana.',
    order: 5,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e6_mars',
    lat: -4.5895,
    lng: 137.4417,
    title: 'Curiosity – A selfie no deserto vermelho',
    description:
      'Em 2018, o rover tirou uma selfie panorâmica de 360° usando seu braço robótico — uma das imagens mais icônicas da exploração espacial moderna.',
    order: 6,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e7_mars',
    lat: 18.444,
    lng: 77.451,
    title: 'Perseverance – A cápsula escondida',
    description:
      'Durante o pouso, o escudo térmico e o paraquedas foram descartados e ainda estão visíveis nas imagens do helicóptero Ingenuity.',
    order: 7,
    planet: 'mars',
    is_easteregg: true,
  },
  {
    id: 'e8_mars',
    lat: -3.0,
    lng: -19.0, // Spirit rover
    title: 'Spirit – Preso para sempre',
    description:
      'O rover Spirit ficou atolado na areia em 2010, mas ainda envia reflexos metálicos detectáveis por satélite até hoje.',
    order: 8,
    planet: 'mars',
    is_easteregg: true,
  },
];

/* -------------------------------------------------------
 * 🌍 Easter Eggs da TERRA
 * ----------------------------------------------------- */
const earthEasterEggs: EasterEgg[] = [
  {
    id: 'e1_earth',
    lat: 28.5728,
    lng: -80.649,
    title: 'Kennedy Space Center – A pedra do silêncio',
    description:
      'Há uma pedra no complexo com inscrições de todos os astronautas que partiram daqui, mas há um espaço vazio reservado para futuras missões humanas a Marte.',
    order: 1,
    planet: 'earth',
    is_easteregg: true,
  },
  {
    id: 'e2_earth',
    lat: -22.9519,
    lng: -43.2105,
    title: 'Cristo Redentor – O relâmpago constante',
    description:
      'O monumento é atingido por raios dezenas de vezes por ano, sendo um dos pontos mais eletricamente ativos do Brasil.',
    order: 2,
    planet: 'earth',
    is_easteregg: true,
  },
  {
    id: 'e3_earth',
    lat: 48.8584,
    lng: 2.2945,
    title: 'Torre Eiffel – O laboratório oculto',
    description:
      'No topo da torre, há um pequeno laboratório de meteorologia e medições de radiação instalado por Gustave Eiffel e ainda preservado.',
    order: 3,
    planet: 'earth',
    is_easteregg: true,
  },
  {
    id: 'e4_earth',
    lat: -3.11,
    lng: -60.02,
    title: 'Floresta Amazônica – A torre do clima',
    description:
      'Perto de Manaus existe uma torre de 325 metros de altura que coleta dados da atmosfera — é o “observatório do clima” da Amazônia.',
    order: 4,
    planet: 'earth',
    is_easteregg: true,
  },
  {
    id: 'e5_earth',
    lat: 36.05,
    lng: -112.14,
    title: 'Grand Canyon – Ecos fossilizados',
    description:
      'Alguns pontos do cânion reverberam sons de forma tão peculiar que pesquisadores chamam de “ecos fósseis” — reflexos acústicos preservados por milênios.',
    order: 5,
    planet: 'earth',
    is_easteregg: true,
  },
  {
    id: 'e6_earth',
    lat: -16.92,
    lng: 145.77,
    title: 'Grande Barreira de Coral – A “voz do recife”',
    description:
      'Microfones submarinos registram sons do recife — um coral saudável “canta” com o som da vida marinha, enquanto recifes mortos permanecem em silêncio.',
    order: 6,
    planet: 'earth',
    is_easteregg: true,
  },
  {
    id: 'e7_earth',
    lat: -17.92,
    lng: 25.85,
    title: 'Cataratas Vitória – A fumaça que troveja',
    description:
      'Durante o amanhecer, o vapor das quedas cria arcos-íris circulares completos — visíveis apenas de cima.',
    order: 7,
    planet: 'earth',
    is_easteregg: true,
  },
];

/* -------------------------------------------------------
 * 🌌 Todos os Easter Eggs
 * ----------------------------------------------------- */
const allEasterEggs = [...moonEasterEggs, ...marsEasterEggs, ...earthEasterEggs];

/* -------------------------------------------------------
 * 🌍 API Handler
 * ----------------------------------------------------- */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planet = searchParams.get('planet') as 'moon' | 'mars' | 'earth' | null;

  if (planet) {
    const filtered = allEasterEggs.filter((egg) => egg.planet === planet);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(allEasterEggs);
}
