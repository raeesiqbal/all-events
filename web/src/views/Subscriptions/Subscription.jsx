import React, { useEffect, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import timeIcon from "../../assets/images/post-ad/carbon_time.svg";
import cancelIcon from "../../assets/images/cancel.svg";

const Subscription = ({ subscription }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const messages = useSelector((state) => state.messages.messages);
  const additionalInfo = useSelector((state) => state.messages.additionalInfo);
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <Row className="mx-0 w-100 p-4 subscription-free">
      <h2>Free</h2>
      <div className="d-flex w-100">
        <img src={timeIcon} alt="time icon" style={{ width: "20px", height: "20px" }} />
        <div className="my-auto" style={{ fontSize: "14px" }}>Jan 12th, 2023</div>
      </div>
      <div style={{ fontSize: "14px", fontWeight: "500" }}>
        Validation:12th Apr, 2024
      </div>
      <div className="d-sm-flex justify-content-between mt-4">
        <div className="mb-3 my-sm-auto" style={{ fontSize: "13px" }}>Ads Posted: 1/3</div>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            variant="success"
            className="me-3"
            style={{ fontSize: "12px" }}
            onClick={() => navigate("/plans")}
          >
            Upgrade
          </Button>
          <img src={cancelIcon} alt="cancel" />
        </div>
      </div>
    </Row>
  );
};

export default Subscription;
