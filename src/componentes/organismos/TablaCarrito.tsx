import type { LineaCarrito } from "../../paginas/Carrito";
import FilaCarrito from "../moleculas/FilaCarrito";

interface TablaCarritoProps {
    lineas: LineaCarrito[];
    alCambiarCantidad: (id: string, cantidad: number) => void;
    alQuitar: (id: string) => void;
}

// Organismo: tabla responsive con una fila por cada producto del carrito
function TablaCarrito({ lineas, alCambiarCantidad, alQuitar }: TablaCarritoProps) {
    return (
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
                    {lineas.map((linea) => (
                        <FilaCarrito
                            key={linea.producto.id}
                            linea={linea}
                            alCambiarCantidad={alCambiarCantidad}
                            alQuitar={alQuitar}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default TablaCarrito
