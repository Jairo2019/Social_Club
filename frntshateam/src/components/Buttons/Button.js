import React from 'react';
import './Button.css';
export const Actions = ({children})=>{
  return(
    <fieldset className="action">
      {children}
    </fieldset>
  );
}
