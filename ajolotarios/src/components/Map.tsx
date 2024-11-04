// src/components/Map.tsx
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Ajolotary } from '@/types'

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

  useEffect(() => {
    const fetchGeocodes = async () => {
      const geocoded = await Promise.all(
        ajolotaries.map(async (ajolotary) => {
          try {
            const res = await fetch(`/api/geocode?address=${encodeURIComponent(ajolotary.location)}`)
            const data = await res.json()
            if (res.ok) {
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
    }

    fetchGeocodes()
  }, [ajolotaries])

  const defaultPosition: [number, number] = [19.4326, -99.1332] // Coordenadas de ejemplo (Ciudad de México)

  return (
    <MapContainer center={defaultPosition} zoom={5} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geocodedAjolotaries.map(ajolotary => (
        <Marker key={ajolotary.id} position={[ajolotary.lat, ajolotary.lon]}>
          <Popup>
            <strong>{ajolotary.name}</strong><br />
            {ajolotary.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map
