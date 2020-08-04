import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import BotonLike from "./BotonHobby";
import Comentar from "./Comentar";
import { toggleLike, comentar } from "./actions/post-helpers";
import { useUsuario } from "./actions-user/usuario-context";

export default function Post({ post, actualizarPost, mostrarError,}) {
    const { usuario } = useUsuario();
    const [enviandoLike, setEnviandoLike] = useState(false);
    const {
        numLikes,
        numComentarios,
        comentarios,
        _id,
        caption, 
        url,
        usuario: usuarioDePost,
        estaLike
    } = post;

    async function onSubmitLike() {
        if(enviandoLike) {
            return;
        }

        try {
            setEnviandoLike(true);
            const postActualizado = await toggleLike(post);
            actualizarPost(post,postActualizado);
            setEnviandoLike(false);
        } catch (error) {
            setEnviandoLike(false);
            mostrarError('Hubo un problema modificando el like, Intenta de nuevo');
            console.log(error);
        }
    }

    async function onSubmitComentario(mensaje) {
        const postActualizado = await comentar(post, mensaje, usuario);
        actualizarPost(post, postActualizado);
    }

    return (
        <div className="Post-Componente">
            <Avatar usuario={usuarioDePost}/>
            <img src={url} alt={caption} className="Post-Componente__img"/>
            <div className="Post-Componente__acciones">
                <div className="Post-Componente__like-container">
                    <BotonLike onSubmitLike={() => onSubmitLike()} like={estaLike} />
                </div>
                <p>My Hobby de {numLikes} personas</p>
                <ul>
                    <li>
                        <Link to={`/perfil/${usuarioDePost.username}`}>
                            <b>{usuarioDePost.username + ' '}</b>
                        </Link>
                        {caption}
                    </li>
                    <VerTodosLosComentarios _id={_id} numComentarios={numComentarios} />
                    <Comentarios comentarios={comentarios}/>
                </ul>
            </div>
            <Comentar onSubmitComentario={onSubmitComentario} mostrarError={mostrarError} />
        </div>
    )
}

function VerTodosLosComentarios({_id, numComentarios}) {
    if(numComentarios < 4) {
        return null;
    }

    return <li className="text-grey-dark">
        <Link to={`/post/${_id}`}>
            Ver los {numComentarios} comentarios
        </Link>
    </li>
}

function Comentarios({comentarios}) {
    if (comentarios.length === 0) {
        return null;
    }

    return comentarios.map((comentario) => {
        return (
            <li key={comentario._id}>
                <Link to={`/perfil/${comentario.usuario.username}`}>
                    <b>{comentario.usuario.username + ' '}</b>
                </Link>
                {comentario.mensaje}
            </li>
        )
    })
}