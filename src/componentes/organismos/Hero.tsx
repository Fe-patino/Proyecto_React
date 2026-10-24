import { Link } from "react-router-dom"
import Carousel from "react-bootstrap/Carousel"

export interface SlideHero {
    imagen: string;
    alt: string;
}

interface HeroProps {
    slides: SlideHero[];
    titulo: string;
    subtitulo: string;
    texto: string;
    textoBoton: string;
    enlace: string;
}

// Organismo: portada con carrusel de imágenes y el mensaje principal por encima.
// Usa el componente Carousel de react-bootstrap (cambia solo cada 5 segundos).
function Hero({ slides, titulo, subtitulo, texto, textoBoton, enlace }: HeroProps) {
    return (
        <section className="position-relative" aria-label="Portada">
            <Carousel fade interval={5000}>
                {slides.map((slide) => (
                    <Carousel.Item key={slide.imagen}>
                        <img className="d-block w-100 carrusel-img" src={slide.imagen} alt={slide.alt} />
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Capa oscura con el texto. No bloquea los clics del carrusel (solo el contenido los recibe) */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
                style={{ background: "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.5) 100%)", pointerEvents: "none" }}
            >
                <div className="container">
                    {/* ps-5: deja libre el borde donde está la flecha izquierda del carrusel */}
                    <div className="text-white col-12 col-md-8 col-lg-6 ps-5">
                        {/* Solo el contenido recibe clics (y queda por encima de las flechas), así el botón siempre funciona */}
                        <div style={{ pointerEvents: "auto", position: "relative", zIndex: 3, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                            <h1 className="display-6 fw-bold text-white">{titulo}</h1>
                            <h2 className="h5 text-white">{subtitulo}</h2>
                            <p className="d-none d-sm-block">{texto}</p>
                            <Link to={enlace} className="btn btn-primary btn-lg">{textoBoton}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Hero
