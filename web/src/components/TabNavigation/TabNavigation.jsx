/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faEnvelope, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faChartLine, faCircleDollarToSlot, faGauge, faGear, faListUl,
} from "@fortawesome/free-solid-svg-icons";
import {
  handleClickTab,
  handleProfileSettingsCurrentView,
} from "../../views/redux/TabNavigation/TabNavigationSlice";
import { setImagesToUpload } from "../../views/redux/Posts/AdsSlice";
import "./TabNavigation.css";

const vendorTabs = [
  {
    label: "My Ads",
    icon: faListUl,
    path: "/my-ads",
  },
  {
    label: "Calendars",
    icon: faCalendarCheck,
    path: "/calendars",
  },
  {
    label: "Messages",
    icon: faEnvelope,
    path: "/messages",
  },
  {
    label: "Settings",
    icon: faGear,
    path: "/profile-settings",
  },
  {
    label: "Dashboard",
    icon: faGauge,
    path: "/dashboard",
  },
  {
    label: "My Subscriptions",
    icon: faCircleDollarToSlot,
    path: "/subscriptions",
  },
];

const clientTabs = [
  {
    label: "Favorite Ad",
    icon: faHeart,
    path: "/favorite-ads",
  },
  {
    label: "Messages",
    icon: faEnvelope,
    path: "/messages",
  },
  {
    label: "Settings",
    icon: faGear,
    path: "/profile-settings",
  },
];

const TabNavigation = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState(role === "client" ? clientTabs : vendorTabs);

  const isActive = (path) => window.location.pathname === path;
  const currentSubscription = useSelector((state) => state.subscriptions.currentSubscriptionDetails);

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

  useEffect(() => {
    const hasAnalyticsTab = tabs.filter((tab) => tab.label === "Analytics");
    if (currentSubscription && role === "vendor" && currentSubscription?.type?.analytics && hasAnalyticsTab.length === 0) {
      setTabs([...tabs, {
        label: "Analytics",
        icon: faChartLine,
        path: "/analytics",
      }]);
    }
  }, [currentSubscription]);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "50px", width: "100%" }}
    >
      <div className="d-flex justify-content-between" style={{ width: "80vw" }}>
        {tabs.map((tab, index) => (
          <div
            key={tab.label}
            className={`d-flex align-items-center ${
              isActive(tab.path) && "tab-active"
            }`}
            onClick={() => handleClickTabNav(index, tab.path)}
            style={{
              cursor: "pointer",
            }}
          >
            {" "}
            <FontAwesomeIcon icon={tab.icon} />
            <span className="tab-label">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
