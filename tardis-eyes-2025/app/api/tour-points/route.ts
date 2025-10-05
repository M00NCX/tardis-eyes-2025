import { NextResponse } from "next/server"

// Mock data - substitua por conexão real com Neon quando adicionar a integração
const tourPoints = [
  {
    id: "1",
    lat: 20,
    lng: 30,
    title: "Olympus Mons",
    description: "Começamos nossa jornada no maior vulcão do Sistema Solar, com impressionantes 21km de altura.",
    order: 1,
  },
  {
    id: "2",
    lat: -40,
    lng: 60,
    title: "Valles Marineris",
    description: "Agora visitamos o maior sistema de cânions de Marte, que se estende por mais de 4.000 km.",
    order: 2,
  },
  {
    id: "3",
    lat: 0,
    lng: -90,
    title: "Gale Crater",
    description: "Local de pouso do rover Curiosity, onde encontramos evidências de água antiga.",
    order: 3,
  },
]

export async function GET() {
  // TODO: Quando adicionar Neon, substituir por:
  // const sql = neon(process.env.DATABASE_URL!)
  // const result = await sql`SELECT * FROM tour_points ORDER BY "order" ASC`

  return NextResponse.json(tourPoints)
}
