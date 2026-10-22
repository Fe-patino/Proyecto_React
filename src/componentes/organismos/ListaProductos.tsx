import type { Producto } from "../../paginas/Productos";
import CardProducto from "../moleculas/CardProducto"

interface ListaProductosProps {
    productos: Producto[];
    alAgregar?: (id: string) => void;
    mensajeVacio?: string;
}

// Organismo: grilla responsive de tarjetas. Muestra un aviso cuando no hay resultados.
function ListaProductos({ productos, alAgregar, mensajeVacio = "No hay productos para mostrar." }: ListaProductosProps) {
    if (productos.length === 0) {
        return <div className="alert alert-info" role="status">{mensajeVacio}</div>
    }
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {productos.map((producto) => (
                <div className="col" key={producto.id}>
                    <CardProducto producto={producto} alAgregar={alAgregar} />
                </div>
            ))}
        </div>
    )
}
export default ListaProductos
