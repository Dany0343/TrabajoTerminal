'use client';

import { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Measurement, Alert, Sensor } from '@/types/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

interface DashboardChartsProps {
  measurements: Measurement[];
  alerts: Alert[];
  sensors: Sensor[];
}

interface Option {
  value: string | number;
  label: string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  measurements = [], 
  alerts = [], 
  sensors = [] 
}) => {
  const [selectedSensorIds, setSelectedSensorIds] = useState<number[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  
  // Memoized sensor options
  const sensorOptions = useMemo(() => 
    sensors.map(sensor => ({
      value: sensor.id,
      label: `${sensor.model} (${sensor.serialNumber})`
    })), [sensors]
  );

  // Memoized parameter options
  const parameterOptions = useMemo(() => {
    const uniqueParams = new Set<string>();
    measurements.forEach(m => {
      m.parameters.forEach(p => uniqueParams.add(p.parameter.name));
    });
    return Array.from(uniqueParams).map(param => ({
      value: param,
      label: param
    }));
  }, [measurements]);

  // Process measurement data for charts
  const processedData = useMemo(() => {
    let filtered = measurements;

    // Apply filters
    if (selectedSensorIds.length) {
      filtered = filtered.filter(m => selectedSensorIds.includes(m.sensorId));
    }
    if (selectedParameters.length) {
      filtered = filtered.filter(m => 
        m.parameters.some(p => selectedParameters.includes(p.parameter.name))
      );
    }
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(m => {
        const date = new Date(m.dateTime);
        return date >= dateRange[0]! && date <= dateRange[1]!;
      });
    }

    // Format data for charts
    return filtered.reduce((acc, curr) => {
      const date = new Date(curr.dateTime).toLocaleString();
      if (!acc[date]) {
        acc[date] = { date };
      }
      curr.parameters.forEach(p => {
        if (!selectedParameters.length || selectedParameters.includes(p.parameter.name)) {
          acc[date][p.parameter.name] = p.value;
        }
      });
      return acc;
    }, {} as Record<string, any>);
  }, [measurements, selectedSensorIds, selectedParameters, dateRange]);

  // Convert to array and sort by date
  const chartData = useMemo(() => 
    Object.values(processedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ), [processedData]
  );

  // Alert statistics
  const alertStats = useMemo(() => {
    const stats = alerts.reduce((acc, curr) => {
      acc[curr.alertType] = (acc[curr.alertType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  // Sensor status statistics
  const sensorStats = useMemo(() => {
    const statuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'QUARANTINE'];
    return statuses.map(status => ({
      name: status,
      value: sensors.filter(s => s.status === status).length
    }));
  }, [sensors]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select
            isMulti
            options={sensorOptions}
            onChange={(selected) => setSelectedSensorIds(selected?.map(s => s.value as number) || [])}
            placeholder="Seleccionar sensores..."
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Select
            isMulti
            options={parameterOptions}
            onChange={(selected) => setSelectedParameters(selected?.map(s => s.value as string) || [])}
            placeholder="Seleccionar parámetros..."
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => setDateRange([update[0] || undefined, update[1] || undefined])}
            className="w-full p-2 border rounded"
            placeholderText="Seleccionar fechas..."
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Mediciones en el Tiempo</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedParameters.map((param, idx) => (
                    <Line
                      key={param}
                      type="monotone"
                      dataKey={param}
                      stroke={COLORS[idx % COLORS.length]}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Selecciona parámetros para visualizar datos
              </div>
            )}
          </div>
        </div>

        {/* Alert Chart */}
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
                No hay datos de alertas disponibles
              </div>
            )}
          </div>
        </div>

        {/* Sensor Status Chart */}
        {/* <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Estado de Sensores</h3>
          <div className="h-[300px]">
            {sensorStats.some(stat => stat.value > 0) ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={sensorStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {sensorStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No hay datos de estado de sensores
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardCharts;