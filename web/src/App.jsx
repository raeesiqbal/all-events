import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./views/Homepage/Homepage";
import PostAd from "./views/PostAd/PostAd";
import ProfileView from "./views/ProfileSettings/ProfileView";
import ProtectedRoute from "./views/ProtectedRoute";
import MyAds from "./views/Ads/MyAds";
import ViewAd from "./views/Ads/ViewAd";
import EditAd from "./views/EditAd/EditAd";
import ResetPassword from "./views/ResetPassword/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/post-ad"
        element={
          <ProtectedRoute>
            <PostAd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-ad/:id"
        element={
          <ProtectedRoute>
            <EditAd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-settings"
        element={
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-ads"
        element={
          <ProtectedRoute>
            <MyAds />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-ad/:adId"
        element={
          <ProtectedRoute>
            <ViewAd />
          </ProtectedRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* <Route
        path="/reset-password?token=f3ade5ec18534bb7b3bc06e9a4b2b3fe689b2bb049fcef6032"
        element={retrn<h1>/reset-password/:id</h1>}
      /> */}
    </Routes>
  );
}

export default App;
