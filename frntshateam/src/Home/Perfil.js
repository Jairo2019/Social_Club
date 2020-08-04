import React, { useState, useEffect } from "react";
import Main from "../Components/Main";
import Axios from "axios";

import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import Grid from "../Components/Grid";
import RecursoNoExiste from "../Components/RecursoNoExiste";
import stringToColor from "string-to-color";
import toggleSiguiendo from "../Components/actions/amistad-helpers";
import useEsMobil from "../hooks/useEsMobil";

export default function Perfil({ mostrarError, usuario, match, logout }) {
	const username = match.params.username;
	const [usuarioDuenoDelPerfil, setUsuarioDuenoDelPerfil] = useState(null);
	const [posts, setPosts] = useState([]);
	const [subiendoImagen, setSubiendoImagen] = useState(false);
	const [cargandoPerfil, setCargandoPerfil] = useState(true);
	const [perfilNoExiste, setPerfilNoExiste] = useState(false);
	const [enviandoAmistad, setEnviandoAmistad] = useState(false);
	const esMobil = useEsMobil();

	useEffect(() => {
		async function cargarPostsYUsuario() {
			try {
				setCargandoPerfil(true);
				const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);
				const { data: posts } = await Axios.get(
					`/api/posts/usuario/${usuario._id}`
				);
				setUsuarioDuenoDelPerfil(usuario);
				setPosts(posts);
				setCargandoPerfil(false);
			} catch (error) {
				if (
					error?.response?.response === 404 ||
					error?.response?.response === 400
				) {
					setPerfilNoExiste(true);
				} else {
					mostrarError("Hubo un problema cargando este perfil");
				}
				setCargandoPerfil(false);
			}
		}

		cargarPostsYUsuario();
	}, [username]);

	function esElPerfilDeLaPersonaLogin() {
		return usuario._id === usuarioDuenoDelPerfil._id;
	}

	async function handleImagenSeleccionada(event) {
		try {
			setSubiendoImagen(true);
			const file = event.target.files[0];
			const config = {
				headers: {
					"Content-Type": file.type,
				},
			};
			const { data } = await Axios.post("/api/usuarios/upload", file, config);
			setUsuarioDuenoDelPerfil({ ...usuarioDuenoDelPerfil, imagen: data.url });
			setSubiendoImagen(false);
		} catch (error) {
			mostrarError(error?.response?.data ?? "No se pudo subir la imagne");
			setSubiendoImagen(false);
			console.log(error);
		}
	}

	async function onToggleSiguiendo() {
		if (enviandoAmistad) {
			return;
		}

		try {
			setEnviandoAmistad(true);
			const usuariActualizado = await toggleSiguiendo(usuarioDuenoDelPerfil);
			setUsuarioDuenoDelPerfil(usuariActualizado);
			setEnviandoAmistad(false);
		} catch (error) {
			mostrarError(
				"Hubo un problema siguiendo/dejando de seguir a este usuario, Intenta de nuevo"
			);
			setEnviandoAmistad(false);
			console.log(error);
		}
	}

	if (cargandoPerfil) {
		return (
			<Main center>
				<Loading />
			</Main>
		);
	}

	if (perfilNoExiste) {
		return (
			<RecursoNoExiste mensaje="El perfil que estas cargando, no existe" />
		);
	}

	if (usuario == null) {
		return null;
	}

	return (
		<Main>
			<div className="Perfil">
				<ImagenAvatar
					esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin}
					usuarioDuenoDelPerfil={usuarioDuenoDelPerfil}
					handleImagenSeleccionada={handleImagenSeleccionada}
					subiendoImagen={subiendoImagen}
				/>
				<div className="Perfil__bio-container">
					<div className="Perfil__bio-heading">
						<h2 className="capitalize">{usuarioDuenoDelPerfil.username}</h2>
						{!esElPerfilDeLaPersonaLogin() && (
							<BotonSeguir
								siguiendo={usuarioDuenoDelPerfil.siguiendo}
								toggleSiguiendo={onToggleSiguiendo}
							/>
						)}
						{esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout} />}
					</div>
					{!esMobil && (
						<DescripcionPerfil usuarioDuenoDelPerfil={usuarioDuenoDelPerfil} />
					)}
                    <div className="Perfil__separador"></div>
                    {posts.length > 0 ? <Grid posts={posts}  /> : <NoHaPosteado/>}
				</div>
			</div>
		</Main>
	);
}

function DescripcionPerfil({ usuarioDuenoDelPerfil }) {
	return (
		<div className="Perfil__descripcion">
			<h2 className="Perfil__nombre">{usuarioDuenoDelPerfil.nombre}</h2>
			<p>{usuarioDuenoDelPerfil.bio}</p>
			<p className="Perfil__estadisticas">
				<b>{usuarioDuenoDelPerfil.numSiguiendo}</b> following
				<span className="ml-4">
					<b>{usuarioDuenoDelPerfil.numSeguidores}</b> followers
				</span>
			</p>
		</div>
	);
}

function ImagenAvatar({
	esElPerfilDeLaPersonaLogin,
	usuarioDuenoDelPerfil,
	handleImagenSeleccionada,
	subiendoImagen,
}) {
	let contenido;

	if (subiendoImagen) {
		contenido = <Loading />;
	} else if (esElPerfilDeLaPersonaLogin) {
		contenido = (
			<label
				className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
				style={{
					backgroundImage: usuarioDuenoDelPerfil.imagen
						? `url(${usuarioDuenoDelPerfil.imagen})`
						: null,
					backgroundColor: stringToColor(usuarioDuenoDelPerfil.username),
				}}
			>
				<input
					type="file"
					className="hidden"
					onChange={handleImagenSeleccionada}
					name="imagen"
				/>
			</label>
		);
	} else {
		contenido = (
			<div
				className="Perfil__image-placeholder"
				style={{
					backgroundImage: usuarioDuenoDelPerfil.imagen
						? `url(${usuarioDuenoDelPerfil.imagen})`
						: null,
					backgroundColor: stringToColor(usuarioDuenoDelPerfil.username),
				}}
			/>
		);
	}

	return <div className="Perfil__img-container">{contenido}</div>;
}

function BotonSeguir({ siguiendo, toggleSiguiendo }) {
	return (
		<button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
			{siguiendo ? "Dejar de seguir" : "Seguir"}
		</button>
	);
}

function BotonLogout({ logout }) {
	return (
		<button className="Perfil__boton-logout" onClick={logout}>
			Salir
		</button>
	);
}

function NoHaPosteado() {
    return <p className="text-center">Este usuario no ha Publicado fotos de sus Hobbys</p>
}