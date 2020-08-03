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
        showFooter={true}
      >
       
      <section class="publicacion">
      <form>
        <label htmlFor="name">Titulo: </label>
        <div>
        <input id="name" type="text" value={this.state.name} onChange={this.handleChange} />
        </div>
        <div>
        <label htmlFor="name">Descripcion: </label>
        </div>
        <div>
        <textarea tabindex="1" class="mainInput" id="tcm-post-content" name="tcm-post-content" placeholder="Escribe tu descripcion..."></textarea>
        </div>
      </form>
      <form onSubmit={this.handleSubmit}>
        <label>
          Subir Archivo:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <NavLinkBtn toLink="/" className="btnBack" type="sumbit">Enviar</NavLinkBtn>
      </form>
      </section>
      
      </Page>
    );
  }
}
