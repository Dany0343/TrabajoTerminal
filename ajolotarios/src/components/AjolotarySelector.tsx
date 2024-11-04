// src/components/AjolotarySelector.tsx
import React from 'react'
import Select from 'react-select'
import { Ajolotary } from '@/types'

interface Option {
  value: number
  label: string
}

interface AjolotarySelectorProps {
  ajolotaries: Ajolotary[]
  onSelect: (ajolotary: Ajolotary | null) => void
}

const AjolotarySelector: React.FC<AjolotarySelectorProps> = ({ ajolotaries, onSelect }) => {
  const options: Option[] = ajolotaries.map(ajolotary => ({
    value: ajolotary.id,
    label: ajolotary.name,
  }))

  const handleChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      const selectedAjolotary = ajolotaries.find(a => a.id === selectedOption.value) || null
      onSelect(selectedAjolotary)
    } else {
      onSelect(null)
    }
  }

  return (
    <div className="mb-6">
      <Select
        options={options}
        onChange={handleChange}
        isClearable
        placeholder="Selecciona una instalación..."
        className="basic-select"
        classNamePrefix="select"
      />
    </div>
  )
}

export default AjolotarySelector
