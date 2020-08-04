import React, {useState} from "react";
import Main from "../Components/Main";
import { Link } from 'react-router-dom'


export default function Login({login, mostrarError}) {

    const [usuario, setUsuario] = useState({
        email: '',
        password: '',
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
            await login(usuario.email, usuario.password)
        } catch (err) {
            mostrarError(err?.response?.data?.message)
            console.log(err)
        }
    }

    return (
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">Shateam</h1>
                <div>
                    <form onSubmit={handleInputSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={usuario.email}
                            />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contrasena"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={usuario.password}
            
                        />
                        <button className="Form__submit">
                         Iniciar Sesión
                        </button>
                        <p className="FormContainer__info">
                            No tienes cuenta? <Link to="/signup">Registrate</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Main>
    )
}