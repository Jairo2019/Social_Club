import React, { Component } from 'react';
import Page from '../../Page';
import Field from '../../Fields/Field';
import { Actions } from '../../Buttons/Button';
import { emailRegex, emptyRegex } from '../../Validators/Validators';
import './signin.css';

import {paxios} from '../../Utilities/Utilities';
export default class Login extends Component {
  /*
  1) Capturar los eventos de los botones
  2) Repasar el evento para capturar los datos del formulario
  3) Validaciones de Datos y como desplegarlo en el componente
  4) Usar axios para llegar al API. 
   */

  constructor() {
    super();
    this.state = {
      userName: '',
      userNameError:null,
      email: '',
      emailError: null,
      password: '',
      passwordError: null
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.onClickCreateAccount = this.onClickCreateAccount.bind(this);
    this.validate = this.validate.bind(this);
  }
  validate(state) {
    let nameErrors = null;
    let tmpErrors = [];
    const { email, password } = state;
    if (email !== undefined) {
      if (!emailRegex.test(email)) {
        tmpErrors.push("El correo debe tener formato correcto");
      }
      if ((/^\s*$/.test(email))) {
        tmpErrors.push("Debe Ingresar Correo Adecuado");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, { emailError: tmpErrors.join('. ') });
      }
    }
    if (password !== undefined) {
      tmpErrors = [];
      if ((emptyRegex.test(password))) {
        tmpErrors.push("Debe Ingresar Contraseña Adecuado");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, { passwordError: tmpErrors.join('. ') });
      }
    }
    return nameErrors;
  }
  onChangeHandler(e) {
    const { name, value } = e.currentTarget;
    // Aqui puedo validar datos y establecer elementos de error.
    let errors = this.validate({ [name]: value });
    if (!errors) {
      errors = { [name + "Error"]: '' };
    }
    this.setState({
      ...this.state,
      [name]: value,
      ...errors
    });
  }
  onClickCreateAccount(e) {
    e.preventDefault();
    e.stopPropagation();
    //Validaciones
    const errors = this.validate(this.state);
    if (errors) {
      this.setState({ ...this.state, ...errors });
    } else {
      //Aplicar Axios
      const { email, password , userName} = this.state;
      paxios.post(
        "/api/seguridad/users/new",
        {
          useremail: email,
          userpswd: password,
          usernames: userName
        }
      )
        .then((resp) => {
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }
  onClickLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    alert("Click en Login");
  }
  render() {
    return (
      <section className="page">
      <Page title="Nueva Cuenta" showFooter={true} showHeader={true} auth={this.props.auth}>
        <Field
          name="userName"
          caption="Nombre de Usuario"
          value={this.state.userName}
          type="text"
          onChange={this.onChangeHandler}
          error={this.state.userNameError}
        />
        <Field
          name="email"
          caption="Correo"
          value={this.state.email}
          type="text"
          onChange={this.onChangeHandler}
          error={this.state.emailError}
        />
        <Field
          name="password"
          caption="Contraseña"
          value={this.state.password}
          type="password"
          onChange={this.onChangeHandler}
          error={this.state.passwordError}
        />
        <Actions>
          <button onClick={this.onClickCreateAccount}>Crear Cuenta</button>
          <button onClick={this.onClickLogin}>Iniciar Sesión</button>
        </Actions>
      </Page>
      </section>
    );
  }
}
