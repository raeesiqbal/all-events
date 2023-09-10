/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import "./Chip.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

function Chip({
  label,
  index,
  handleRemoveService,
  handleAddItem,
  selected,
  adminServicesSelected,
  adminServices,
}) {
  const [chipActive, setChipActive] = useState(!!selected);

  const handleRemove = () => {
    handleRemoveService(index, label);
    if (!selected) {
      setChipActive(false);
    }
  };

  const handleAdd = () => {
    handleAddItem(index, label);
    setChipActive(true);
  };

  useEffect(() => {
    if (adminServices) {
      const isActive = adminServicesSelected.includes(label);
      if (isActive) {
        setChipActive(true);
      }
    }
  }, [adminServices]);

  return (
    <div className={`chip ${chipActive && "chip-active"}`}>
      <FontAwesomeIcon
        icon={faAdd}
        style={{
          // color: "#A0C49D",
          marginRight: "10px",
          // showCloseIcon &&
          transform: chipActive && "rotate(45deg)",
          transition: "all 100ms",
        }}
        size="lg"
        onClick={chipActive ? handleRemove : handleAdd}
      />
      <span className="roboto-regular-14px-information">{label}</span>
    </div>
  );
}

export default Chip;
