import { Link } from "react-router-dom"

interface BotonVolverProps {
    to?: string;
    texto?: string;
}

// Átomo: enlace para volver al listado de productos
function BotonVolver({ to = "/productos", texto = "Volver a productos" }: BotonVolverProps) {
    return (
        <Link to={to} className="btn btn-outline-secondary">{texto}</Link>
    )
}
export default BotonVolver
