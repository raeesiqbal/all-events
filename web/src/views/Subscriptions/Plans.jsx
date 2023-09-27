import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Container, Row,
} from "react-bootstrap";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { listPlans } from "../redux/Subscriptions/SubscriptionsSlice";
import Plan from "./Plan";
import Login from "../Login/Login";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Plans = () => {
  const dispatch = useDispatch();
  const {
    plans, freePlan, currentSubscription, SubscriptionSuccessAlert, SubscriptionErrorAlert, error, loading,
  } = useSelector((state) => state.subscriptions);
  const user = useSelector((state) => state.auth.user);

  const [currentInterval, setCurrentInterval] = useState({
    interval: currentSubscription.interval,
    intervalCount: currentSubscription.intervalCount,
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

  useEffect(() => {
    setCurrentInterval({
      interval: currentSubscription.interval,
      intervalCount: currentSubscription.intervalCount,
    });
  }, [currentSubscription]);

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
          <Col md={9} lg={5} className="mx-auto">
            <Row className="mx-0 bg-white rounded">
              {
                intervals.map((interval) => (
                  <Col sm={3} className="p-2 text-center" style={{ height: "56px" }}>
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
          {
            loading && (
              <div className="loading-icon">
                <FontAwesomeIcon icon={faSpinner} spin />
              </div>
            )
          }
          {
            !loading && freePlan && (
              <Plan
                plan={freePlan}
                index={0}
                currentInterval={currentInterval}
                currentSubscription={currentSubscription}
              />
            )
          }
          {
            !loading && plans.slice().reverse().map((plan, index) => (
              <Plan
                plan={plan}
                index={index + 1}
                currentInterval={currentInterval}
                currentSubscription={currentSubscription}
              />
            ))
          }
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Plans;
