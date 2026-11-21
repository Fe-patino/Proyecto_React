import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guardarSesionLocal } from '../sesion'

interface LoginProps {
  alIngresar: (tipo: string, correo: string) => void
}

function Login({ alIngresar }: LoginProps) {
  const navegar = useNavigate()

  const [modo, setModo] = useState('login')
  const [tipo, setTipo] = useState('cliente')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiarModo = (nuevo: string) => {
    setModo(nuevo)
    setNombre('')
    setCorreo('')
    setContrasena('')
    setConfirmar('')
  }

  const validarCorreo = () => {
    if (correo === '') { alert('Debe ingresar su correo'); return false }
    if (correo.length > 100) { alert('El correo no puede superar los 100 caracteres'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { alert('Ingrese un correo válido'); return false }
    return true
  }

  const validarCorreoYContrasena = () => {
    if (!validarCorreo()) return false
    if (contrasena === '') { alert('Debe ingresar su contraseña'); return false }
    if (contrasena.length < 4 || contrasena.length > 20) { alert('La contraseña debe tener entre 4 y 20 caracteres'); return false }
    return true
  }

  const iniciarSesion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validarCorreoYContrasena()) return
    setCargando(true)
    try {
      const res = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password: contrasena }),
      })
      if (!res.ok) { alert('Correo o contraseña incorrectos'); return }
      const datos = await res.json()
      const rolNormalizado = datos.rol === 'ADMINISTRADOR' ? 'administrador' : 'cliente'
      guardarSesionLocal({ tipo: rolNormalizado, correo: datos.correo, nombre: datos.nombre, token: datos.token })
      alIngresar(rolNormalizado, datos.correo)
      if (rolNormalizado === 'administrador') navegar('/admin')
      else navegar('/')
    } catch {
      alert('No se pudo conectar al servidor. Verifica que el backend esté corriendo.')
    } finally {
      setCargando(false)
    }
  }

  const registrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (nombre.trim() === '') { alert('Debe ingresar su nombre'); return }
    if (nombre.trim().length < 3) { alert('El nombre debe tener al menos 3 caracteres'); return }
    if (nombre.length > 50) { alert('El nombre no puede superar los 50 caracteres'); return }
    if (!validarCorreoYContrasena()) return
    if (confirmar === '') { alert('Debe confirmar su contraseña'); return }
    if (confirmar !== contrasena) { alert('Las contraseñas no coinciden'); return }
    setCargando(true)
    try {
      const res = await fetch('http://localhost:8082/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password: contrasena }),
      })
      if (!res.ok) { alert('El correo ya está registrado'); return }
      alert('Registro realizado correctamente. Ahora inicia sesión.')
      cambiarModo('login')
    } catch {
      alert('No se pudo conectar al servidor. Verifica que el backend esté corriendo.')
    } finally {
      setCargando(false)
    }
  }

  const recuperar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validarCorreo()) return
    alert('Te enviamos las instrucciones para restablecer tu contraseña')
    cambiarModo('login')
  }

  const estiloPestana = (activa: boolean) => ({
    background: 'none', border: 'none',
    borderBottom: activa ? '3px solid white' : '1px solid rgba(255,255,255,0.5)',
    color: 'white', fontWeight: activa ? 'bold' : 'normal',
    padding: '0.5rem 0', cursor: 'pointer',
  })

  const estiloEnlace = {
    background: 'none', border: 'none', color: 'white',
    textDecoration: 'underline', padding: 0, cursor: 'pointer',
  }

  const titulos: { [k: string]: string } = { login: 'Iniciar Sesión', registro: 'Crear cuenta', recuperar: 'Olvidé mi Contraseña' }
  const textosBoton: { [k: string]: string } = { login: 'SIGUIENTE →', registro: 'REGISTRARME', recuperar: 'RESTABLECER CONTRASEÑA' }

  return (
    <div className="container-fluid p-0 d-flex" style={{ flex: 1, background: 'linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url(/img/fondoLogin.png) center/cover no-repeat' }}>
      <div className="row g-0 w-100">
        <div className="col-12 col-lg-4 p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(160deg, #fb923c, #f97316 50%, #ea580c)' }}>
          <h2 className="text-center text-white mb-4">{titulos[modo]}</h2>

          {modo === 'recuperar' && <p className="mb-4">Ingresa tu correo electrónico y te enviaremos las instrucciones para restaurar tu contraseña.</p>}

          {modo === 'login' && (
            <div className="d-flex mb-4">
              <button type="button" className="flex-fill" style={estiloPestana(tipo === 'cliente')} onClick={() => setTipo('cliente')}>Cliente</button>
              <button type="button" className="flex-fill" style={estiloPestana(tipo === 'administrador')} onClick={() => setTipo('administrador')}>Administrador</button>
            </div>
          )}

          <form onSubmit={modo === 'login' ? iniciarSesion : modo === 'registro' ? registrar : recuperar}>
            {modo === 'registro' && (
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="nombre">Nombre completo</label>
                <input id="nombre" className="form-control form-control-lg" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="correo">Email</label>
              <input id="correo" className="form-control form-control-lg" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </div>
            {modo !== 'recuperar' && (
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="contrasena">Contraseña</label>
                <input id="contrasena" type="password" className="form-control form-control-lg" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
              </div>
            )}
            {modo === 'registro' && (
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="confirmar">Confirmar contraseña</label>
                <input id="confirmar" type="password" className="form-control form-control-lg" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
              </div>
            )}
            {modo === 'login' && (
              <div className="d-flex justify-content-between small mb-4">
                <button type="button" style={estiloEnlace} onClick={() => cambiarModo('recuperar')}>Olvidé mi contraseña</button>
                <button type="button" style={estiloEnlace} onClick={() => cambiarModo('registro')}>¿No estás registrado?</button>
              </div>
            )}
            {modo === 'registro' && (
              <div className="small mb-4">
                <button type="button" style={estiloEnlace} onClick={() => cambiarModo('login')}>¿Ya tienes cuenta? Inicia sesión</button>
              </div>
            )}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-light rounded-pill px-5 fw-bold shadow" style={{ color: '#ea580c' }} disabled={cargando}>
                {cargando ? 'Cargando...' : textosBoton[modo]}
              </button>
            </div>
            {modo !== 'login' && (
              <div className="text-center mt-3">
                <button type="button" className="btn btn-outline-light rounded-pill px-5 fw-bold" onClick={() => cambiarModo('login')}>← VOLVER</button>
              </div>
            )}
          </form>
        </div>

        <div className="col-lg-8 d-none d-lg-flex flex-column justify-content-center text-white p-5">
          <p className="fs-4 mb-1">Tienda en línea</p>
          <h1 className="display-5 fw-bold text-white">Tu gas, a domicilio en Chillán y la Región de Ñuble.</h1>
          <p className="fs-4">Rápido, seguro y confiable desde 1998.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
