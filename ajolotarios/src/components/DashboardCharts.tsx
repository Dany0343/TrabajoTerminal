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

// Utility function to format dates based on range
const getDateFormat = (startDate: Date | null, endDate: Date | null) => {
  if (!startDate || !endDate) return 'dd/MM HH:mm';
  
  const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays > 30) return 'MM/yyyy';
  if (diffDays > 7) return 'dd/MM';
  return 'dd/MM HH:mm';
};

const formatDate = (date: Date, format: string) => {
  return new Date(date).toLocaleString('es-MX', {
    day: format.includes('dd') ? '2-digit' : undefined,
    month: format.includes('MM') ? '2-digit' : undefined,
    year: format.includes('yyyy') ? 'numeric' : undefined,
    hour: format.includes('HH') ? '2-digit' : undefined,
    minute: format.includes('mm') ? '2-digit' : undefined,
  });
};

const DashboardCharts: React.FC<{ measurements: Measurement[]; alerts: Alert[] }> = ({ 
  measurements = [], 
  alerts = []
}) => {
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

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

  const processedData = useMemo(() => {
    if (!measurements.length) return [];

    let filtered = measurements;

    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]).setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange[1]).setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(m => {
        const measurementDate = new Date(m.dateTime).getTime();
        return measurementDate >= startDate && measurementDate <= endDate;
      });
    }

    const dateFormat = getDateFormat(dateRange[0], dateRange[1]);

    return filtered.map(m => ({
      date: formatDate(new Date(m.dateTime), dateFormat),
      timestamp: new Date(m.dateTime).getTime(),
      ...m.parameters.reduce((acc, p) => ({
        ...acc,
        [p.parameter.name]: Number(p.value)
      }), {})
    })).sort((a, b) => a.timestamp - b.timestamp);
  }, [measurements, dateRange]);

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
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => `Fecha: ${label}`}
                    formatter={(value) => [`${value}`, '']}
                  />
                  <Legend />
                  {(selectedParameters.length > 0 ? selectedParameters : parameterOptions.map(p => p.value))
                    .map((param, idx) => (
                      <Line
                        key={param}
                        type="monotone"
                        dataKey={param}
                        stroke={COLORS[idx % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
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