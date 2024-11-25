// src/components/Map.tsx
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Ajolotary } from '@/types/types'

// Solución para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface GeocodedAjolotary extends Ajolotary {
  lat: number
  lon: number
}

interface MapProps {
  ajolotaries: Ajolotary[]
}

const Map: React.FC<MapProps> = ({ ajolotaries }) => {
  const [geocodedAjolotaries, setGeocodedAjolotaries] = useState<GeocodedAjolotary[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGeocodes = async () => {
      try {
        const geocoded = await Promise.all(
          ajolotaries.map(async (ajolotary) => {
            try {
              const res = await fetch(`/api/geocode?address=${encodeURIComponent(ajolotary.location)}`)
              const data = await res.json()
              if (res.ok && data.lat && data.lon) {
                return { ...ajolotary, lat: data.lat, lon: data.lon }
              } else {
                console.error(`Geocoding error for ${ajolotary.name}:`, data.error)
                return null
              }
            } catch (error) {
              console.error(`Error fetching geocode for ${ajolotary.name}:`, error)
              return null
            }
          })
        )
        setGeocodedAjolotaries(geocoded.filter(Boolean) as GeocodedAjolotary[])
      } catch (err: any) {
        console.error('Error fetching geocodes:', err)
        setError('Error al obtener las coordenadas de las ubicaciones.')
      } finally {
        setLoading(false)
      }
    }

    if (ajolotaries.length > 0) {
      fetchGeocodes()
    } else {
      setLoading(false)
    }
  }, [ajolotaries])

  const defaultPosition: [number, number] = [19.4326, -99.1332] // Coordenadas de ejemplo (Ciudad de México)

  if (loading) {
    return <div className="flex items-center justify-center h-full">Cargando mapa...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <MapContainer center={defaultPosition} zoom={5} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geocodedAjolotaries.length > 0 ? (
        geocodedAjolotaries.map((ajolotary) => (
          ajolotary.lat && ajolotary.lon && (
            <Marker key={ajolotary.id} position={[ajolotary.lat, ajolotary.lon]}>
              <Popup>
                <strong>{ajolotary.name}</strong><br />
                {ajolotary.location}
              </Popup>
            </Marker>
          )
        ))
      ) : (
        <div className="text-center text-muted">No hay ajolotarios para mostrar en el mapa.</div>
      )}
    </MapContainer>
  )
}

export default Map
