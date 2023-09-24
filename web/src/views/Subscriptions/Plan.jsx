import React, { useEffect, useState } from "react";
import {
  Col, Card, Button, OverlayTrigger, Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfo } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription, updateSubscription } from "../redux/Subscriptions/SubscriptionsSlice";
import { secureInstance } from "../../axios/config";

const Plan = ({
  plan, index, currentInterval, currentSubscription,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [currentPlanPrice, setCurrentPlanPrice] = useState();

  const regex = /\[(.*?)\]\((.*?)\)/;
  const cardColors = ["#FFFAD6", "#D8FFFB", "#DBE5FF"];
  const checkStyle = {
    backgroundColor: "#A0C49D",
    color: "white",
    borderRadius: "50%",
    fontSize: "11px",
    width: "16px",
    height: "16px",
  };
  const infostyle = {
    backgroundColor: "#9B9B9B",
    color: "white",
    borderRadius: "50%",
    fontSize: "11px",
    width: "16px",
    height: "16px",
  };

  useEffect(() => {
    setCurrentPlanPrice(
      plan.prices.filter(
        (price) => price.interval === currentInterval.interval && price.interval_count === currentInterval.intervalCount,
      )[0],
    );
  }, [currentInterval]);

  const handlePlanSubscription = async () => {
    if (user.userId !== null && currentSubscription.priceId === "") {
      dispatch(createSubscription({ price_id: currentPlanPrice?.price_id }));
      setTimeout(() => {
        navigate("/checkout");
      }, 1000);
    } else {
      const data = {
        subscription_id: currentSubscription.subscriptionId,
        price_id: currentPlanPrice.price_id,
        allowed_ads: plan.allowed_ads,
      };
      dispatch(updateSubscription(data));
    }
  };

  return (
    <Col key={index} className="mb-4" sm={12} md={6} lg={4}>
      <Card
        className="p-sm-3 h-100"
        style={{ backgroundColor: cardColors[index % 3] }}
      >
        <Card.Body>
          <h3 className="fw-bold">{plan.name}</h3>
          <Card.Title className="mb-4">
            <span className="display-5 fw-bold">
              $
              {currentPlanPrice?.unit_price}
            </span>
          </Card.Title>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <div className="fw-bold mb-2">Extra details</div>
            {plan.features.map(({ name }) => {
              const detail = name.match(regex);

              return (
                <li className="mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <div style={checkStyle} className="px-1">
                      <FontAwesomeIcon icon={faCheck} size="sm" />
                    </div>
                    {detail !== null ? detail[1] : name.slice(0, 22)}
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{detail !== null ? detail[2] : name}</Tooltip>}
                    >
                      <div
                        style={infostyle}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FontAwesomeIcon
                          icon={faInfo}
                          size="sm"
                        />
                      </div>
                    </OverlayTrigger>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card.Body>
        <div className="text-center mb-3">
          <Button
            variant="success"
            className="w-75"
            onClick={handlePlanSubscription}
            disabled={user.userId !== null && currentSubscription.priceId === currentPlanPrice?.price_id}
          >
            {
              (user.userId === null) && "Subscribe"
            }
            {
              user.userId !== null && currentSubscription.priceId === currentPlanPrice?.price_id && "Current Plan"
            }
            {
              (user.userId !== null && currentSubscription.priceId === "") ? "Subscribe" : "Upgrade"
            }
          </Button>
        </div>
      </Card>
    </Col>
  );
};

export default Plan;
