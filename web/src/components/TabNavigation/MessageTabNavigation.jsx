/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useDispatch } from "react-redux";
import "./TabNavigation.css";
import {
  handleClickTab,
} from "../../views/redux/TabNavigation/TabNavigationSlice";

const MesssageTabNavigation = ({
  activeTab, setActiveTab, tabs,
}) => {
  const dispatch = useDispatch();
  const isActive = (label) => activeTab === label;

  const handleClickTabNav = (index, label) => {
    dispatch(handleClickTab(index));
    setActiveTab(label);
  };

  return (
    <div
      className="d-flex border-bottom border-2 w-100"
      style={{ height: "45px" }}
    >
      {
        tabs.map((tab, index) => (
          <div
            key={tab.label}
            className={`d-flex align-items-center ps-2 pe-3 me-3 ${
              isActive(tab.label) ? "message-tab-active" : ""
            }`}
            onClick={() => handleClickTabNav(index, tab.label)}
            style={{ cursor: "pointer", borderBottom: "7px solid transparent" }}
          >
            <span>{tab.label}</span>
            {
              tab.count !== null && (
                <span className="ps-2 text-secondary">{`(${tab.count?.toString()})`}</span>
              )
            }
          </div>
        ))
      }
    </div>
  );
};

export default MesssageTabNavigation;
