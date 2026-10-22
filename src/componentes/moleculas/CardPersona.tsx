interface CardPersonaProps {
  nombre: string
  rol: string
  foto?: string
}

function CardPersona({ nombre, rol, foto }: CardPersonaProps) {
  // Iniciales para el avatar: "Carla Muñoz" -> "CM"
  const iniciales = nombre
    .split(' ')
    .map((palabra) => palabra[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="text-center">
      {foto ? (
        <img
          src={foto}
          alt={nombre}
          className="rounded-circle mx-auto d-block mb-3"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
      ) : (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-4"
          style={{ width: '120px', height: '120px', backgroundColor: '#f97316' }}
        >
          {iniciales}
        </div>
      )}
      <h5 className="mb-1">{nombre}</h5>
      <p className="text-muted mb-0">{rol}</p>
    </div>
  )
}

export default CardPersona