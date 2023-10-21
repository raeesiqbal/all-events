import React, { useEffect } from "react";
import {
  Route, Routes, useLocation, useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
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
import { handleProfileSettingsCurrentView } from "./views/redux/TabNavigation/TabNavigationSlice";
import { currentSubscriptionDetails, setShowModal } from "./views/redux/Subscriptions/SubscriptionsSlice";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, screenLoading } = useSelector((state) => state.auth);
  const currentSubscription = useSelector((state) => state.subscriptions.currentSubscriptionDetails);
  const {
    showModal, modalMessage, modalType, buttonText,
  } = useSelector((state) => state.subscriptions.modalInfo);
  const profileSettingsCurrentView = useSelector(
    (state) => state.tabNavigation.profileSettingsCurrentView,
  );

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

  const shouldRenderTabNavigation = routesWithTabNavigation.includes(location.pathname);

  const handleSubscription = () => {
    dispatch(setShowModal(false));

    switch (modalType) {
      case "no_subscription":
        navigate("/plans");
        break;
      case "unpaid":
        dispatch(handleProfileSettingsCurrentView("PaymentMethod"));
        navigate("/profile-settings");
        break;
      case "create":
        navigate("/my-ads");
        break;
      default:
        // nothing to do
    }
  };

  useEffect(() => {
    if (
      (currentSubscription === null || (currentSubscription !== null && user?.role === "vendor"
        && currentSubscription.status === "unpaid"))
        && !["/plans", "/subscriptions"].includes(location.pathname)
        && profileSettingsCurrentView !== "PaymentMethod"
    ) {
      dispatch(setShowModal(true));
    }
  }, [currentSubscription, location]);

  useEffect(() => {
    if (currentSubscription === null && user?.role === "vendor") {
      dispatch(currentSubscriptionDetails());
    }
  }, [user]);

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          dispatch(setShowModal(false));
        }}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered="true"
      >
        <div className="box" style={{ position: "absolute", right: "0" }} />
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "8px",
            zIndex: "20",
          }}
        >
          <div
            role="presentation"
            onClick={() => {
              dispatch(setShowModal(false));
            }}
            className="close-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ cursor: "pointer" }}
            >
              <path
                d="M17 1L1 17M1 1L17 17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <Modal.Body className="text-center">
          <h1 className="w-100 mb-5 mt-3 fw-bold">Payment Failed!</h1>
          <h5 className="my-5 mx-5 px-5 text-secondary fw-normal" dangerouslySetInnerHTML={{ __html: modalMessage }} />
          <Button
            variant="success"
            className="mx-5 mb-3"
            style={{ width: "-webkit-fill-available" }}
            onClick={handleSubscription}
          >
            {buttonText}
          </Button>
        </Modal.Body>
      </Modal>

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
