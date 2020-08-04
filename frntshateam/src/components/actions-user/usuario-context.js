import React, { useState, useEffect, useMemo } from "react";
import {
	setToken,
	deleteToken,
	getToken,
} from "../actions/auth-helpers";
import Axios from "axios";

const UsuarioContext = React.createContext();

export function UsuarioProvider(props) {
	const [usuario, setUsuario] = useState(null); // no sabes si hay un usuario autenticado
	const [cargandoUsuario, setCargandoUsuario] = useState(true);

	useEffect(() => {
		async function cargarUsuario() {
			let token = getToken();
			if (!token) {
				setCargandoUsuario(false);
				return;
			}
			try {
				const { data: usuario } = await Axios.get("/api/usuarios/whoami");
				setUsuario(usuario);
				setCargandoUsuario(false);
			} catch (err) {
				console.log("err", err);
			}
		}

		cargarUsuario();
	}, []);

	async function login(email, password) {
		const { data } = await Axios.post("/api/usuarios/login", {
			email,
			password,
		}); //data.usaurio data.token
		setUsuario(data.usuario);
		setToken(data.token);
	}

	async function signup(usuario) {
		const { data } = await Axios.post("/api/usuarios/signup", usuario);
		setUsuario(data.usuario);
		setToken(data.token);
	}

	function logout() {
		console.log("logout");
		setUsuario(null);
		deleteToken();
    }
    
    const value = useMemo( () => {
        return ({
            usuario,
            cargandoUsuario,
            signup,
            login,
            logout
        })
    }, [usuario, cargandoUsuario]);

    return <UsuarioContext.Provider value={value} {...props} />
}

export function useUsuario() {
    const context = React.useContext(UsuarioContext);
    if(!context) {
        throw new Error('useUsuario debe estar dentro del proveedor UsuarioContext');
    }
    return context;
}
