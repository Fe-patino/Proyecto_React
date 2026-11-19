import { useState, useEffect } from "react";

interface Novedad {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaPublicacion: string;
}

function Novedades() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [desplegados, setDesplegados] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetch("http://localhost:8084/api/novedades")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar novedades");
        return res.json();
      })
      .then((datos) => setNovedades(datos))
      .catch(() => setError("No se pudieron cargar las novedades. Verifica que el servidor esté corriendo."))
      .finally(() => setCargando(false));
  }, []);

  const toggleDesplegar = (id: number) => {
    setDesplegados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-100 bg-light pb-5">
      <div className="text-white py-5 mb-5 text-center" style={{ backgroundColor: "#1e1b2e" }}>
        <div className="container">
          <h1 className="fw-bold display-5 mb-2 text-white">Novedades</h1>
          <p className="text-white-50 fs-5 mb-0">
            Consejos y noticias sobre el uso seguro del gas licuado
          </p>
        </div>
      </div>

      <div className="container">
        {cargando && (
          <p className="text-center text-muted">Cargando novedades...</p>
        )}

        {error && (
          <p className="text-center text-danger">{error}</p>
        )}

        {!cargando && !error && novedades.length === 0 && (
          <p className="text-center text-muted">No hay novedades disponibles.</p>
        )}

        <div className="row g-4 justify-content-center">
          {novedades.map((novedad) => {
            const estaAbierto = !!desplegados[novedad.id];
            const resumen = novedad.descripcion.length > 120
              ? novedad.descripcion.slice(0, 120) + "..."
              : novedad.descripcion;

            return (
              <div key={novedad.id} className="col-12 col-md-6 col-lg-5">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  {novedad.imagen && (
                    <img
                      src={novedad.imagen}
                      alt={novedad.titulo}
                      className="card-img-top"
                      style={{ width: "100%", height: "300px", objectFit: "cover", objectPosition: "center" }}
                    />
                  )}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <span className="fw-bold small d-block mb-2" style={{ color: "#f97316" }}>
                        {novedad.fechaPublicacion}
                      </span>
                      <h3 className="card-title text-dark fw-bold h5 mb-3">
                        {novedad.titulo}
                      </h3>
                      <p className="card-text text-muted mb-3" style={{ lineHeight: "1.6", textAlign: "justify" }}>
                        {resumen}
                      </p>
                      {estaAbierto && (
                        <div className="mt-3 pt-3 border-top text-secondary small" style={{ lineHeight: "1.6", textAlign: "justify" }}>
                          {novedad.descripcion}
                        </div>
                      )}
                    </div>
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