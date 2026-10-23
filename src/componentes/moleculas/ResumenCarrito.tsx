import { Link } from "react-router-dom"
import { formatearPrecio } from "../../formatoPrecio";

interface ResumenCarritoProps {
    total: number;
    alConfirmar: () => void;
}

// Molécula: total del pedido y botones de acción
function ResumenCarrito({ total, alConfirmar }: ResumenCarritoProps) {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <p className="texto-precio fs-4 mb-0" data-testid="total-carrito">Total: {formatearPrecio(total)}</p>
            <div className="d-flex gap-2">
                <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
                <button type="button" className="btn btn-primary" onClick={alConfirmar}>Confirmar pedido</button>
            </div>
        </div>
    )
}
export default ResumenCarrito
