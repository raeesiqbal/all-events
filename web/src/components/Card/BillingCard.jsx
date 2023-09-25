import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./card.css";

const BillingCard = ({
  icon,
  headingText,
  subText,
  duration,
  backgroundColor,
  border,
  activeBillingCard,
  setActiveBillingCard,
}) => (
  <Col md={3}>
    <Card
      style={{
        backgroundColor,
        border:
          activeBillingCard === headingText.toLowerCase()
            ? "1px solid #5CC85C"
            : border,
        boxShadow: "0px 4px 4px 0px #00000040",
      }}
      className="custom-card-billing"
      onClick={() => setActiveBillingCard(headingText.toLowerCase())}
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

          <div>{headingText}</div>
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
          <div>
            {subText}
            <span style={{ fontWeight: "300", fontSize: "24px" }}>/</span>

            <span
              className="roboto-regular-18px-body3"
              style={{
                marginTop: "36px",
                // fontSize: "40px",
                fontWeight: "400",
                marginBottom: "8px",
                color: "#1A1A1A",
              }}
            >
              {duration}
            </span>
          </div>
        </Card.Text>
        {/* <Card.Text
              className="roboto-regular-18px-body3"
              style={{
                marginTop: "36px",
                // fontSize: "40px",
                fontWeight: "400",
                marginBottom: "8px",
                color: "#1A1A1A",
              }}
            >

            </Card.Text> */}
      </Card.Body>
    </Card>
  </Col>
);

export default BillingCard;
