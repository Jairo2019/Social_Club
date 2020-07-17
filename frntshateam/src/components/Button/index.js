import React from 'react';

import {NavLink} from 'react-router-dom';

let buttonLibs = {};
buttonLibs.StandardBtn = (p)=>{
  let {caption, onclick, ...props} = p;
  caption  = (caption)? caption : "Click Me";
  onclick = (onclick)? onclick : ()=>{};
  return (<button onClick={onclick}>{caption}</button>)
}

buttonLibs.NavLinkBtn = (p) => {
  let { children, toLink, className, ...props } = p;
  toLink = (toLink) ? toLink : "/";
  className = (className) ? "btn "+className : "btn primary";
  return (<NavLink to={toLink} className={className} onClick={onclick}>{children}</NavLink>)
}

export const StandardBtn = buttonLibs.StandardBtn;
export const NavLinkBtn = buttonLibs.NavLinkBtn;

export default buttonLibs;
