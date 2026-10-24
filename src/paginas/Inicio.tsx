import { Link } from "react-router-dom"
import Hero from "../componentes/organismos/Hero"
import ListaProductos from "../componentes/organismos/ListaProductos"
import Beneficio from "../componentes/moleculas/Beneficio"
import { obtenerProductos } from "../productosService"

const SLIDES = [
    { imagen: "/img/fotoprincipal.png", alt: "Repartidor de Gas El Volcán" },
    { imagen: "/img/balongas.png", alt: "Cilindro de gas listo para despacho" },
    { imagen: "/img/reparto.png", alt: "Cilindros de gas licuado" },
]

const BENEFICIOS = [
    { icono: "⚡", titulo: "Rápido", texto: "Entregamos entre 1 y 6 horas dependiendo de tu zona, todos los días de la semana." },
    { icono: "🛡️", titulo: "Seguro", texto: "Cilindros certificados y repartidores capacitados en manejo seguro de gas licuado." },
    { icono: "🏠", titulo: "A domicilio", texto: "Sin salir de casa: pide en línea y sigue el estado de tu pedido en tiempo real." },
]

// Página / (inicio): portada con carrusel, productos destacados y beneficios
function Inicio() {
    // Los destacados son los 3 primeros productos del catálogo
    const destacados = obtenerProductos().slice(0, 3)

    return (
        <>
            <Hero
                slides={SLIDES}
                titulo="Gas a domicilio, rápido y seguro"
                subtitulo="Más de 25 años llevando gas a los hogares de Ñuble"
                texto="Distribuimos cilindros de gas licuado a Chillán y comunas aledañas desde 1998. Pide en línea y sigue el estado de tu entrega sin llamar por teléfono."
                textoBoton="Pedir ahora"
                enlace="/productos"
            />

            <section className="container py-5">
                <h2 className="text-center">Nuestros productos destacados</h2>
                <p className="text-center text-secondary mb-4">Los formatos de cilindro más pedidos por nuestros clientes.</p>
                <ListaProductos productos={destacados} />
                <div className="text-center mt-4">
                    <Link to="/productos" className="btn btn-outline-secondary">Ver todo el catálogo</Link>
                </div>
            </section>

            <section className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center">¿Por qué elegirnos?</h2>
                    <p className="text-center text-secondary mb-4">Más de 25 años entregando gas a la comunidad de Ñuble.</p>
                    <div className="row g-4">
                        {BENEFICIOS.map((b) => (
                            <div className="col-12 col-md-4" key={b.titulo}>
                                <Beneficio icono={b.icono} titulo={b.titulo} texto={b.texto} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
export default Inicio
