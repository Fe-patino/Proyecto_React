import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import TablaCarrito from "../componentes/organismos/TablaCarrito"
import ResumenCarrito from "../componentes/moleculas/ResumenCarrito"
import { useCarrito } from "../useCarrito"
import { obtenerProductos } from "../productosService"
import { armarLineas, calcularTotal } from "../calculosCarrito"
import type { Producto } from "./Productos"
import FormularioPago from "../componentes/organismos/FormularioPago"

export interface ItemCarrito {
  id: string;
  cantidad: number;
}

export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
}

function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar } = useCarrito()
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)
  const [mostrarPago, setMostrarPago] = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])

  useEffect(() => {
    obtenerProductos().then(setProductos)
  }, [])

  const lineas = armarLineas(items, productos)
  const total = calcularTotal(lineas)

  const alPagarExitoso = () => {
    vaciar()
    setMostrarPago(false)
    setPedidoConfirmado(true)
  }

  return (
    <div className="container mt-4">
      <h1>Mi carrito</h1>
      <p className="text-muted">Revisa los cilindros que seleccionaste antes de confirmar tu pedido</p>

      {pedidoConfirmado && (
        <div className="alert alert-success" role="status">
          Pago registrado correctamente. Nos pondremos en contacto para coordinar la entrega.
        </div>
      )}

      {lineas.length === 0 ? (
        <div className="text-center py-5">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-primary">Ir a productos</Link>
        </div>
      ) : mostrarPago ? (
        <FormularioPago
          total={total}
          alPagarExitoso={alPagarExitoso}
          alCancelar={() => setMostrarPago(false)}
        />
      ) : (
        <>
          <TablaCarrito lineas={lineas} alCambiarCantidad={cambiarCantidad} alQuitar={quitar} />
          <ResumenCarrito total={total} alConfirmar={() => setMostrarPago(true)} />
        </>
      )}
    </div>
  )
}

export default Carrito