function Footer() {
  return (
    <footer className="bg-dark text-white-50 mt-auto pt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-white">Gas El Volcán</h5>
            <p>Distribución de gas licuado a domicilio en Chillán y comunas aledañas desde 1998.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-white">Contacto</h6>
            <p>Chillán, Región de Ñuble<br />+56 9 1234 5678<br />contacto@gaselvolcan.cl</p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-white">Horario de despacho</h6>
            <p>Lunes a Sábado<br />08:00 – 20:00 hrs</p>
          </div>
        </div>
        <p className="text-center border-top border-secondary py-3 mb-0 small">
          © 2024 Distribuidora de Gas El Volcán. Proyecto académico DSY1104.
        </p>
      </div>
    </footer>
  );
}

export default Footer;