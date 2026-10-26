import { useEffect, useState } from "react"
import FiltroCategorias from "../moleculas/FiltroCategorias"
import BuscadorProductos from "../moleculas/BuscadorProductos"
import ListaProductos from "./ListaProductos"
import { CATEGORIAS, obtenerProductos } from "../../productosService"
import { filtrarProductos } from "../moleculas/FiltroProductos"
import { useCarrito } from "../../useCarrito"

// Organismo: arma el catálogo completo (filtros + buscador + lista) y maneja su estado
function CatalogoProductos() {
    const [productos] = useState(obtenerProductos)
    const [categoria, setCategoria] = useState("Todos")
    const [texto, setTexto] = useState("")
    const [aviso, setAviso] = useState({ texto: "", tipo: "success" })
    const { agregar } = useCarrito()

    // El aviso de "producto agregado" desaparece solo a los 2 segundos
    useEffect(() => {
        if (!aviso.texto) return
        const temporizador = setTimeout(() => setAviso({ texto: "", tipo: "success" }), 2000)
        return () => clearTimeout(temporizador)
    }, [aviso])

    const alAgregar = (id: string) => {
        const nombre = productos.find((p) => p.id === id)?.nombre ?? "Producto"
        // agregar() devuelve false si ya no quedan unidades disponibles
        if (agregar(id)) {
            setAviso({ texto: `${nombre} agregado al carrito.`, tipo: "success" })
        } else {
            setAviso({ texto: `No hay más unidades disponibles de ${nombre}.`, tipo: "warning" })
        }
    }

    const visibles = filtrarProductos(productos, { categoria, texto })

    return (
        <>
            {aviso.texto && <div className={`alert alert-${aviso.tipo}`} role="status">{aviso.texto}</div>}

            <div className="row g-3 mb-4 align-items-center">
                <div className="col-12 col-lg-8">
                    <FiltroCategorias categorias={CATEGORIAS} activa={categoria} alSeleccionar={setCategoria} />
                </div>
                <div className="col-12 col-lg-4">
                    <BuscadorProductos valor={texto} alCambiar={setTexto} />
                </div>
            </div>

            <ListaProductos
                productos={visibles}
                alAgregar={alAgregar}
                mensajeVacio="No hay productos que coincidan con tu búsqueda."
            />
        </>
    )
}
export default CatalogoProductos
