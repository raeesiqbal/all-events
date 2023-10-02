import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import * as formik from "formik";
import * as Yup from "yup";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import oldPasswordIcon from "../../assets/images/profile-settings/old-password.svg";
import newPasswordIcon from "../../assets/images/profile-settings/new-password.svg";
import sim from "../../assets/images/profile-settings/sim.png";
import paymentCardLogo from "../../assets/images/profile-settings/card-logo.png";
import paymentCardSingleLogo from "../../assets/images/card-single-logo.svg";
import confirmPasswordIcon from "../../assets/images/profile-settings/confirm-password.svg";
// import contactIcon from "../../assets/images/post-ad/contact.svg";

// import profile_bg from "../../assets/images/profile-settings/profile-bg.svg";
import "./ProfileSettings.css";
import { secureInstance } from "../../axios/config";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { getPaymentMethod } from "../redux/Subscriptions/SubscriptionsSlice";
import { setScreenLoading } from "../redux/Auth/authSlice";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { currentPaymentMethod } = useSelector((state) => state.subscriptions);

  const paymentCardFront = useRef();
  const paymentCardBack = useRef();

  const [stripe, setStripe] = useState();

  const setAspectRatio = () => {
    const width = paymentCardFront.current.offsetWidth;
    const height = width / 2;
    paymentCardFront.current.style.height = `${height}px`;
    paymentCardBack.current.style.height = `${height}px`;
  };

  const handleUpdatePaymentMethod = async () => {
    dispatch(setScreenLoading(true));
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/update-payment-method/",
        method: "Get",
      });

      // When the customer clicks on the button, redirect them to Checkout.
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.data.id,
      });
    } catch (err) {
      console.log(err.message);
    }
    dispatch(setScreenLoading(false));
  };

  useEffect(() => {
    dispatch(getPaymentMethod());
    setAspectRatio();
    window.addEventListener("resize", setAspectRatio);
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => {
      setStripe(window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <div className="profile-settings-banner d-flex align-items-center justify-content-between">
        <div className="banner-text-heading">
          <div className="roboto-bold-36px-h1">Payment Method</div>
          <div className="roboto-regular-18px-body3">
            Update your card details with ease and never run out of subscription
          </div>
        </div>

        <ProfilePic />
      </div>

      <Col className="justify-content-center left-arrow-settings">
        <div
          className="d-flex mt-3"
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(handleProfileSettingsCurrentView("profileSettings"))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              // eslint-disable-next-line max-len
              d="M21.6666 9.66668H5.43992L12.8933 2.21334L10.9999 0.333344L0.333252 11L10.9999 21.6667L12.8799 19.7867L5.43992 12.3333H21.6666V9.66668Z"
              fill="#667085"
            />
          </svg>
        </div>
      </Col>

      <Container
        fluid
        style={{ marginTop: "20px", marginBottom: "200px" }}
        className=""
      >
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="w-100 mt-4">
              <h4 className="mb-3">Your Card Details</h4>
            </div>
            <Row>
              <Col className="mb-4" sm={12} lg={4}>
                <Form.Group
                  className="form-group mb-4"
                  style={{ position: "relative" }}
                >
                  <Form.Label
                    className="roboto-medium-20px-body1 d-flex align-items-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <img
                      src={oldPasswordIcon}
                      alt="commercialName"
                      style={{ marginRight: "16px" }}
                    />
                    Card Type
                  </Form.Label>
                  <Form.Control
                    style={{ height: "56px" }}
                    className="hide-validation-icon lg-input-small-text"
                    size="lg"
                    placeholder="Card Type"
                    value={currentPaymentMethod?.brand}
                    disabled
                  />
                </Form.Group>

                <Form.Group
                  className="form-group mb-4"
                  style={{ position: "relative" }}
                >
                  <Form.Label
                    className="roboto-medium-20px-body1 d-flex align-items-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <img
                      src={newPasswordIcon}
                      alt="commercialName"
                      style={{ marginRight: "16px" }}
                    />
                    Account Last 4 digits
                  </Form.Label>
                  <Form.Control
                    style={{ height: "56px" }}
                    className="hide-validation-icon lg-input-small-text"
                    size="lg"
                    placeholder="Last 4 digits"
                    value={currentPaymentMethod?.last_4}
                    disabled
                  />
                </Form.Group>

                <Form.Group
                  className="form-group mb-4"
                  style={{ position: "relative" }}
                >
                  <Form.Label
                    className="roboto-medium-20px-body1 d-flex align-items-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <img
                      src={confirmPasswordIcon}
                      alt="commercialName"
                      style={{ marginRight: "16px" }}
                    />
                    Expiry Date
                  </Form.Label>
                  <Form.Control
                    style={{ height: "56px" }}
                    className="hide-validation-icon lg-input-small-text"
                    size="lg"
                    placeholder="Expiry Date"
                    value={`${currentPaymentMethod?.exp_month || "00"}/${currentPaymentMethod?.exp_year || "00"}`}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={1} />
              <Col className="mb-4" sm={8} lg={5}>
                <div className="payment-card-front p-4" ref={paymentCardFront}>
                  <div className="top-right-oval" />
                  <div className="bottom-left-oval" />
                  <div className="d-flex justify-content-between pe-2" style={{ height: "60px" }}>
                    <img src={paymentCardLogo} alt="paymentCardLogo" />
                    <div style={{ fontSize: "24px", fontWeight: "500", color: "rgba(255, 255, 255, 0.6)" }}>
                      {currentPaymentMethod?.brand}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-auto px-2">
                    <div className="d-flex fw-bold text-light align-items-center">
                      <div className="me-1" style={{ width: "115px", height: "12px", backgroundColor: "#A0C49D" }} />
                      {currentPaymentMethod?.last_4}
                    </div>
                    <div className="fw-bold text-light">
                      {currentPaymentMethod?.exp_month || "00"}
                      /
                      {currentPaymentMethod?.exp_year || "00"}
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="mb-4" sm={4} lg={2}>
                <div className="payment-card-back p-3" ref={paymentCardBack}>
                  <div className="top-right-oval" />
                  <div className="bottom-left-oval" />
                  <div className="d-flex justify-content-between mt-3" style={{ height: "31px" }}>
                    <img src={paymentCardSingleLogo} alt="paymentCardLogo" />
                    <div style={{ fontSize: "16px", fontWeight: "500", color: "rgba(255, 255, 255, 0.6)" }}>
                      {currentPaymentMethod?.brand}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-auto px-2">
                    <img src={sim} alt="paymentCardLogo" className="mb-3" style={{ height: "35px" }} />
                    <div className="fw-bold text-light my-auto" style={{ fontSize: "11px" }}>
                      {currentPaymentMethod?.exp_month || "00"}
                      /
                      {currentPaymentMethod?.exp_year || "00"}
                    </div>
                  </div>
                </div>
              </Col>

              <div className="d-flex justify-content-end mt-5">
                <Col xs={12} md={5} lg={3}>
                  <Button
                    variant="success"
                    className="me-3 px-5 py-0"
                    style={{ fontSize: "12px !important" }}
                    role="link"
                    onClick={handleUpdatePaymentMethod}
                  >
                    Update Card Details
                  </Button>
                </Col>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaymentMethod;
