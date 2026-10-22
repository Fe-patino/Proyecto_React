import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  alIngresar: (tipo: string) => void
}

function Login({ alIngresar }: LoginProps) {
  const navegar = useNavigate()

  // "login" inicio de sesión, "registro" cuenta nueva, "recuperar" olvidé mi contraseña
  const [modo, setModo] = useState('login')
  const [tipo, setTipo] = useState('cliente')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmar, setConfirmar] = useState('')

  const cambiarModo = (nuevo: string) => {
    setModo(nuevo)
    setNombre('')
    setCorreo('')
    setContrasena('')
    setConfirmar('')
  }

  // Valida solo el correo. Devuelve true si está bien.
  const validarCorreo = () => {
    if (correo === '') {
      alert('Debe ingresar su correo')
      return false
    }
    if (correo.length > 100) {
      alert('El correo no puede superar los 100 caracteres')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert('Ingrese un correo válido')
      return false
    }
    return true
  }

  // Valida correo y contraseña (login y registro)
  const validarCorreoYContrasena = () => {
    if (!validarCorreo()) return false
    if (contrasena === '') {
      alert('Debe ingresar su contraseña')
      return false
    }
    if (contrasena.length < 4 || contrasena.length > 10) {
      alert('La contraseña debe tener entre 4 y 10 caracteres')
      return false
    }
    return true
  }

  const iniciarSesion = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validarCorreoYContrasena()) return
    alert('Datos ingresados correctamente')

    // Guarda quién ingresó y lo lleva a su página
    alIngresar(tipo)
    if (tipo === 'administrador') {
      navegar('/admin')
    } else {
      navegar('/')
    }
  }

  const registrar = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (nombre.trim() === '') {
      alert('Debe ingresar su nombre')
      return
    }
    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres')
      return
    }
    if (nombre.length > 50) {
      alert('El nombre no puede superar los 50 caracteres')
      return
    }
    if (!validarCorreoYContrasena()) return
    if (confirmar === '') {
      alert('Debe confirmar su contraseña')
      return
    }
    if (confirmar !== contrasena) {
      alert('Las contraseñas no coinciden')
      return
    }
    alert('Registro realizado correctamente')
    cambiarModo('login')
  }

  const recuperar = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validarCorreo()) return
    alert('Te enviamos las instrucciones para restablecer tu contraseña')
    cambiarModo('login')
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

  const estiloEnlace = {
    background: 'none',
    border: 'none',
    color: 'white',
    textDecoration: 'underline',
    padding: 0,
    cursor: 'pointer',
  }

  const titulos: { [clave: string]: string } = {
    login: 'Iniciar Sesión',
    registro: 'Crear cuenta',
    recuperar: 'Olvidé mi Contraseña',
  }

  const textosBoton: { [clave: string]: string } = {
    login: 'SIGUIENTE →',
    registro: 'REGISTRARME',
    recuperar: 'RESTABLECER CONTRASEÑA',
  }

  const funciones: { [clave: string]: (e: React.SubmitEvent<HTMLFormElement>) => void } = {
    login: iniciarSesion,
    registro: registrar,
    recuperar: recuperar,
  }

  return (
    <div
      className="container-fluid p-0 d-flex"
      style={{
        flex: 1,
        background:
          'linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url(/img/fondoLogin.png) center/cover no-repeat',
      }}
    >
      <div className="row g-0 w-100">

        {/* Panel naranja con el formulario */}
        <div
          className="col-12 col-lg-4 p-4 p-lg-5 text-white"
          style={{ background: 'linear-gradient(160deg, #fb923c, #f97316 50%, #ea580c)' }}
        >
          <h2 className="text-center text-white mb-4">{titulos[modo]}</h2>

          {/* Texto de ayuda (solo al recuperar la contraseña) */}
          {modo === 'recuperar' && (
            <p className="mb-4">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restaurar tu contraseña.
            </p>
          )}

          {/* Pestañas Cliente / Administrador (solo al iniciar sesión) */}
          {modo === 'login' && (
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
          )}

          <form onSubmit={funciones[modo]}>

            {/* Nombre: solo en el registro */}
            {modo === 'registro' && (
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  className="form-control form-control-lg"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="correo">Email</label>
              <input
                id="correo"
                className="form-control form-control-lg"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            {/* Contraseña: en login y registro */}
            {modo !== 'recuperar' && (
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
            )}

            {/* Confirmar contraseña: solo en el registro */}
            {modo === 'registro' && (
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="confirmar">Confirmar contraseña</label>
                <input
                  id="confirmar"
                  type="password"
                  className="form-control form-control-lg"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                />
              </div>
            )}

            {/* Enlaces: en login y registro */}
            {modo === 'login' && (
              <div className="d-flex justify-content-between small mb-4">
                <button type="button" style={estiloEnlace} onClick={() => cambiarModo('recuperar')}>
                  Olvidé mi contraseña
                </button>
                <button type="button" style={estiloEnlace} onClick={() => cambiarModo('registro')}>
                  ¿No estás registrado?
                </button>
              </div>
            )}
            {modo === 'registro' && (
              <div className="small mb-4">
                <button type="button" style={estiloEnlace} onClick={() => cambiarModo('login')}>
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            )}

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-light rounded-pill px-5 fw-bold shadow"
                style={{ color: '#ea580c' }}
              >
                {textosBoton[modo]}
              </button>
            </div>

            {/* Botón volver: en registro y recuperar, regresa al formulario principal */}
            {modo !== 'login' && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-outline-light rounded-pill px-5 fw-bold"
                  onClick={() => cambiarModo('login')}
                >
                  ← VOLVER
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Panel derecho con mensaje (transparente: deja ver la imagen de fondo) */}
        <div className="col-lg-8 d-none d-lg-flex flex-column justify-content-center text-white p-5">
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