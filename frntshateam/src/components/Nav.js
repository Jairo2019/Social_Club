import React from 'react';
import './shateam.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { faCompass } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'

export default function Nav({ usuario }) {

    return (
        <nav className="Nav" id="top_sha">
            <ul className="Nav__links">
                <li>
                    <Link to="/" className="Nav__link">
                        ShaTeam
                    </Link>
                </li>
                {
                    usuario && <LoginRoutes usuario={usuario}/> 
                }
            </ul>
        </nav>
    )

}

function LoginRoutes({usuario}) {
    return (
        <>
            <li className="Nav__link-push">
                <Link className="Nav__link" to="/upload">
                    <FontAwesomeIcon icon={ faPaperPlane}/>
                </Link>
            </li>
            <li className="Nav__link-margin-left">
                <Link className="Nav__link" to="/explore">
                    <FontAwesomeIcon icon={faCompass}/>
                </Link>
            </li>
            <li className="Nav__link-margin-left">
                <Link className="Nav__link" to={`/perfil/${usuario.username}`}>
                    <FontAwesomeIcon icon={faUser}/>
                </Link>
            </li>
        </>
    )
}