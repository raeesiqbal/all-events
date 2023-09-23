/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useDispatch } from "react-redux";
import "./TabNavigation.css";

const tabs = [
  {
    label: "1 months",
  },
  {
    label: "3 months",
  },
  {
    label: "6 months",
  },
  {
    label: "12 months",
  },
];

const BillingTabNavigation = ({ activeTab, setActiveTab }) => {
  const isActive = (label) => activeTab === label;

  const handleClickTabNav = (index, label) => {
    setActiveTab(label);
  };

  return (
    <div className="d-flex justify-content-center" style={{ width: "100%" }}>
      <div
        className="d-flex justify-content-around align-items-center"
        style={{
          minWidth: "477px",
          background: "#FFF",
          borderRadius: "5px",
          height: "56px",
          boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.10)",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className="d-flex justify-content-center align-items-center"
            onClick={() => handleClickTabNav(index, tab.label)}
            style={{
              cursor: "pointer",
              backgroundColor: isActive(tab.label) && "#A0C49D",
              color: isActive(tab.label) && "white",
              fontWeight: isActive(tab.label) && "600",
              height: "34px",
              padding: "0 12px",
              borderRadius: "5px",
              whiteSpace: "nowrap",
            }}
          >
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingTabNavigation;
