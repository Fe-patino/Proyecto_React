import type { Producto } from "../../paginas/Productos";
import Boton from "../atomos/Boton"


interface CardProductoProps {
    producto: Producto;
    alAgregar?: (id: string) => void;
}

const formatearPrecio = (valor: number) => "$" + valor.toLocaleString("es-CL")

// Molécula: tarjeta de producto. Si no recibe alAgregar, no muestra el botón "Agregar".
function CardProducto({ producto, alAgregar }: CardProductoProps) {
    return (
        <article className="card h-100 shadow-sm">
            <img
                src={producto.imagen}
                alt={producto.nombre}
                className="card-img-top p-3"
                style={{ height: 200, objectFit: "contain" }}
            />
            <div className="card-body d-flex flex-column">
                <small className="text-uppercase fw-semibold" style={{ color: "#f97316" }}>{producto.categoria}</small>
                <h3 className="card-title h5 mt-1">{producto.nombre}</h3>
                <p className="card-text text-muted">{producto.descripcionBreve}</p>
                <div className="mt-auto">
                    <p className="fw-bold fs-5 mb-2">{formatearPrecio(producto.precio)}</p>
                    {producto.stock === 0 && <span className="badge text-bg-danger me-2">Sin stock</span>}
                    <div className="d-flex gap-2 flex-wrap mt-2">
                        <Boton id={producto.id} />
                        {alAgregar && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={producto.stock === 0}
                                onClick={() => alAgregar(producto.id)}
                            >
                                Agregar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
export default CardProducto
