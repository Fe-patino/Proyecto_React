import { useState } from "react";

// Interfaz para la estructura de cada noticia/novedad
interface Novedad {
  id: number;
  categoria: string;
  titulo: string;
  resumen: string;
  contenidoCompleto: string;
  imagen: string;
}

const listaNovedades: Novedad[] = [
  {
    id: 1,
    categoria: "Consejos",
    titulo: "Tips para almacenar tu cilindro de gas",
    resumen:
      "Guarda tu cilindro en un lugar ventilado, alejado de fuentes de calor y siempre en posición vertical. Aquí te contamos todo lo que debes saber.",
    contenidoCompleto:
      "Para garantizar la máxima seguridad en tu hogar, asegúrate de mantener el cilindro alejado de chispas o instalaciones eléctricas defectuosas. Nunca acuestes el cilindro ni lo guardes en subterráneos o espacios cerrados sin ventilación. Inspecciona periódicamente el regulador y la manguera flexible para verificar que no existan desgastes.",
    imagen:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=600&auto=format&fit=crop", // Reemplaza por tu imagen local si lo prefieres
  },
  {
    id: 2,
    categoria: "Consejos",
    titulo: "¿Cómo saber cuándo recargar tu cilindro?",
    resumen:
      "Existen señales simples que te indican cuándo tu gas se está por acabar. Te enseñamos a reconocerlas antes de quedarte sin gas.",
    contenidoCompleto:
      "Una de las señales más claras es cuando la llama de tus cocinas cambia de un azul brillante a un tono amarillento o anaranjado irregular. También puedes notar una pérdida constante de presión al encender múltiples quemadores. Te recomendamos tener siempre un cilindro de repuesto o solicitar tu recarga con anticipación en Distribuidora Gas el Volcán.",
    imagen:
      "https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=600&auto=format&fit=crop", // Reemplaza por tu imagen local si lo prefieres
  },
];

function Novedades() {
  // Estado para rastrear qué tarjetas tienen desplegado el texto completo
  const [desplegados, setDesplegados] = useState<{ [key: number]: boolean }>({});

  const toggleDesplegar = (id: number) => {
    setDesplegados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-100 bg-light pb-5">
      {/* Encabezado con fondo oscuro como en la imagen */}
      <div className="text-white py-5 mb-5 text-center" style={{ backgroundColor: "#1e1b2e" }}>
        <div className="container">
          <h1 className="fw-bold display-5 mb-2 text-white">Novedades</h1>
          <p className="text-white-50 fs-5 mb-0">
            Consejos y noticias sobre el uso seguro del gas licuado
          </p>
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {listaNovedades.map((novedad) => {
            const estaAbierto = !!desplegados[novedad.id];

            return (
              <div key={novedad.id} className="col-12 col-md-6 col-lg-5">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  {/* Imagen de la Noticia */}
                  <img
                    src={novedad.imagen}
                    alt={novedad.titulo}
                    className="card-img-top"
                    style={{ height: "240px", objectFit: "cover" }}
                  />

                  {/* Cuerpos de la Tarjeta */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      {/* Categoría en Naranja */}
                      <span
                        className="fw-bold small d-block mb-2"
                        style={{ color: "#f97316" }}
                      >
                        {novedad.categoria}
                      </span>

                      {/* Título */}
                      <h3 className="card-title text-dark fw-bold h5 mb-3">
                        {novedad.titulo}
                      </h3>

                      {/* Resumen */}
                      <p className="card-text text-muted mb-3" style={{ lineHeight: "1.6", textAlign: "justify" }}>
                        {novedad.resumen}
                      </p>

                      {/* Texto Desplegable */}
                      {estaAbierto && (
                        <div className="mt-3 pt-3 border-top text-secondary small" style={{ lineHeight: "1.6", textAlign: "justify" }}>
                          {novedad.contenidoCompleto}
                        </div>
                      )}
                    </div>

                    {/* Botón Leer más / Leer menos */}
                    <button
                      onClick={() => toggleDesplegar(novedad.id)}
                      className="btn w-100 mt-4 fw-bold rounded-3 py-2 text-dark bg-transparent border-dark"
                      style={{ borderWidth: "1.5px" }}
                    >
                      {estaAbierto ? "Leer menos" : "Leer más"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Novedades;