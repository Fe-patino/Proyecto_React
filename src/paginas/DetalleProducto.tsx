import { useParams } from "react-router-dom"
import BotonVolver from "../componentes/atomos/BotonVolver"
import { obtenerProductoPorId } from "../productosService"

const formatearPrecio = (valor: number) => "$" + valor.toLocaleString("es-CL")

// Página /producto/:id — el id llega por la URL (parámetro de ruta)
function DetalleProducto() {
    const { id } = useParams()
    const producto = id ? obtenerProductoPorId(id) : undefined

    if (!producto) {
        return (
            <div className="container my-5 text-center">
                <h1 className="h3">Producto no encontrado</h1>
                <BotonVolver />
            </div>
        )
    }

    return (
        <div className="container my-5">
            <div className="row g-4 align-items-center">
                <div className="col-12 col-md-6 text-center">
                    <img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{ maxHeight: 400, objectFit: "contain" }} />
                </div>
                <div className="col-12 col-md-6">
                    <span className={`badge ${producto.stock > 0 ? "text-bg-success" : "text-bg-danger"}`}>
                        {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : "Sin stock"}
                    </span>
                    <h1 className="h2 mt-3">{producto.nombre}</h1>
                    <p className="text-muted">{producto.descripcionCompleta}</p>
                    <p className="fw-bold fs-2" style={{ color: "#f97316" }}>{formatearPrecio(producto.precio)}</p>
                    <BotonVolver />
                </div>
            </div>
        </div>
    )
}
export default DetalleProducto
