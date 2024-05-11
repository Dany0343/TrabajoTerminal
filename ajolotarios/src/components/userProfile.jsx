// UserProfile.jsx
"use client";

import { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Si no hay userId, no intentamos cargar los datos
    if (!userId) {
      console.log('UserId no proporcionado');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (!user) {
    return <div className="text-center p-4">Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Perfil de Usuario</div>
          <p className="block mt-1 text-lg leading-tight font-medium text-black">Nombre de usuario: {user.username}</p>
          <p className="mt-2 text-gray-500">Email: {user.email}</p>
          <p className="mt-2 text-gray-500">Fecha de registro: {new Date(user.registrationDate).toLocaleDateString()}</p>
          <p className="mt-2 text-gray-500">Rol: {user.role || 'No especificado'}</p>
          {/* Agregar más campos según sea necesario */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
