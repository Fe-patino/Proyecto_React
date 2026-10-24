interface BeneficioProps {
    icono: string;
    titulo: string;
    texto: string;
}

// Molécula: ícono + título + descripción (sección "¿Por qué elegirnos?")
function Beneficio({ icono, titulo, texto }: BeneficioProps) {
    return (
        <div className="text-center px-3">
            <div className="fs-1 mb-2" aria-hidden="true">{icono}</div>
            <h3 className="h5">{titulo}</h3>
            <p className="text-secondary">{texto}</p>
        </div>
    )
}
export default Beneficio
