/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import home from "../../assets/images/home.svg";
import list from "../../assets/images/list.svg";
import pieChart from "../../assets/images/pie-chart.svg";
import plusCircle from "../../assets/images/plus-circle.svg";
import settings from "../../assets/images/settings.svg";
import "./TabNavigation.css";
import {
  handleClickTab,
  handleProfileSettingsCurrentView,
} from "../../views/redux/TabNavigation/TabNavigationSlice";
import { setImagesToUpload } from "../../views/redux/Posts/AdsSlice";

const tabs = [
  {
    label: "Post an Ad",
    icon: plusCircle,
    path: "/post-ad",
  },
  {
    label: "Packages",
    icon: pieChart,
    path: "/",
  },
  {
    label: "Home",
    icon: home,
    path: "/",
  },
  {
    label: "My Ads",
    icon: list,
    path: "/my-ads",
  },
  {
    label: "Settings",
    icon: settings,
    path: "/profile-settings",
  },
];

const TabNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (window.location.pathname === path) {
      return true;
    }
    return false;
    // currentActiveNavigationTab;
  };

  const handleClickTabNav = (index, path) => {
    if (path === "/post-ad") {
      dispatch(setImagesToUpload([]));
    }
    if (path === "/profile-settings") {
      dispatch(handleProfileSettingsCurrentView("profileSettings"));
    }
    navigate(path);
    dispatch(handleClickTab(index));
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "50px", width: "100%" }}
    >
      <div className="d-flex justify-content-between" style={{ width: "50vw" }}>
        {tabs.map((tab, index) => (
          <div
            className={`d-flex align-items-center ${
              isActive(tab.path) && "tab-active"
            }`}
            onClick={() => handleClickTabNav(index, tab.path)}
            style={{ cursor: "pointer" }}
          >
            {" "}
            <img src={tab.icon} alt={tab.icon} className="me-2" />
            <span className="tab-label">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
