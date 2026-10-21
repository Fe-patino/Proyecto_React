import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [tipo, setTipo] = useState('cliente')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')

  const enviar = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (correo === '') {
      alert('Debe ingresar su correo')
      return
    }
    if (correo.length > 100) {
      alert('El correo no puede superar los 100 caracteres')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert('Ingrese un correo válido')
      return
    }
    if (contrasena === '') {
      alert('Debe ingresar su contraseña')
      return
    }
    if (contrasena.length < 4 || contrasena.length > 10) {
      alert('La contraseña debe tener entre 4 y 10 caracteres')
      return
    }
    alert('Datos ingresados correctamente')
  }

  const estiloPestana = (activa: boolean) => ({
    background: 'none',
    border: 'none',
    borderBottom: activa ? '3px solid white' : '1px solid rgba(255,255,255,0.5)',
    color: 'white',
    fontWeight: activa ? 'bold' : 'normal',
    padding: '0.5rem 0',
    cursor: 'pointer',
  })

  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: '75vh' }}>

        {/* Panel naranja con el formulario */}
        <div
          className="col-12 col-lg-4 p-4 p-lg-5 text-white"
          style={{ background: 'linear-gradient(160deg, #fb923c, #f97316 50%, #ea580c)' }}
        >
          <h2 className="text-center text-white mb-4">Iniciar Sesión</h2>

          {/* Pestañas Cliente / Administrador */}
          <div className="d-flex mb-4">
            <button
              type="button"
              className="flex-fill"
              style={estiloPestana(tipo === 'cliente')}
              onClick={() => setTipo('cliente')}
            >
              Cliente
            </button>
            <button
              type="button"
              className="flex-fill"
              style={estiloPestana(tipo === 'administrador')}
              onClick={() => setTipo('administrador')}
            >
              Administrador
            </button>
          </div>

          <form onSubmit={enviar}>
            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="correo">Email</label>
              <input
                id="correo"
                className="form-control form-control-lg"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                className="form-control form-control-lg"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between small mb-4">
              <a href="#" className="text-white">Olvidé mi contraseña</a>
              <Link to="/registro" className="text-white">¿No estás registrado?</Link>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-light rounded-pill px-5 fw-bold shadow"
                style={{ color: '#ea580c' }}
              >
                SIGUIENTE →
              </button>
            </div>
          </form>
        </div>

        {/* Panel derecho con mensaje (solo en pantallas grandes) */}
        <div
          className="col-lg-8 d-none d-lg-flex flex-column justify-content-center text-white p-5"
          style={{

            background:
            'linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url(/img/fondoLogin.png) center/cover no-repeat',
            }}
        >
          <p className="fs-4 mb-1">Tienda en línea</p>
          <h1 className="display-5 fw-bold text-white">
            Tu gas, a domicilio en Chillán y la Región de Ñuble.
          </h1>
          <p className="fs-4">Rápido, seguro y confiable desde 1998.</p>
        </div>

      </div>
    </div>
  )
}

export default Login