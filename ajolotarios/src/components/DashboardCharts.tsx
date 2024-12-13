'use client';

import { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Measurement, Alert } from '@/types/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

interface DashboardChartsProps {
  measurements: Measurement[];
  alerts: Alert[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  measurements = [], 
  alerts = []
}) => {
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Opciones de parámetros disponibles
  const parameterOptions = useMemo(() => {
    const uniqueParams = new Set<string>();
    measurements.forEach(m => {
      m.parameters.forEach(p => uniqueParams.add(p.parameter.name));
    });
    return Array.from(uniqueParams)
      .sort()
      .map(param => ({
        value: param,
        label: param
      }));
  }, [measurements]);

  // Procesamiento de datos para gráficas
  const processedData = useMemo(() => {
    if (!measurements.length) return [];

    let filtered = measurements;

    // Filtro por fechas
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]).setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange[1]).setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(m => {
        const measurementDate = new Date(m.dateTime).getTime();
        return measurementDate >= startDate && measurementDate <= endDate;
      });
    }

    // Formateo de datos para el gráfico
    return filtered.map(m => {
      const baseData: { date: string; [key: string]: string | number } = {
        date: new Date(m.dateTime).toLocaleString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      m.parameters.forEach(p => {
        if (!selectedParameters.length || selectedParameters.includes(p.parameter.name)) {
          baseData[p.parameter.name] = Number(p.value);
        }
      });

      return baseData;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [measurements, selectedParameters, dateRange]);

  // Estadísticas de alertas
  const alertStats = useMemo(() => {
    const stats = alerts.reduce((acc, curr) => {
      acc[curr.alertType] = (acc[curr.alertType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [alerts]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select
            isMulti
            options={parameterOptions}
            onChange={(selected) => setSelectedParameters(selected?.map(s => String(s.value)) || [])}
            placeholder="Seleccionar parámetros..."
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <DatePicker
            selectsRange
            startDate={dateRange[0] ?? undefined}
            endDate={dateRange[1] ?? undefined}
            onChange={(update) => setDateRange(update)}
            className="w-full p-2 border rounded"
            placeholderText="Seleccionar fechas..."
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Mediciones en el Tiempo</h3>
          <div className="h-[300px]">
            {processedData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedParameters.length > 0 ? 
                    selectedParameters.map((param, idx) => (
                      <Line
                        key={param}
                        type="monotone"
                        dataKey={param}
                        stroke={COLORS[idx % COLORS.length]}
                        dot={false}
                      />
                    )) :
                    parameterOptions.map((param, idx) => (
                      <Line
                        key={param.value}
                        type="monotone"
                        dataKey={param.value}
                        stroke={COLORS[idx % COLORS.length]}
                        dot={false}
                      />
                    ))
                  }
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No hay datos para mostrar en el rango seleccionado
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribución de Alertas</h3>
          <div className="h-[300px]">
            {alertStats.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={alertStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No hay alertas registradas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;