import { useEffect, useState } from "react"
import FiltroCategorias from "../moleculas/FiltroCategorias"
import BuscadorProductos from "../moleculas/BuscadorProductos"
import ListaProductos from "./ListaProductos"
import { CATEGORIAS, obtenerProductos } from "../../productosService"
import { filtrarProductos } from "../../filtroProductos"

// Organismo: arma el catálogo completo (filtros + buscador + lista) y maneja su estado
function CatalogoProductos() {
    const [productos] = useState(obtenerProductos)
    const [categoria, setCategoria] = useState("Todos")
    const [texto, setTexto] = useState("")
    const [aviso, setAviso] = useState("")

    // El aviso de "producto agregado" desaparece solo a los 2 segundos
    useEffect(() => {
        if (!aviso) return
        const temporizador = setTimeout(() => setAviso(""), 2000)
        return () => clearTimeout(temporizador)
    }, [aviso])

    const alAgregar = (id: string) => {
        // TODO: conectar con el carrito cuando exista (contexto o estado global)
        const producto = productos.find((p) => p.id === id)
        setAviso(`${producto?.nombre ?? "Producto"} agregado al carrito.`)
    }

    const visibles = filtrarProductos(productos, { categoria, texto })

    return (
        <>
            {aviso && <div className="alert alert-success" role="status">{aviso}</div>}

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
