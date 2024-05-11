import React from 'react';

function Filters({ filters, onFilterChange }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
        <input
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="form-input border p-2 rounded w-full"
          type="text"
          placeholder="Buscar por colonia, zona o ciudad"
        />

        <div className="flex flex-col md:flex-row w-full gap-4">
          <input
            value={filters.priceMin}
            onChange={(e) => onFilterChange('priceMin', e.target.value)}
            className="form-input border p-2 rounded w-full md:w-1/2"
            type="number"
            placeholder="Precio Mínimo"
          />
          <input
            value={filters.priceMax}
            onChange={(e) => onFilterChange('priceMax', e.target.value)}
            className="form-input border p-2 rounded w-full md:w-1/2"
            type="number"
            placeholder="Precio Máximo"
          />
        </div>

        <input
            value={filters.area}
            onChange={(e) => onFilterChange('area', e.target.value)}
            className="form-input border p-2 rounded w-full md:w-1/2"
            type="number"
            placeholder="Area"
        />
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4 mb-4">
        <select 
          value={filters.bedrooms}
          onChange={(e) => onFilterChange('bedrooms', e.target.value)}
          className="form-select border p-2 rounded w-full"
        >
          <option value="">Habitaciones</option>
          <option value="1">1 Habitación</option>
          <option value="2">2 Habitaciones</option>
          <option value="3">3 Habitaciones</option>
          <option value="4">4+ Habitaciones</option>
        </select>

        <select 
          value={filters.bathrooms}
          onChange={(e) => onFilterChange('bathrooms', e.target.value)}
          className="form-select border p-2 rounded w-full"
        >
          <option value="">Baños</option>
          <option value="1">1 Baño</option>
          <option value="2">2 Baños</option>
          <option value="3">3+ Baños</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;

