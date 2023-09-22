/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import MesssageTabNavigation from "../../components/TabNavigation/MessageTabNavigation";
import "../Ads/Ads.css";
import "./Subscriptions.css";
import { listSubscriptions } from "../redux/Subscriptions/SubscriptionsSlice";
import Subscription from "./Subscription";

function Subscriptions() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const subscriptions = useSelector((state) => state.subscriptions.subscriptions);
  // const activeCount = useSelector((state) => state.subscriptions.activeCount);
  // const expiredCount = useSelector((state) => state.subscriptions.expiredCount);
  const [activeTab, setActiveTab] = React.useState("Active");
  const [activeTabSubscriptions, setActiveTabSubscriptions] = React.useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get("chatId");

  const tabs = [
    {
      label: "Active",
      count: subscriptions.length,
    },
    // {
    //   label: "Expired",
    //   count: expiredCount,
    // },
  ];

  useEffect(() => {
    setActiveTabSubscriptions(subscriptions.filter((subscription) => subscription.status === activeTab.toLowerCase()));
  }, [activeTab, subscriptions]);

  useEffect(() => {
    dispatch(listSubscriptions());
  }, []);

  return (
    <>
      <Header />
      <TabNavigation role={user.role} />

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
          activeTabSubscriptions && activeTabSubscriptions.map(
            (subscription) => <Subscription subscription={subscription} key={subscription.id} />,
          )
        }
      </Container>

      <Footer />
    </>
  );
}

export default Subscriptions;
