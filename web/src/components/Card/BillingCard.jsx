import React from "react";
import { Card, Col, Row } from "react-bootstrap";

const BillingCard = ({
  icon,
  headingText,
  subText,
  duration,
  backgroundColor,
}) => (
  <Col md={3}>
    <Card
      style={{ maxWidth: "256px", backgroundColor }}
      className="custom-card-analytics"
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
