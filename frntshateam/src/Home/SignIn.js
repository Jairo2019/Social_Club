import React, {useState} from "react";
import Main from "../Components/Main";
import imagenSignup from "../imagenes/signup.png";
import { Link } from 'react-router-dom'

export default function Signup({signup, mostrarError}) {
    const [usuario, setUsuario] = useState({
        email: '',
        username: '',
        password: '',
        bio: '',
        nombre: ''
    })

    function handleInputChange(e) {
        setUsuario({
            ...usuario,
            [e.target.name] : e.target.value
        })
    }

    async function handleInputSubmit(e) {
        e.preventDefault();

        try {
            await signup(usuario);
        } catch (err) {
            mostrarError(err?.response?.data?.message)
            console.log(err)
        }
    }

    return (
        <Main center={true}>
        <div className="Signup">
            <img src={imagenSignup} alt="" className="Signup__img" />
            <div className="FormContainer">
            <h1 className="Form__titulo">ShaTeam</h1>
            <p className="FormContainer__info">
                Registrate Para Explorar Hobbys
            </p>
            <form onSubmit={handleInputSubmit}>
                <input
                type="email"
                name="email"
                placeholder="Correo"
                className="Form__field"
                required
                onChange={handleInputChange}
                value={usuario.email}
                />
                <input
                type="text"
                name="nombre"
                placeholder="Nombre y Apellido"
                className="Form__field"
                required
                minLength="3"
                maxLength="30"
                onChange={handleInputChange}
                value={usuario.nombre}

                />
                <input
                type="text"
                name="username"
                placeholder="Nombre de Usuario"
                className="Form__field"
                required
                minLength="3"
                maxLength="30"
                onChange={handleInputChange}
                value={usuario.username}

                />
                <input
                type="text"
                name="bio"
                placeholder="Hobby Favorito..."
                className="Form__field"
                required
                maxLength="150"
                onChange={handleInputChange}
                value={usuario.bio}

                />
                <input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="Form__field"
                required
                onChange={handleInputChange}
                value={usuario.password}

                />
                <button className="Form__submit" type="submit">
                Crear Cuenta
                </button>
                <p className="FormContainer__info">
                Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                </p>
            </form>
            </div>
        </div>
        </Main>
    );
}
