import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// 1. ESQUEMA DE VALIDAÇÃO COM ZOD
// Define um "contrato" para os dados que esperamos receber.
// Isso garante que os dados estão no formato correto antes de tentarmos salvar no banco.
const annotationSchema = z.object({
  lat: z.number({ invalid_type_error: 'Latitude inválida.' }),
  lng: z.number({ invalid_type_error: 'Longitude inválida.' }),
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' })
    .max(100, { message: 'O título não pode ter mais de 100 caracteres.' }),
  description: z
    .string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  author: z
    .string()
    .min(2, { message: 'O nome do autor deve ter pelo menos 2 caracteres.' })
    .max(50, {
      message: 'O nome do autor não pode ter mais de 50 caracteres.',
    }),
  planet: z.string().min(1, { message: 'O planeta é obrigatório.' }),
});

export async function GET(req: NextRequest) {
  try {
    // 1. Pega os parâmetros da URL da requisição (ex: ?planet=mars)
    const { searchParams } = req.nextUrl;
    const planet = searchParams.get('planet');

    // 2. Validação: se o parâmetro 'planet' não for enviado, retorna um erro.
    if (!planet) {
      return NextResponse.json(
        { error: "O parâmetro 'planet' é obrigatório." },
        { status: 400 } // 400 Bad Request
      );
    }

    // 3. Busca no banco de dados usando o Prisma
    // Encontra todas as anotações (`findMany`) onde (`where`) o campo `planet`
    // seja igual ao valor que recebemos na URL.
    const annotations = await prisma.annotation.findMany({
      where: {
        planet: planet,
      },
    });

    // 4. Retorna os dados encontrados como JSON
    return NextResponse.json(annotations);
  } catch (error) {
    console.error('GET /api/annotations error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar as anotações.' },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 2. VALIDANDO O CORPO DA REQUISIÇÃO
    // Usamos `safeParse` para validar o `body` contra o nosso esquema.
    // Se a validação falhar, `success` será `false` e `error` conterá os detalhes.
    const validation = annotationSchema.safeParse(body);

    if (!validation.success) {
      // O `zod` nos dá um objeto de erro bem formatado.
      // Podemos enviá-lo diretamente para o frontend.
      return NextResponse.json(
        {
          error: 'Dados inválidos.',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 422 } // 422 Unprocessable Entity é o status ideal para erros de validação
      );
    }

    // Se a validação passou, podemos usar `validation.data` com segurança,
    // pois sabemos que todos os campos existem e têm o tipo correto.
    const { lat, lng, title, description, author, planet } = validation.data;

    const annotation = await prisma.annotation.create({
      data: {
        lat,
        lng,
        title,
        description,
        author,
        planet,
        is_historical: false, // Definido no backend por segurança
      },
    });

    return NextResponse.json(annotation, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('POST /api/annotations error:', error);

    // Tratamento de erro genérico para o caso do banco de dados falhar, etc.
    return NextResponse.json(
      {
        error:
          'Não foi possível salvar a anotação. Tente novamente mais tarde.',
      },
      { status: 500 }
    );
  }
}
