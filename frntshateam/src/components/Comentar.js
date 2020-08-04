import React, { useState } from "react";

export default function Comentar({ onSubmitComentario, mostrarError }) {
  const [mensaje, setMensaje] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  async function onSubmit(e) {
      e.preventDefault();

      if(enviandoComentario) {
        return;
      }

      try {
        setEnviandoComentario(true);
        onSubmitComentario(mensaje);
        setMensaje('');
        setEnviandoComentario(false);
      } catch (error) {
        setEnviandoComentario(false);
        mostrarError('Hubo un problema guardando el comentario, intente de nuevo.')
      }
  }


  return (
    <form className="Post__comentario-form-container" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Deja un comentario... "
        required
        maxLength="180"
        value={mensaje}
        onSubmit={onSubmitComentario}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button type="submit">Comentar</button>
    </form>
  );
}
