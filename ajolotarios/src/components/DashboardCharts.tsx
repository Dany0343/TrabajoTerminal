// src/components/DashboardCharts.tsx

'use client';

import { useMemo, useState } from 'react';
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
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Measurement, Alert, Sensor } from '@/types/types';

interface DashboardChartsProps {
  measurements: Measurement[];
  alerts: Alert[];
  sensors: Sensor[];
}

interface Option {
  value: any;
  label: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ measurements, alerts, sensors }) => {
  const [selectedSensorIds, setSelectedSensorIds] = useState<number[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [startDate, endDate] = dateRange;

  // Opciones de sensores para el selector multi
  const sensorOptions: Option[] = useMemo(
    () =>
      sensors.map(sensor => ({
        value: sensor.id,
        label: `${sensor.model} (${sensor.serialNumber})`,
      })),
    [sensors]
  );

  // Opciones de parámetros disponibles
  const parameterOptions: Option[] = useMemo(() => {
    const params = new Set<string>();
    measurements.forEach(m => {
      m.parameters.forEach(p => params.add(p.parameter.name));
    });
    return Array.from(params).map(param => ({
      value: param,
      label: param,
    }));
  }, [measurements]);

  // Gráfico 1: Variación de valores de sensores específicos a lo largo del tiempo
  const sensorData = useMemo(() => {
    let filteredMeasurements = measurements;

    // Filtrar por sensores seleccionados
    if (selectedSensorIds.length > 0) {
      filteredMeasurements = filteredMeasurements.filter(m => selectedSensorIds.includes(m.sensorId));
    }

    // Filtrar por parámetros seleccionados
    if (selectedParameters.length > 0) {
      filteredMeasurements = filteredMeasurements.filter(m =>
        m.parameters.some(p => selectedParameters.includes(p.parameter.name))
      );
    }

    // Filtrar por rango de fechas
    if (startDate && endDate) {
      filteredMeasurements = filteredMeasurements.filter(m => {
        const mDate = new Date(m.dateTime);
        return mDate >= startDate && mDate <= endDate;
      });
    }

    // Organizar datos para múltiples líneas
    const dataMap: { [key: string]: any } = {};

    filteredMeasurements.forEach(m => {
      const date = new Date(m.dateTime).toLocaleString();
      if (!dataMap[date]) {
        dataMap[date] = { date };
      }
      m.parameters.forEach(p => {
        if (selectedParameters.length === 0 || selectedParameters.includes(p.parameter.name)) {
          dataMap[date][p.parameter.name] = p.value;
        }
      });
    });

    // Convertir el mapa a un array ordenado
    const data = Object.values(dataMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return data;
  }, [measurements, selectedSensorIds, selectedParameters, startDate, endDate]);

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
      {/* Selectores de Filtros */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-8">
        {/* Selector de Sensores */}
        <div className="flex-1">
          <label htmlFor="sensor-select" className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Sensores
          </label>
          <Select
            isMulti
            name="sensors"
            options={sensorOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selectedOptions) => {
              const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
              setSelectedSensorIds(ids);
            }}
            placeholder="Selecciona uno o más sensores..."
          />
        </div>

        {/* Selector de Parámetros */}
        <div className="flex-1">
          <label htmlFor="parameter-select" className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Parámetros
          </label>
          <Select
            isMulti
            name="parameters"
            options={parameterOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selectedOptions) => {
              const params = selectedOptions ? selectedOptions.map(option => option.value) : [];
              setSelectedParameters(params);
            }}
            placeholder="Selecciona uno o más parámetros..."
          />
        </div>

        {/* Selector de Rango de Fechas */}
        <div className="flex-1">
          <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Fechas
          </label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              // Asegúrate de que update sea un array con Date | undefined
              if (update) {
                setDateRange([
                  update[0] ? new Date(update[0]) : undefined,
                  update[1] ? new Date(update[1]) : undefined,
                ]);
              } else {
                setDateRange([undefined, undefined]);
              }
            }}
            isClearable={true}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholderText="Selecciona un rango de fechas"
          />
        </div>
      </div>

      {/* Gráfico 1: Variación de Valores de Sensor */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">
          Variación de Parámetros
        </h2>
        {sensorData.length > 0 && selectedParameters.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedParameters.map((param, index) => (
                <Line
                  key={param}
                  type="monotone"
                  dataKey={param}
                  name={param}
                  stroke={COLORS[index % COLORS.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">Selecciona al menos un sensor y un parámetro para visualizar los datos.</p>
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
          <p className="text-center text-gray-500">No hay alertas para mostrar.</p>
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
          <p className="text-center text-gray-500">No hay datos de estado de sensores para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
