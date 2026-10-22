import FormularioContacto from '../componentes/organismos/FormularioContacto';

function Contacto() {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h2 className="text-dark fw-bold mb-3">Contacto</h2>
            <p className="text-muted mb-4">
              Ponte en contacto con nuestro equipo para consultas, soporte o pedidos de gas.
            </p>

            {/* Inyección del Organismo FormularioContacto */}
            <FormularioContacto />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;