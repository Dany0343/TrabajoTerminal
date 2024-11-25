// src/components/LogHistory.tsx

'use client';

import { useEffect, useState } from 'react';
import { Log as PrismaLog, ActionType } from '@prisma/client';
import { User, Role } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Log extends PrismaLog {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface LogsResponse {
  data: Log[];
  total: number;
  page: number;
  totalPages: number;
}

const LogHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',  
    entity: '',  
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debugging: Inspeccionar la sesión
  useEffect(() => {
    console.log('Session Data:', session);
  }, [session]);

  // Obtener usuarios para el filtro de usuario
  useEffect(() => {
    if (status !== "authenticated" || session?.user.role !== Role.SUPER_ADMIN) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [session, status]);

  // Obtener logs cada vez que los filtros o la página cambien
  useEffect(() => {
    if (status !== "authenticated" || session?.user.role !== Role.SUPER_ADMIN) return;
    
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(filters.userId && { userId: filters.userId }),
          ...(filters.action && { action: filters.action }),
          ...(filters.entity && { entity: filters.entity }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
        });
    
        const response = await fetch(`/api/loggs?${query}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setLogs(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters, page, session, status]);

  // Resetear a la primera página cuando los filtros cambien
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Manejar diferentes estados de sesión
  if (status === "loading") {
    return <div className="text-center">Cargando sesión...</div>;
  }

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return <div className="text-center text-red-500">No tienes permisos para ver esta sección.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Operaciones</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Acción */}
          <Select
            onValueChange={(value) => {
                const userId = value === 'all' ? '' : value;
                setFilters(prev => ({ ...prev, userId }));
              }}
            value={filters.action}
          >
            <SelectTrigger>
              <SelectValue placeholder="Acción" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="CREATE">Crear</SelectItem>
                <SelectItem value="UPDATE">Actualizar</SelectItem>
                <SelectItem value="DELETE">Eliminar</SelectItem>
            </SelectContent>
          </Select>

          {/* Entidad */}
          <Select
            onValueChange={(value) => {
                const userId = value === 'all' ? '' : value;
                setFilters(prev => ({ ...prev, userId }));
              }}
            value={filters.entity}
          >
            <SelectTrigger>
              <SelectValue placeholder="Entidad" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="AJOLOTARY">Ajolotario</SelectItem>
                <SelectItem value="TANK">Tanque</SelectItem>
                <SelectItem value="SENSOR">Sensor</SelectItem>
                <SelectItem value="MEASUREMENT">Medición</SelectItem>
              {/* Agrega más entidades según tu esquema */}
            </SelectContent>
          </Select>

          {/* Usuario */}
          <Select
            onValueChange={(value) => {
                const userId = value === 'all' ? '' : value;
                setFilters(prev => ({ ...prev, userId }));
              }}
            value={filters.userId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Usuario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Fecha de Inicio */}
          <Input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder="Fecha de inicio"
          />

          {/* Fecha de Fin */}
          <Input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            placeholder="Fecha de fin"
          />
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center">Cargando...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : logs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Fecha y Hora</th>
                    <th className="px-4 py-2">Usuario</th>
                    <th className="px-4 py-2">Acción</th>
                    <th className="px-4 py-2">Entidad</th>
                    <th className="px-4 py-2">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-t">
                      <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Sistema/Automático'}
                      </td>
                      <td className="px-4 py-2">{log.action}</td>
                      <td className="px-4 py-2">{log.entity}</td>
                      <td className="px-4 py-2">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <button
                className={`flex items-center px-4 py-2 rounded ${
                  page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
                }`}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                className={`flex items-center px-4 py-2 rounded ${
                  page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
                }`}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted">No hay operaciones registradas.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogHistory;

// xd