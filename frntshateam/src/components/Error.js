import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

export default function Error({ mensaje , esconderError}) {
  if (!mensaje) {
    return null;
  }

  return (
    <div className="ErrorContainer" role="alert">
      <div className="Error__inner">
        <span className="block">{mensaje}</span>
        <button className="Error__button" onClick={esconderError}>
            <FontAwesomeIcon className="Error_icon" icon={faTimesCircle} />
        </button>
      </div>
    </div>
  );
}
