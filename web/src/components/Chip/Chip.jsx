/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import "./Chip.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

function Chip({ label, index, handleRemoveService }) {
  const handleIconClick = () => {
    handleRemoveService(index);
  };

  return (
    <div className="chip chip-active">
      <FontAwesomeIcon
        icon={faAdd}
        style={{
          // color: "#A0C49D",
          marginRight: "10px",
          // showCloseIcon &&
          transform: "rotate(45deg)",
          transition: "all 100ms",
        }}
        size="lg"
        onClick={handleIconClick}
      />
      <span className="roboto-regular-14px-information">{label}</span>
    </div>
  );
}

export default Chip;
