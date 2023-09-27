import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./card.css";

const BillingCard = ({
  plan, index, currentInterval, currentSubscription, setCurrentInterval, icon,
}) => {
  const user = useSelector((state) => state.auth.user);

  const [currentPlanPrice, setCurrentPlanPrice] = useState();
  const [border, setBorder] = useState("1px solid #E9EDF7");

  const cardColors = ["#FFFAD6", "#D8FFFB", "#DBE5FF"];

  useEffect(() => {
    setCurrentPlanPrice(
      plan.prices.filter(
        (price) => price.interval === currentInterval.interval && price.interval_count === currentInterval.intervalCount,
      )[0],
    );
  }, [currentInterval]);

  useEffect(() => {
    if (user?.userId !== null && currentSubscription.priceId === currentPlanPrice?.price_id) {
      setBorder("2px solid #5CC85C");
    } else {
      setBorder("1px solid #E9EDF7");
    }
  }, [user?.userId, currentSubscription.priceId, currentPlanPrice]);

  return (
    currentPlanPrice?.unit_price && (
      <Col md={6} lg={3}>
        <Card
          style={{
            backgroundColor: cardColors[index],
            border,
            boxShadow: "0px 4px 4px 0px #00000040",
          }}
          className="custom-card-billing"
        >
          <Card.Body>
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgb(234,121,186,0.1)",
                  borderRadius: "50%",
                  marginRight: "16px",
                }}
                className="d-flex justify-content-center align-items-center"
              >
                <img
                  src={icon}
                  alt="personalInfo"
                  className="mb-4"
                  style={{ marginTop: "24px" }}
                />
              </div>
              <div>{plan.name}</div>
            </div>
            <Card.Text
              className="roboto-bold-36px-h1"
              style={{
                marginTop: "36px",
                fontSize: "32px",
                fontWeight: "400",
                marginBottom: "8px",
              }}
            >
              $
              {currentPlanPrice.unit_price}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    )
  );
};

export default BillingCard;
