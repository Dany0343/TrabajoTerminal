// src/components/ParameterTrendsChart.tsx
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

interface Measurement {
  dateTime: string
  value: number
  parameterName: string
}

interface ParameterTrendsChartProps {
  parameterName: string
  measurements: Measurement[]
}

const ParameterTrendsChart: React.FC<ParameterTrendsChartProps> = ({ parameterName, measurements }) => {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (measurements && measurements.length > 0) {
      const sortedMeasurements = measurements.sort(
        (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      )

      setChartData({
        labels: sortedMeasurements.map((m) => new Date(m.dateTime).toLocaleDateString()),
        datasets: [
          {
            label: parameterName,
            data: sortedMeasurements.map((m) => m.value),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      })
    } else {
      setChartData(null) // Manejar el caso de datos vacíos
    }
  }, [measurements, parameterName])

  if (!chartData) {
    return <div className="text-center text-muted">No hay datos disponibles para mostrar.</div>
  }

  return (
    <div>
      <Line data={chartData} />
    </div>
  )
}

export default ParameterTrendsChart
