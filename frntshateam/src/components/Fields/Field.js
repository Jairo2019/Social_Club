import React from 'react';
import './Field.css';
export default ({name, value, type, caption, onChange, error})=>{
  return (
    <fieldset>
      <label htmlFor={name}>{caption}</label>
      <input type={type || "text"} name={name}
        id={name} value={value}
        onChange={(onChange || ((e)=>false))}
      />
      {(error && true) ? (<span className="error">{error}</span>) : null}
    </fieldset>
  )
}
