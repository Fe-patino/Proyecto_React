import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-1">Bienvenido</h2>
              <p className="text-center text-muted mb-4">
                Ingresa a tu cuenta de Gas El Volcán
              </p>

              <form onSubmit={enviar}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="correo">Correo electrónico</label>
                  <input
                    id="correo"
                    className="form-control form-control-lg"
                    placeholder="tucorreo@ejemplo.cl"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label" htmlFor="contrasena">Contraseña</label>
                  <input
                    id="contrasena"
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Ingresa tu contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                </div>

                <div className="text-end mb-4">
                  <a href="#" className="small">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Iniciar sesión
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login