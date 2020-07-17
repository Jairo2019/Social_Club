import React, {Component} from 'react';
import Page from '../../Page';
import {NavLinkBtn} from '../../Button';

import './publicaciones.css';

import Publicaciones from './Publicaciones';
export default class extends Component {
  constructor(){
    super();
    this.state = {
      countSi:0,
      countNo:0,
      countAbstener:0
    }
    this.addToCounter = this.addToCounter.bind(this);
  }
  addToCounter(vote){
    const keyStr = 'count' + vote;
    const value = this.state[keyStr]+ 1;
    this.setState(
      {...this.state, [keyStr]:value}
    )
  }
  render(){
    return (
      <Page
        title="Publicaciones"
        showHeader={true}
        showFooter={false}
      >
        <Publicaciones rsmHandler={this.addToCounter} title="Ingreso por Medio de RFID"></Publicaciones>
        <Publicaciones rsmHandler={this.addToCounter} title="Modernización de Parque"></Publicaciones>
        <Publicaciones rsmHandler={this.addToCounter}  title="Ampliación de Opciones de Pagos para Cuota"></Publicaciones>
        <section>
         <p>Si: {this.state.countSi}</p>
         <p>No: {this.state.countNo}</p>
         <p>Abstener: {this.state.countAbstener}</p>
        </section>
        <NavLinkBtn toLink="/" className="btnBack">Regresar</NavLinkBtn>
      </Page>
    );
  }
}
