import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Nav from "./Components/Nav";
import Loading from "./Components/Loading";
import Error from "./Components/Error";

import Main from "./Components/Main";
import Signup from "./Home/SignIn";
import Login from "./Home/Login";
import Upload from "./Home/Upload";
import Feed from "./Home/Feed";
import Post from "./Home/Post";
import Explore from "./Home/Explore";
import Perfil from "./Home/Perfil";
import ContactForm from "./Home/contactForm";
import { initAxiosInterceptors } from "./Components/actions/auth-helpers";
import { UsuarioProvider, useUsuario } from "./Components/actions-user/usuario-context";

initAxiosInterceptors();

export default () => (
	<UsuarioProvider>
		<App></App>
	</UsuarioProvider>
);

function App() {
	const { cargandoUsuario, usuario, login, signup, logout } = useUsuario();
	const [error, setError] = useState(null);

	function mostrarError(mensaje) {
		setError(mensaje);
	}

	function esconderError() {
		setError(null);
	}

	if (cargandoUsuario) {
		return (
			<Main center>
				<Loading />
			</Main>
		);
	}

	return (
		<Router>
			<Nav usuario={usuario} />
			<Error mensaje={error} esconderError={esconderError} />
			{usuario ? (
				<LoginRoutes
					mostrarError={mostrarError}
					usuario={usuario}
					logout={logout}
				/>
			) : (
				<LogoutRoutes
					login={login}
					signup={signup}
					mostrarError={mostrarError}
				/>
			)}
		</Router>
	);
}

function LoginRoutes({ mostrarError, usuario, logout }) {
	return (
		<Switch>
			<Route
				path="/upload"
				render={(props) => <Upload {...props} mostrarError={mostrarError} />}
			></Route>
			<Route
				path="/post/:id"
				render={(props) => (
					<Post {...props} mostrarError={mostrarError} usuario={usuario} />
				)}
			></Route>
			<Route
				path="/explore/"
				render={(props) => (
					<Explore {...props} mostrarError={mostrarError} usuario={usuario} />
				)}
			></Route>
			<Route
				path="/perfil/:username"
				render={(props) => (
					<Perfil
						{...props}
						mostrarError={mostrarError}
						usuario={usuario}
						logout={logout}
					/>
				)}
			></Route>
			<Route
				path="/"
				component={(props) => (
					<Feed {...props} mostrarError={mostrarError} default />
				)}
			></Route>
		</Switch>
	);
}

function LogoutRoutes({ login, signup, mostrarError }) {
	return (
		<Switch>
			<Route
				path="/login"
				render={(props) => (
					<Login {...props} login={login} mostrarError={mostrarError} />
				)}
			></Route>
			<Route
				path="/ContactForm"
				render={(props) => (
					<ContactForm {...props} login={login} mostrarError={mostrarError} />
				)}
			></Route>
			<Route
				default
				exact
				render={(props) => (
					<Signup {...props} signup={signup} mostrarError={mostrarError} />
				)}
			></Route>
		</Switch>
	);
}
