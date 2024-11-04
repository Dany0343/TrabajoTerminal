// src/components/MeasurementHistory.tsx
import React from 'react'
import { Measurement } from '@/types'

interface MeasurementHistoryProps {
  measurements: Measurement[]
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ measurements }) => {
  // Ordenar las mediciones por fecha descendente
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  )

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Fecha y Hora</th>
            <th className="py-2 px-4 border-b">Valor</th>
            <th className="py-2 px-4 border-b">Parámetro</th>
          </tr>
        </thead>
        <tbody>
          {sortedMeasurements.map(measurement => {
            console.log(`La medida es: ${measurement}`);
            return (
              <tr key={measurement.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-2 px-4 border-b">{new Date(measurement.dateTime).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{measurement.value}</td>
                <td className="py-2 px-4 border-b">{measurement.parameterName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default MeasurementHistory
