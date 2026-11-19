import { useState } from "react"
import { leerSesion } from "../../sesion"

interface Props {
  total: number
  alPagarExitoso: () => void
  alCancelar: () => void
}

function FormularioPago({ total, alPagarExitoso, alCancelar }: Props) {
  const sesion = leerSesion()
  const [nombre, setNombre] = useState(sesion?.nombre ?? "")
  const [correo, setCorreo] = useState(sesion?.correo ?? "")
  const [digitos, setDigitos] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarPago = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (nombre.trim() === "") { alert("Debe ingresar su nombre"); return }
    if (correo.trim() === "") { alert("Debe ingresar su correo"); return }
    if (!/^\d{4}$/.test(digitos)) { alert("Ingrese los últimos 4 dígitos de su tarjeta"); return }

    setCargando(true)
    try {
      const res = await fetch("http://localhost:8085/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCliente: nombre,
          correoCliente: correo,
          total: total,
          ultimosDigitos: digitos,
          estado: "COMPLETADO",
        }),
      })
      if (!res.ok) throw new Error("Error al registrar pago")
      alPagarExitoso()
    } catch {
      alert("No se pudo registrar el pago. Verifica que el servidor esté corriendo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-12 col-md-6">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h4 className="fw-bold mb-1">Datos de pago</h4>
          <p className="text-muted mb-4">Total a pagar: <strong className="text-dark">${total.toLocaleString("es-CL")}</strong></p>

          <form onSubmit={manejarPago}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                className="form-control"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="juan@correo.com"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Últimos 4 dígitos de la tarjeta</label>
              <input
                className="form-control"
                maxLength={4}
                value={digitos}
                onChange={(e) => setDigitos(e.target.value.replace(/\D/, ""))}
                placeholder="1234"
              />
              <small className="text-muted">Solo para identificar el medio de pago</small>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-50 fw-bold"
                onClick={alCancelar}
              >
                ← Volver
              </button>
              <button
                type="submit"
                className="btn w-50 text-white fw-bold"
                style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "Confirmar pago"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormularioPago