// src/components/DashboardCharts.tsx

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Measurement, Alert, Sensor } from '@/types/types';

interface DashboardChartsProps {
  measurements: Measurement[];
  alerts: Alert[];
  sensors: Sensor[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ measurements, alerts, sensors }) => {
  
  // Gráfico 1: Variación de valores de un sensor específico a lo largo del tiempo
  const sensorData = useMemo(() => {
    // Selecciona el primer sensor para este ejemplo
    const selectedSensor = sensors[0];
    if (!selectedSensor) return [];

    // Asegúrate de que el parámetro 'Temperature' existe en tus datos
    const filteredMeasurements = measurements
      .filter(m => m.sensorId === selectedSensor.id)
      .map(m => ({
        date: new Date(m.dateTime).toLocaleString(),
        value: m.parameters.find(p => p.parameter.name === 'Temperature')?.value || 0, // Ajusta 'Temperature' según tu parámetro
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filteredMeasurements;
  }, [measurements, sensors]);

  // Gráfico 2: Número de alertas por tipo
  const alertData = useMemo(() => {
    const alertCount: { name: string; value: number }[] = [];

    const typeCount: { [key: string]: number } = {};

    alerts.forEach(alert => {
      const type = alert.alertType;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    for (const type in typeCount) {
      alertCount.push({ name: type, value: typeCount[type] });
    }

    return alertCount;
  }, [alerts]);

  // Gráfico 3: Estado actual de los sensores
  const sensorStatusData = useMemo(() => {
    const statusCount: { name: string; value: number }[] = [];

    const statusTypes = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'QUARANTINE']; // Asegúrate de incluir todos los estados relevantes

    statusTypes.forEach(status => {
      const count = sensors.filter(sensor => sensor.status === status).length;
      statusCount.push({ name: status, value: count });
    });

    return statusCount;
  }, [sensors]);

  return (
    <div className="space-y-8">
      {/* Gráfico 1: Variación de Valores de Sensor */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">
          Variación de Temperatura del Sensor {sensors[0]?.model || 'N/A'}
        </h2>
        {sensorData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Temperatura" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay datos disponibles para este sensor.</p>
        )}
      </div>

      {/* Gráfico 2: Número de Alertas por Tipo */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Número de Alertas por Tipo</h2>
        {alertData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Cantidad" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay alertas para mostrar.</p>
        )}
      </div>

      {/* Gráfico 3: Estado Actual de los Sensores */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Estado Actual de los Sensores</h2>
        {sensorStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sensorStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {sensorStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay datos de estado de sensores para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
