import { formatearPrecio } from "../../formatoPrecio";
import type { LineaCarrito } from "../../paginas/Carrito";

interface FilaCarritoProps {
    linea: LineaCarrito;
    alCambiarCantidad: (id: string, cantidad: number) => void;
    alQuitar: (id: string) => void;
}

// Molécula: una fila de la tabla del carrito (producto, precio, cantidad con − / +, subtotal, quitar)
function FilaCarrito({ linea, alCambiarCantidad, alQuitar }: FilaCarritoProps) {
    const { producto, cantidad } = linea
    return (
        <tr>
            <td>
                <img src={producto.imagen} alt={producto.nombre} width="60" height="60" className="me-2" style={{ objectFit: "contain" }} />
                {producto.nombre}
            </td>
            <td>{formatearPrecio(producto.precio)}</td>
            <td className="text-nowrap">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    aria-label={`Disminuir cantidad de ${producto.nombre}`}
                    disabled={cantidad <= 1}
                    onClick={() => alCambiarCantidad(producto.id, cantidad - 1)}
                >
                    −
                </button>
                <span className="mx-2" aria-label={`Cantidad de ${producto.nombre}`}>{cantidad}</span>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    aria-label={`Aumentar cantidad de ${producto.nombre}`}
                    disabled={cantidad >= producto.stock}
                    onClick={() => alCambiarCantidad(producto.id, cantidad + 1)}
                >
                    +
                </button>
            </td>
            <td>{formatearPrecio(producto.precio * cantidad)}</td>
            <td>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Quitar ${producto.nombre}`}
                    onClick={() => alQuitar(producto.id)}
                >
                    Quitar
                </button>
            </td>
        </tr>
    )
}
export default FilaCarrito
