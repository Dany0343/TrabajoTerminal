// src/app/api/geocode/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { address } = Object.fromEntries(new URL(request.url).searchParams)

  if (!address || typeof address !== 'string') {
    return NextResponse.json({ error: 'Dirección requerida' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`)
    const data = await res.json()

    if (data.length === 0) {
      return NextResponse.json({ error: 'No se encontraron resultados' }, { status: 404 })
    }

    const { lat, lon } = data[0]

    return NextResponse.json({ lat: parseFloat(lat), lon: parseFloat(lon) }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al geocodificar la dirección' }, { status: 500 })
  }
}
