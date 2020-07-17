import React from 'react';
import { NavLink } from 'react-router-dom';

import { MdHome, MdAddBox } from 'react-icons/md';
import {IoIosLogIn} from 'react-icons/io';


import './footer.css';

export default ()=>{
  return (
    <footer>
      <nav>
        <ul>
          <li><NavLink to="/" ><MdHome size="2em"/></NavLink></li>
          <li><NavLink to="/signin"><IoIosLogIn size="2em"/></NavLink></li>
          <li><NavLink to="/Publicaciones"><MdAddBox size="2em"/></NavLink></li>
        </ul>
      </nav>
    </footer>
  );
}
