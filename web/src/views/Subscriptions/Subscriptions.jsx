/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container } from "react-bootstrap";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import MesssageTabNavigation from "../../components/TabNavigation/MessageTabNavigation";
import "../Ads/Ads.css";
import "./Subscriptions.css";
import { handleMessageAlerts, listSubscriptions } from "../redux/Subscriptions/SubscriptionsSlice";
import Subscription from "./Subscription";
import { secureInstance } from "../../axios/config";

function Subscriptions() {
  const dispatch = useDispatch();
  const {
    subscriptions, SubscriptionSuccessAlert, SubscriptionErrorAlert, error, loading,
  } = useSelector((state) => state.subscriptions);
  // const activeCount = useSelector((state) => state.subscriptions.activeCount);
  // const expiredCount = useSelector((state) => state.subscriptions.expiredCount);
  const [activeTab, setActiveTab] = React.useState("Active");
  const [activeTabSubscriptions, setActiveTabSubscriptions] = React.useState();

  // eslint-disable-next-line no-undef
  const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const tabs = [
    {
      label: "Active",
      count: subscriptions.length,
    },
    {
      label: "Expired",
      count: 0,
    },
  ];

  const handleUpdatePaymentMethod = async () => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/update-payment-method/",
        method: "Get",
      });

      // When the customer clicks on the button, redirect them to Checkout.
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.data.id,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const status = activeTab === "Active" ? "active" : "canceled";
    setActiveTabSubscriptions(subscriptions.filter((subscription) => subscription.status === status));
  }, [activeTab, subscriptions]);

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

      <div className="my-ad-banner p-md-5 mb-5">
        <div className="roboto-bold-36px-h1 mb-2">Subscriptions</div>
        <div className="roboto-regular-18px-body3">
          Review, upgrade and update your packages
        </div>
      </div>

      <Container
        style={{ paddingBottom: "200px" }}
        className="pt-md-5"
      >
        <div className="mb-4 text-end">
          <Button
            variant="success"
            className="me-3 px-5 py-0"
            style={{ fontSize: "12px !important" }}
            role="link"
            onClick={handleUpdatePaymentMethod}
          >
            Update Payment Method
          </Button>
        </div>
        <MesssageTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        {
          loading && (
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )
        }
        {
          !loading && activeTabSubscriptions && activeTabSubscriptions.map(
            (subscription) => <Subscription subscription={subscription} key={subscription.id} />,
          )
        }
      </Container>
    </>
  );
}

export default Subscriptions;
