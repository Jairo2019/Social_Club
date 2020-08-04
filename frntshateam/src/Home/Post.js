import React, { useState, useEffect } from "react";
import Main from "../Components/Main";
import { Link } from "react-router-dom";
import Avatar from "../Components/Avatar";
import Comentar from "../Components/Comentar";
import BotonHobby from "../Components/BotonHobby";
import Axios from "axios";
import Loading from "../Components/Loading";
import RecursoNoExiste from "../Components/RecursoNoExiste";
import { toggleLike, comentar } from "../Components/actions/post-helpers";

export default function PostVista({ mostrarError, match, usuario }) {
  const postId = match.params.id;
  const [enviandoLike, setEnviandoLike] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postNoExiste, setPostNoExiste] = useState(false);

  useEffect(() => {
    async function cargarPost() {
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`);
        setPost(post);
        setLoading(false);
      } catch (error) {
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 400
        ) {
          setPostNoExiste(true);
        } else {
          mostrarError("Hubo un problema cargando este post.");
        }
        setLoading(false);
      }
    }

    cargarPost();
  }, [postId]);

  async function onSubmitLike() {
    if(enviandoLike) {
        return;
    }

    try {
        setEnviandoLike(true);
        const postActualizado = await toggleLike(post);
        setPost(postActualizado);
        setEnviandoLike(false);
    } catch (error) {
        setEnviandoLike(false);
        mostrarError('Hubo un problema modificando el like, Intenta de nuevo');
        console.log(error);
    }
}

async function onSubmitComentario(mensaje) {
    const postActualizado = await comentar(post, mensaje, usuario);
    setPost(postActualizado);
}


  if (loading) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (postNoExiste) {
    return (
      <RecursoNoExiste mensaje="El post que estas intentando ver no existe" />
    );
  }

  if (post === null) {
    return null;
  }

  return (
    <Main center>
      <Post {...post} onSubmitComentario={onSubmitComentario} onSubmitLike={onSubmitLike} />
    </Main>
  );
}

function Post({
  comentarios,
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubmitComentario,
}) {
  return (
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt={caption} />
      </div>
      <div className="Post__side-bar">
        <Avatar usuario={usuario}></Avatar>
        <div className="Post__comentarios-y-like">
          <Comentarios
            usuario={usuario}
            caption={caption}
            comentarios={comentarios}
          />
          <div className="Post__like">
            <BotonHobby onSubmitLike={onSubmitLike} like={estaLike}></BotonHobby>
          </div>
          <Comentar onSubmitComentario={onSubmitComentario}></Comentar>
        </div>
      </div>
    </div>
  );
}

function Comentarios({ usuario, caption, comentarios }) {
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario">
        <Link
          to={`/perfil/${usuario.username}`}
          className="Post__autor-comentario"
        >
            <b>{usuario.username + ' '}</b> 
        </Link>
        {caption}
      </li>
      {comentarios.map((comentario) => (
        <li className="Post__comentario" key={comentario._id}>
          <Link
            to={`/perfil/${comentario.usuario.username}`}
            className="Post__autor-comentario"
          >
              <b>{comentario.usuario.username + ' '}</b>
          </Link>
          {comentario.mensaje}
        </li>
      ))}
    </ul>
  );
}
