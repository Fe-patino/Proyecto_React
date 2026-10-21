import { Link } from "react-router-dom";

// Página del carrito: por ahora solo la interfaz (sin datos reales)
function Carrito() {
  return (
    <div className="container mt-4">
      <h1>Mi carrito</h1>
      <p className="text-muted">Revisa los cilindros que seleccionaste antes de confirmar tu pedido</p>

      <div className="table-responsive">
        <table className="table align-middle bg-white">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src="/img/gasde5k.png" alt="Cilindro GLP 5 kg" width="60" height="60" className="me-2" style={{ objectFit: "contain" }} />
                Cilindro GLP 5 kg
              </td>
              <td>$6.500</td>
              <td className="text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-secondary">−</button>
                <span className="mx-2">2</span>
                <button type="button" className="btn btn-sm btn-outline-secondary">+</button>
              </td>
              <td>$13.000</td>
              <td>
                <button type="button" className="btn btn-sm btn-outline-danger">Quitar</button>
              </td>
            </tr>
            <tr>
              <td>
                <img src="/img/gasde11k.png" alt="Cilindro GLP 11 kg" width="60" height="60" className="me-2" style={{ objectFit: "contain" }} />
                Cilindro GLP 11 kg
              </td>
              <td>$12.000</td>
              <td className="text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-secondary">−</button>
                <span className="mx-2">1</span>
                <button type="button" className="btn btn-sm btn-outline-secondary">+</button>
              </td>
              <td>$12.000</td>
              <td>
                <button type="button" className="btn btn-sm btn-outline-danger">Quitar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <p className="texto-precio fs-4 mb-0">Total: $25.000</p>
        <div className="d-flex gap-2">
          <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
          <button type="button" className="btn btn-primary">Confirmar pedido</button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;