import CardPersona from '../componentes/moleculas/CardPersona'

function Quien() {
  const equipo = [
    { nombre: 'Carla Muñoz', rol: 'Administradora', foto: '/img/carlamunos.png' },
    { nombre: 'María Pérez', rol: 'Operadora de llamadas', foto: '/img/mariaPerez.png' },
    { nombre: 'Juan Soto', rol: 'Repartidor', foto: '/img/juanSoto.png' },
    { nombre: 'Pedro Ramírez', rol: 'Repartidor', foto: '/img/pedroRamirez.png' },
  ]

  const desarrolladores = [
    { nombre: 'Felix Patiño', rol: 'Desarrollo Frontend' },
    { nombre: 'Dylan Riquelme', rol: 'Desarrollo Frontend' },
    { nombre: 'Vicente Bravo', rol: 'Desarrollo Frontend' },
  ]

  return (
    <>
      {/* Encabezado con imagen de fondo (igual que en el HTML original) */}
      <div
        className="d-flex align-items-center text-center"
        style={{ position: 'relative', overflow: 'hidden', minHeight: '580px' }}
      >
        <img
          src="/img/nosotros.png"
          alt="Equipo de Gas El Volcán"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            padding: '46px 0',
            background:
              'linear-gradient(90deg, rgba(26,26,42,0.85) 0%, rgba(26,26,42,0.55) 55%, rgba(26,26,42,0.15) 100%)',
          }}
        >
          <div className="container">
            <h1 className="text-white m-0">Nosotros</h1>
            <p className="mt-2 mb-0" style={{ color: '#C7C7D6' }}>
              Una historia de más de 25 años llevando gas a los hogares de Ñuble
            </p>
          </div>
        </div>
      </div>

      {/* Historia, misión y visión */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <h2>Nuestra historia</h2>
            <p>
              Distribuidora de Gas El Volcán es una empresa familiar ubicada en Chillán, Región de Ñuble, fundada en 1998.
              Desde entonces distribuimos cilindros de gas licuado a domicilio a clientes residenciales y comerciales en
              Chillán y comunas aledañas, recibiendo entre 80 y 120 pedidos diarios.
            </p>

            <h2 className="mt-4">Misión</h2>
            <p>
              Entregar gas licuado de forma rápida, segura y confiable a cada hogar y negocio de nuestra región,
              simplificando el proceso de pedido y despacho para nuestros clientes.
            </p>

            <h2 className="mt-4">Visión</h2>
            <p>
              Ser la distribuidora de gas de referencia en la Región de Ñuble, reconocida por la calidad de su servicio y
              por acercar la tecnología a un rubro tradicionalmente manual.
            </p>
          </div>
        </div>
      </main>

      {/* Nuestro equipo */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center">Nuestro equipo</h2>
          <p className="text-center text-muted mb-4">
            Las personas que hacen posible la entrega de tu gas todos los días.
          </p>
          <div className="row g-4">
            {equipo.map((persona) => (
              <div className="col-6 col-md-3" key={persona.nombre}>
                <CardPersona nombre={persona.nombre} rol={persona.rol} foto={persona.foto} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo desarrollador */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center">Equipo desarrollador</h2>
          <p className="text-center text-muted mb-4">
            Este sitio fue desarrollado por.
          </p>
          <div className="row g-4 justify-content-center">
            {desarrolladores.map((persona) => (
              <div className="col-6 col-md-4" key={persona.nombre}>
                <CardPersona nombre={persona.nombre} rol={persona.rol} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Quien