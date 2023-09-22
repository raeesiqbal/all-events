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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
// import cancelIcon from "../../assets/images/cancel.svg";

const Subscription = ({ subscription }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const messages = useSelector((state) => state.messages.messages);
  // const additionalInfo = useSelector((state) => state.messages.additionalInfo);
  // const currentUser = useSelector((state) => state.auth.user);

  const date = (d) => new Date(d);
  const getTime = (d) => date(d).toLocaleTimeString("en-US", { hour12: true });

  // Function to get the ordinal suffix for a day
  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Get the formatted date with ordinal day
  const formattedDate = (d) => `${`${date(d).getDate() + getOrdinalSuffix(date(d).getDate())} ${
    date(d).toLocaleString("en-US", { month: "long" })}, ${
    date(d).getFullYear()}`}`;

  return (
    <Row className="mx-0 mt-4 w-100 ps-2 p-3 subscription-free">
      <h2>{subscription.type.type}</h2>
      <div className="d-flex w-100">
        <img src={timeIcon} alt="time icon" style={{ width: "20px", height: "20px" }} />
        <div className="my-auto ms-1" style={{ fontSize: "14px" }}>{formattedDate(subscription.created_at)}</div>
      </div>
      <div className="mt-1" style={{ fontSize: "14px", fontWeight: "500" }}>
        Validation: 12th Apr, 2024
      </div>
      <div className="d-sm-flex justify-content-between mt-3">
        <div className="mb-3 my-sm-auto" style={{ fontSize: "13px" }}>Ads Posted: 1/3</div>
        <div className="d-flex">
          <Button
            type="button"
            variant="success"
            className="me-3 px-5 py-0"
            style={{ fontSize: "12px !important", height: "32px" }}
            onClick={() => navigate("/plans")}
          >
            Upgrade
          </Button>
          {/* <img src={cancelIcon} alt="cancel" /> */}
          <div
            className="d-flex"
            style={{
              borderRadius: "50%", height: "32px", width: "32px", backgroundColor: "rgba(217, 217, 217, 1)",
            }}
          >
            <FontAwesomeIcon className="mx-auto my-auto" icon={faBan} />
          </div>
        </div>
      </div>
    </Row>
  );
};

export default Subscription;
