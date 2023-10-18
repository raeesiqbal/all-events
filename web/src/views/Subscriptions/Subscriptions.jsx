/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "../Ads/Ads.css";
import "./Subscriptions.css";
import { handleMessageAlerts, listSubscriptions } from "../redux/Subscriptions/SubscriptionsSlice";
import Subscription from "./Subscription";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

function Subscriptions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    subscriptions, SubscriptionSuccessAlert, SubscriptionErrorAlert, error, loading,
  } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(listSubscriptions());
  }, []);

  useEffect(() => {
    if (SubscriptionSuccessAlert || SubscriptionErrorAlert) {
      setTimeout(() => {
        dispatch(handleMessageAlerts());
      }, 5000);
    }
  }, [SubscriptionSuccessAlert, SubscriptionErrorAlert]);

  return (
    <>
      <Alert
        severity={SubscriptionErrorAlert ? "error" : "success"}
        variant="filled"
        style={{
          position: "fixed",
          top: (SubscriptionSuccessAlert || SubscriptionErrorAlert) ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: (SubscriptionSuccessAlert || SubscriptionErrorAlert) ? 1 : 0,
          zIndex: 2,
        }}
      >
        {error}
      </Alert>

      <div className="profile-settings-banner d-flex align-items-center justify-content-between">
        <div className="banner-text-heading">
          <div className="roboto-bold-36px-h1 mb-2">Subscriptions</div>
          <div className="roboto-regular-18px-body3">
            Review, upgrade and update your packages
          </div>
        </div>

        <ProfilePic />
      </div>

      {/* <div className="my-ad-banner p-md-5 mb-5">
        <div className="roboto-bold-36px-h1 mb-2">Subscriptions</div>
        <div className="roboto-regular-18px-body3">
          Review, upgrade and update your packages
        </div>

        <ProfilePic />
      </div> */}

      <Container
        className="pt-md-5"
      >
        {
          loading && (
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )
        }
        {
          !loading && subscriptions && subscriptions.map(
            (subscription) => <Subscription subscription={subscription} key={subscription.id} />,
          )
        }
      </Container>

      <Container
        style={{ paddingBottom: "200px" }}
        className="pt-md-5 d-flex"
      >
        <Button
          type="button"
          variant="success"
          className="px-5 py-0 ms-auto"
          style={{ fontSize: "12px !important", height: "32px" }}
          onClick={() => navigate("/plans")}
        >
          Check Subscription Plans
        </Button>
      </Container>
    </>
  );
}

export default Subscriptions;
