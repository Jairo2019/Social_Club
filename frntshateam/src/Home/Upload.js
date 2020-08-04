import React, { useState } from "react";
import Main from "../Components/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Components/Loading";
import Axios from "axios";

export default function Upload({ history, mostrarError }) {
    const [imagenUrl, setImagenUrl] = useState("");
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [enviandoPost, setEnviandoPost] = useState(false);
    const [caption, setCaption ] = useState('')

    async function handleImagenSeleccionada(e) {
        try {
        setSubiendoImagen(true);
        const file = e.target.files[0];
        const config = {
            headers: {
            "Content-Type": file.type,
            },
        };
        const { data } = await Axios.post("/api/posts/upload", file, config);
        setImagenUrl(data.url);
        setSubiendoImagen(false);
        } catch (error) {
        setSubiendoImagen(false);
        mostrarError(error?.response?.data);
        console.log(error);
        }
    }

    async function handleSubmit(evento) {
        evento.preventDefault();

        if(enviandoPost) {
            return;
        } else if(subiendoImagen) {
            mostrarError('No sae ha terminado de subir la imagen');
            return;
        } else if(!imagenUrl) {
            mostrarError('Primero selecciona una imagen');
            return;
        }

        try {
            setEnviandoPost(true);
            const body = {
                caption,
                url: imagenUrl
            };
            await Axios.post('/api/posts', body);
            setEnviandoPost(false);
            history.push('/')
        } catch (error) {
            mostrarError(error?.response?.data);
        }
    }

    return (
        <Main center>
        <div className="Upload">
            <form onSubmit={handleSubmit}>
            <div className="Upload__image-section">
                <SeccionSubirImagen
                subiendoImagen={subiendoImagen}
                imagenUrl={imagenUrl}
                handleImagenSeleccionada={handleImagenSeleccionada}
                />
            </div>
            <textarea
                name="caption"
                className="Upload__caption"
                required
                maxLength="180"
                placeholder="Escribe un comentario."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            ></textarea>
            <button className="Upload__submit" type="submit">
                Publicar
            </button>
            </form>
        </div>
        </Main>
    );
}

function SeccionSubirImagen({
  subiendoImagen,
  imagenUrl,
  handleImagenSeleccionada,
}) {
    if (subiendoImagen) {
        return <Loading />;
    } else if (imagenUrl) {
        return <img src={imagenUrl} />;
    } else {
        return (
        <label className="Upload__image-label">
            <FontAwesomeIcon icon={faUpload} />
            <span>Publica una foto</span>
            <input
            type="file"
            className="hidden"
            name="imagen"
            onChange={handleImagenSeleccionada}
            />
        </label>
        );
    }
}
