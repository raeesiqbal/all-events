import React from "react";
import {
  Route, Routes, useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Homepage from "./views/Homepage/Homepage";
import PostAd from "./views/PostAd/PostAd";
import ProfileView from "./views/ProfileSettings/ProfileView";
import ProtectedRoute from "./views/ProtectedRoute";
import MyAds from "./views/Ads/MyAds";
import ViewAd from "./views/Ads/ViewAd";
import EditAd from "./views/EditAd/EditAd";
import ResetPassword from "./views/ResetPassword/ResetPassword";
import Chats from "./views/Chats/Chats";
import FavoriteAds from "./views/Ads/FavoriteAds";
import Analytics from "./views/Analytics/Analytics";
import Search from "./views/Search/Search";
import Dashboard from "./views/Dashboard/Dashboard";
import Subscriptions from "./views/Subscriptions/Subscriptions";
import Plans from "./views/Subscriptions/Plans";
import Checkout from "./views/Subscriptions/Checkout";
import Login from "./views/Login/Login";
import Header from "./components/Navbar/Navbar";
import TabNavigation from "./components/TabNavigation/TabNavigation";
import Footer from "./components/Footer/Footer";
import TopBanner from "./components/TopBanner";
import "./App.css";
import Calendars from "./views/Calendars/Calendars";

function App() {
  const location = useLocation();
  const { user, screenLoading } = useSelector((state) => state.auth);

  // Define an array of routes where you want to hide the navigation bar
  const routesWithTabNavigation = [
    "/post-ad",
    "/edit-ad/:id",
    "/profile-settings",
    "/my-ads",
    "/messages",
    "/favorite-ads",
    "/analytics",
    "/dashboard",
    "/subscriptions",
    "/calendars",
  ];

  // Check if the current route is in the array of routes to hide the navigation bar
  const shouldRenderTabNavigation = routesWithTabNavigation.includes(location.pathname);

  return (
    <>
      <Login />
      {
        user === null && (
          <TopBanner />
        )
      }
      <Header />
      {
        shouldRenderTabNavigation && user?.role && (
          <TabNavigation role={user.role} />
        )
      }
      {
        screenLoading && (
          <div className="screen-loader">
            <FontAwesomeIcon icon={faSpinner} spin color="#A0C49D" fontSize="70px" className="mx-auto my-auto" />
          </div>
        )
      }
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/search"
          element={<Search />}
        />
        <Route
          path="/view-ad/:adId"
          element={(<ViewAd />)}
        />
        <Route
          path="/calendars"
          element={(
            <ProtectedRoute role="vendor">
              <Calendars />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/plans"
          element={(
            <ProtectedRoute>
              <Plans />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/checkout"
          element={(
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          )}
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Routes having TabNavigation component */}
        <Route
          path="/post-ad"
          element={(
            <ProtectedRoute role="vendor">
              <PostAd />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/edit-ad/:id"
          element={(
            <ProtectedRoute role="vendor">
              <EditAd />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile-settings"
          element={(
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/my-ads"
          element={(
            <ProtectedRoute role="vendor">
              <MyAds />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/messages"
          element={(
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/favorite-ads"
          element={(
            <ProtectedRoute>
              <FavoriteAds />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/analytics"
          element={(
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/subscriptions"
          element={(
            <ProtectedRoute role="vendor">
              <Subscriptions />
            </ProtectedRoute>
          )}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
