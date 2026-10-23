import { useState } from "react"
import { Link } from "react-router-dom"
import TablaCarrito from "../componentes/organismos/TablaCarrito"
import ResumenCarrito from "../componentes/moleculas/ResumenCarrito"
import { useCarrito } from "../useCarrito"
import { obtenerProductos } from "../productosService"
import { armarLineas, calcularTotal } from "../calculosCarrito"
import type { Producto } from "./Productos"

// Lo que se guarda del carrito: solo el código del producto y la cantidad
export interface ItemCarrito {
  id: string;
  cantidad: number;
}

// Un ítem unido a los datos completos de su producto (para mostrarlo en pantalla)
export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
}

// Página /carrito: toma los ítems del carrito, los une con los datos de cada producto
// y muestra la tabla, el total y la confirmación del pedido
function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar } = useCarrito()
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)

  const lineas = armarLineas(items, obtenerProductos())

  const confirmar = () => {
    vaciar()
    setPedidoConfirmado(true)
  }

  return (
    <div className="container mt-4">
      <h1>Mi carrito</h1>
      <p className="text-muted">Revisa los cilindros que seleccionaste antes de confirmar tu pedido</p>

      {pedidoConfirmado && (
        <div className="alert alert-success" role="status">
          Pedido registrado. Nos pondremos en contacto para coordinar la entrega.
        </div>
      )}

      {lineas.length === 0 ? (
        <div className="text-center py-5">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-primary">Ir a productos</Link>
        </div>
      ) : (
        <>
          <TablaCarrito lineas={lineas} alCambiarCantidad={cambiarCantidad} alQuitar={quitar} />
          <ResumenCarrito total={calcularTotal(lineas)} alConfirmar={confirmar} />
        </>
      )}
    </div>
  )
}

export default Carrito
