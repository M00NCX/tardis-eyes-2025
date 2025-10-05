import { NextResponse } from "next/server"

// Mock data - substitua por conexão real com Neon quando adicionar a integração
const annotations: Array<{
  id: string
  lat: number
  lng: number
  title: string
  description: string
  author: string
  created_at: string
}> = [
  {
    id: "1",
    lat: 20,
    lng: 30,
    title: "Olympus Mons",
    description: "O maior vulcão do Sistema Solar! Com 21km de altura.",
    author: "NASA Explorer",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    lat: -40,
    lng: 60,
    title: "Valles Marineris",
    description: "Um sistema de cânions que se estende por mais de 4.000 km.",
    author: "Mars Fan",
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  // TODO: Quando adicionar Neon, substituir por:
  // const sql = neon(process.env.DATABASE_URL!)
  // const result = await sql`SELECT * FROM annotations ORDER BY created_at DESC`

  return NextResponse.json(annotations)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { lat, lng, title, description, author } = body

    const newAnnotation = {
      id: Date.now().toString(),
      lat,
      lng,
      title,
      description,
      author,
      created_at: new Date().toISOString(),
    }

    annotations.push(newAnnotation)

    // TODO: Quando adicionar Neon, substituir por:
    // const sql = neon(process.env.DATABASE_URL!)
    // const result = await sql`
    //   INSERT INTO annotations (lat, lng, title, description, author)
    //   VALUES (${lat}, ${lng}, ${title}, ${description}, ${author})
    //   RETURNING *
    // `

    return NextResponse.json(newAnnotation)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create annotation" }, { status: 500 })
  }
}
