import React from "react";
import {
  Col, Card, Button, OverlayTrigger, Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfo } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSubscription } from "../redux/Subscriptions/SubscriptionsSlice";

const Plan = ({ plan, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const regex = /\[(.*?)\]\((.*?)\)/;
  const cardColors = ["#F5F5F5", "#FFFAD6", "#D8FFFB", "#DBE5FF"];
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

  const handlePlanSubscription = () => {
    dispatch(createSubscription({ price_id: plan.price_id }));
    setTimeout(() => {
      navigate("/checkout");
    }, 1000);
  };

  return (
    <Col key={index} className="mb-4" sm={12} md={6} lg={4} xl={3}>
      <Card
        className="p-sm-3 h-100"
        style={{ backgroundColor: cardColors[index] }}
      >
        <Card.Body>
          <h3 className="fw-bold">Free</h3>
          <Card.Title className="mb-4">
            <span className="display-5 fw-bold">{plan.unit_price}</span>
            /mo
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
          >
            Subscribe
          </Button>
        </div>
      </Card>
    </Col>
  );
};

export default Plan;
