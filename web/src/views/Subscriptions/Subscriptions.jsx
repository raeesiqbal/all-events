/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import MesssageTabNavigation from "../../components/TabNavigation/MessageTabNavigation";
import "../Ads/Ads.css";
import "./Subscriptions.css";
import { handleMessageAlerts, listSubscriptions } from "../redux/Subscriptions/SubscriptionsSlice";
import Subscription from "./Subscription";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Subscriptions() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const {
    subscriptions, SubscriptionSuccessAlert, SubscriptionErrorAlert, error, loading,
  } = useSelector((state) => state.subscriptions);
  // const activeCount = useSelector((state) => state.subscriptions.activeCount);
  // const expiredCount = useSelector((state) => state.subscriptions.expiredCount);
  const [activeTab, setActiveTab] = React.useState("Active");
  const [activeTabSubscriptions, setActiveTabSubscriptions] = React.useState();

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
      <Header />
      <TabNavigation role={user.role} />

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

      <Footer />
    </>
  );
}

export default Subscriptions;
