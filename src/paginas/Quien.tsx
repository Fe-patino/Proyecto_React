import CardPersona from "../componentes/moleculas/CardPersona"


function Quien() {
  
  const equipo = [
    { nombre: 'Carla Muñoz', rol: 'Administradora', foto: '/img/carlamunoz.png' },
    { nombre: 'María Pérez', rol: 'Operadora de llamadas', foto: '/img/mariaperez.png' },
    { nombre: 'Juan Soto', rol: 'Repartidor', foto: '/img/juansoto.png' },
    { nombre: 'Pedro Ramírez', rol: 'Repartidor', foto: '/img/pedroramirez.png' },
  ]

  const desarrolladores = [
    { nombre: 'Felix Patiño', rol: 'Desarrollo Frontend' },
    { nombre: 'Dylan Riquelme', rol: 'Desarrollo Frontend' },
    { nombre: 'Vicente Bravo', rol: 'Desarrollo Frontend' },
  ]

  return (
    <>
      {/* Encabezado con imagen de fondo */}
      <div
        className="text-white py-5"
        style={{
          background:
            'linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url(/img/nosotros.png) center/cover no-repeat #1e293b',
        }}
      >
        <div className="container py-4">
          <h1 className="text-white">Nosotros</h1>
          <p className="fs-5 mb-0">Una historia de más de 25 años llevando gas a los hogares de Ñuble</p>
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
                <CardPersona nombre={persona.nombre} rol={persona.rol} />
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