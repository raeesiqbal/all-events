import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Container, Row,
} from "react-bootstrap";
import { listPlans } from "../redux/Subscriptions/SubscriptionsSlice";
import Plan from "./Plan";
import Login from "../Login/Login";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Alert } from "@mui/material";

const Plans = () => {
  const dispatch = useDispatch();
  const { plans, currentSubscription, SubscriptionSuccessAlert, SubscriptionErrorAlert, error } = useSelector((state) => state.subscriptions);
  const user = useSelector((state) => state.auth.user);

  const [currentInterval, setCurrentInterval] = useState({
    interval: "month",
    intervalCount: 1,
  });

  const intervals = [{
    interval: "month",
    intervalCount: 1,
  }, {
    interval: "month",
    intervalCount: 3,
  }, {
    interval: "month",
    intervalCount: 6,
  }, {
    interval: "year",
    intervalCount: 1,
  }];

  const isCurrentInterval = (interval) => (
    interval.interval === currentInterval.interval && interval.intervalCount === currentInterval.intervalCount
  );

  const handleInterval = (interval) => {
    setCurrentInterval({
      interval: interval.interval,
      intervalCount: interval.intervalCount,
    });
  };

  useEffect(() => {
    dispatch(listPlans(user?.userId !== null));
  }, [user?.userId]);

  return (
    <>
      <Login />
      <Header />
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
      <Container className="py-5">
        <h1 className="mb-5 fw-bold ps-2">Plans</h1>
        <h3 className="mb-4 fw-bold w-100 text-center">Please select the subscription period</h3>
        <Row className="mx-0">
          <Col md={4} className="mx-auto">
            <Row className="mx-0 bg-white rounded" style={{ height: "56px" }}>
              {
                intervals.map((interval) => (
                  <Col sm={3} className="p-2 text-center">
                    <div
                      className={`p-2 rounded interval ${isCurrentInterval(interval) ? "active-interval" : ""}`}
                      onClick={() => handleInterval(interval)}
                    >
                      {`${interval.intervalCount} ${interval.interval}`}
                    </div>
                  </Col>
                ))
              }
            </Row>
          </Col>
        </Row>
        <Row className="my-5 mx-0">
          {plans.slice().reverse().map((plan, index) => (
            <Plan plan={plan} index={index} currentInterval={currentInterval} currentSubscription={currentSubscription} />
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Plans;
