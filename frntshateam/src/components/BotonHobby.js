import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinHearts as heartRegular } from "@fortawesome/free-regular-svg-icons";
import { faGrinHearts as heartSolid } from "@fortawesome/free-solid-svg-icons";

export default function BotonHobby({ onSubmitLike, like }) {
  return (
    <button onClick={onSubmitLike}>
      {like ? (
        <FontAwesomeIcon
          className="text-blue-dark"
          icon={heartSolid}
        ></FontAwesomeIcon>
      ) : (
        <FontAwesomeIcon
          icon={heartRegular}
        ></FontAwesomeIcon>
      )}
    </button>
  );
}
