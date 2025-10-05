import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    // Decodifica o URL antes de fazer o fetch
    const tileUrl = decodeURIComponent(url);

    const res = await fetch(tileUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch tile" }, { status: res.status });
    }

    const contentType = res.headers.get("Content-Type") || "image/jpeg";
    const data = await res.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600", // cache de 1 hora
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 500 });
  }
}
