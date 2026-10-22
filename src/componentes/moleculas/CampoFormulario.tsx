import React from 'react';

// Interfaz para definir las propiedades (props) del componente
interface CampoFormularioProps {
  etiqueta: string;
  tipo: string;
  nombre: string;
  valor: string;
  alCambiar: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  deshabilitado?: boolean;
}

function CampoFormulario({
  etiqueta,
  tipo,
  nombre,
  valor,
  alCambiar,
  placeholder = '',
  deshabilitado = false
}: CampoFormularioProps) {
  return (
    <div className="mb-3 text-start">
      <label htmlFor={nombre} className="form-label fw-semibold text-dark">
        {etiqueta}
      </label>
      <input
        type={tipo}
        id={nombre}
        name={nombre}
        className="form-control"
        value={valor}
        onChange={alCambiar}
        placeholder={placeholder}
        disabled={deshabilitado}
      />
    </div>
  );
}

export default CampoFormulario;