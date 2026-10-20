import React, { useState } from 'react';

function Contacto() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Alerta para verificar que el botón funciona al hacer clic
    alert(`¡Formulario enviado con éxito!\n\nNombre: ${nombre}\nMensaje: ${mensaje}`);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h2 className="text-dark fw-bold mb-3">Contacto</h2>
            <p className="text-muted mb-4">
              Ponte en contacto con nuestro equipo de atención para pedidos o soporte de gas.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label fw-semibold">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label fw-semibold">
                  Mensaje
                </label>
                <textarea
                  className="form-control"
                  id="mensaje"
                  rows={4}
                  placeholder="Escribe tu consulta aquí..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-bold"
                style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;