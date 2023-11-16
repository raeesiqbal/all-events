import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Container, Row,
} from "react-bootstrap";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getPaymentMethod, handleMessageAlerts, listPlans } from "../redux/Subscriptions/SubscriptionsSlice";
import Plan from "./Plan";

const Plans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    plans, freePlan, currentSubscription, SubscriptionSuccessAlert, SubscriptionErrorAlert, error, loading, listPlansLoading,
  } = useSelector((state) => state.subscriptions);
  const { user } = useSelector((state) => state.auth);

  const [isHovered, setIsHovered] = useState(false);
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
    if (user?.role === "client") navigate("/");
  }, [user?.role]);

  useEffect(() => {
    dispatch(listPlans(user?.userId !== null));
    dispatch(getPaymentMethod());
  }, [user?.userId]);

  useEffect(() => {
    if (currentSubscription.priceId !== "") {
      setCurrentInterval({
        interval: currentSubscription.interval,
        intervalCount: currentSubscription.intervalCount,
      });
    }
  }, [currentSubscription]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (SubscriptionSuccessAlert || SubscriptionErrorAlert) {
      const timeoutId = setTimeout(() => {
        if (!isHovered) {
          dispatch(handleMessageAlerts());
        }
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [SubscriptionSuccessAlert, SubscriptionErrorAlert, isHovered, dispatch]);

  return (
    <>
      <Alert
        severity={SubscriptionErrorAlert ? "error" : "success"}
        variant="filled"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        <div dangerouslySetInnerHTML={{ __html: error }} />
      </Alert>
      <Container className="py-5">
        <h1 className="mb-5 fw-bold ps-2">Plans</h1>
        {
          (listPlansLoading || loading) && (
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )
        }
        {
          !(listPlansLoading || loading) && (
            <>
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
            </>
          )
        }
        <Row className="my-5 mx-0">
          {
            !(listPlansLoading || loading) && freePlan && (
              <Plan
                plan={freePlan}
                index={0}
                currentInterval={currentInterval}
                currentSubscription={currentSubscription}
              />
            )
          }
          {
            !(listPlansLoading || loading) && plans.slice().reverse().map((plan, index) => (
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
    </>
  );
};

export default Plans;
