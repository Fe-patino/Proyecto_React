import { useState } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";

function FormularioContacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nombre.trim() === "") {
      alert("Debe ingresar su nombre");
      return;
    }
    if (correo.trim() === "") {
      alert("Debe ingresar su correo");
      return;
    }
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(correo)) {
      alert("Ingrese un correo válido");
      return;
    }
    if (mensaje.trim() === "") {
      alert("Debe ingresar un mensaje");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("http://localhost:8083/api/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCompleto: nombre,
          correo: correo,
          mensaje: mensaje,
        }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      alert("¡Mensaje enviado correctamente! Pronto nos pondremos en contacto.");
      setNombre("");
      setCorreo("");
      setMensaje("");
    } catch {
      alert("No se pudo enviar el mensaje. Verifica que el servidor esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoFormulario
        etiqueta="Nombre Completo"
        tipo="text"
        nombre="nombre"
        valor={nombre}
        alCambiar={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
      />

      <CampoFormulario
        etiqueta="Correo Electrónico"
        tipo="email"
        nombre="correo"
        valor={correo}
        alCambiar={(e: React.ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
      />

      <div className="mb-3 text-start">
        <label htmlFor="mensaje" className="form-label fw-semibold text-dark">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          className="form-control"
          rows={4}
          placeholder="Escribe tu mensaje aquí..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        ></textarea>
      </div>

      <button
        type="submit"
        data-testid="boton-enviar"
        className="btn w-100 text-white fw-bold"
        style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
        disabled={cargando}
      >
        {cargando ? "Enviando..." : "Enviar Mensaje"}
      </button>
    </form>
  );
}

export default FormularioContacto;