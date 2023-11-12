import React, { useEffect, useState } from "react";
import {
  Col, Card, Button, OverlayTrigger, Tooltip, Modal, Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faCircleDollarToSlot, faInfo, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
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
  const { currentPaymentMethod } = useSelector((state) => state.subscriptions);

  const [currentPlanPrice, setCurrentPlanPrice] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [warnings, setWarings] = useState([]);

  const regex = /\[(.*?)\]\((.*?)\)/;
  const cardColors = ["#e8e8e8", "#FFFAD6", "#D8FFFB", "#DBE5FF"];
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

  const notSubscribed = () => (user.userId === null || (user.userId !== null && currentSubscription.priceId === ""));

  const handleUpgradeValidation = async () => {
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/validate-update-subscription/",
        method: "Post",
        data: {
          allowed_ads: plan.allowed_ads,
        },
      });

      if (["", null, undefined].includes(response.data.data) || response.data.data.length === 0) {
        setShowModal(true);
      } else {
        setWarings(response.data.data);
        setShowValidateModal(true);
      }
    } catch (err) {
      // error handling
    }
  };

  const handlePlanButtonClick = () => (notSubscribed() ? setShowModal(true) : handleUpgradeValidation());

  const handlePlanSubscription = async () => {
    if (notSubscribed()) {
      dispatch(createSubscription({ data: { price_id: currentPlanPrice?.price_id, allowed_ads: plan.allowed_ads }, navigate }));
    } else {
      const data = {
        price_id: currentPlanPrice.price_id,
        allowed_ads: plan.allowed_ads,
      };
      dispatch(updateSubscription({ data, navigate }));
    }
  };

  const getSubscribeButtonText = () => {
    if (user.userId === null || (user.userId !== null && currentSubscription.priceId === "")) return "Subscribe";
    if (user.userId !== null && currentSubscription.priceId === currentPlanPrice?.price_id) return "Current Plan";

    return "Upgrade";
  };

  useEffect(() => {
    setCurrentPlanPrice(
      plan.prices.filter(
        (price) => price.interval === currentInterval.interval && price.interval_count === currentInterval.intervalCount,
      )[0],
    );
  }, [currentInterval]);

  return (
    (currentPlanPrice?.unit_price || plan.name === "FREE") && (
      <>
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          size="md"
          aria-labelledby="example-custom-modal-styling-title"
          centered="true"
        >
          <div className="box" style={{ position: "absolute", right: "3.5px", top: "3px" }} />
          <div
            style={{
              position: "absolute",
              right: "11px",
              top: "6px",
              zIndex: "20",
            }}
          >
            <div
              role="presentation"
              onClick={() => {
                setShowModal(false);
              }}
              className="close-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M17 1L1 17M1 1L17 17"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <Modal.Body className="text-center">
            <h4 className="w-100 mb-5 mt-3 fw-bold">{notSubscribed() ? "Ready to become a Pro Seller?" : "Are you ready to upgrade?"}</h4>
            <div className="mx-5 my-3 text-secondary fw-normal">
              {notSubscribed() ? "" : "Upgrading brings more clients and more perks!"}
            </div>
            <div
              className="mx-5 my-3 px-4 py-3 d-flex justify-content-between align-items-center"
              style={{ backgroundColor: cardColors[index % 4], borderRadius: "5px" }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-center align-items-center me-2"
                  style={{
                    width: "23px", height: "23px", borderRadius: "50%", backgroundColor: "InfoBackground",
                  }}
                >
                  <FontAwesomeIcon icon={faCircleDollarToSlot} size="lg" />
                </div>
                <h4 className="w-auto my-auto">{plan.name}</h4>
              </div>
              <div className="d-flex">
                <h4 className="fw-normal w-auto mb-0" style={{ lineHeight: "2rem" }}>
                  $
                  {currentPlanPrice?.unit_price || 0}
                </h4>
                <span className="mt-auto">/mo</span>
              </div>
            </div>

            {
              currentPaymentMethod && (
                <>
                  <div
                    className="mx-5 mt-3 px-4 py-2 d-flex justify-content-between align-items-center border border-secondary"
                    style={{ borderRadius: "5px" }}
                  >
                    <div>
                      <h4>
                        {currentPaymentMethod.brand[0].toUpperCase()}
                        {currentPaymentMethod.brand.slice(1)}
                        {" **** "}
                        {currentPaymentMethod.last_4}
                      </h4>
                      <h6 className="fw-normal text-secondary text-start mb-0">
                        Expires:
                        {" "}
                        {`${currentPaymentMethod.exp_month}/${currentPaymentMethod.exp_year.slice(-2)}`}
                      </h6>
                    </div>
                    <div
                      className="roboto-regular-14px-information text-white px-3"
                      style={{
                        borderRadius: "8px",
                        background: "#74BAC3",
                        fontWeight: "500",
                        lineHeight: "22px",
                        height: "fit-content",
                      }}
                    >
                      Default
                    </div>
                  </div>
                  <div className="text-end mt-2 mb-4 me-5 pe-2">
                    Change
                    <span
                      className="click-here"
                      onClick={() => {
                        dispatch(handleProfileSettingsCurrentView("PaymentMethod"));
                        navigate("/profile-settings");
                      }}
                    >
                      payment method
                    </span>
                  </div>
                </>
              )
            }

            <Button
              variant="success"
              className="mx-5 my-3"
              style={{ width: "-webkit-fill-available" }}
              onClick={handlePlanSubscription}
            >
              Proceed
            </Button>
          </Modal.Body>
        </Modal>

        <Modal
          show={showValidateModal}
          onHide={() => {
            setShowValidateModal(false);
          }}
          size="md"
          aria-labelledby="example-custom-modal-styling-title"
          centered="true"
        >
          <div className="box" style={{ position: "absolute", right: "3.5px", top: "3px" }} />
          <div
            style={{
              position: "absolute",
              right: "11px",
              top: "6px",
              zIndex: "20",
            }}
          >
            <div
              role="presentation"
              onClick={() => {
                setShowValidateModal(false);
              }}
              className="close-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M17 1L1 17M1 1L17 17"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <Modal.Body>
            <h4 className="w-100 mb-2 mt-4 fw-bold text-center">Are you sure you want to downgrade?</h4>
            <div className="mx-5 mb-5 text-secondary text-center">
              Downgrading means less perks, less clients!
            </div>
            <div className="mx-4 mb-5">
              <div className="px-3 mb-2 text-secondary">
                If you will downgrade your subscription, here are some actions that will be performed after downgrading:
              </div>
              {
                warnings.map((warning) => (
                  <div className="d-flex w-100 align-items-top ps-3 fw-bold">
                    <FontAwesomeIcon icon={faTriangleExclamation} color="#F7D926" size="lg" className="me-2" />
                    {warning}
                  </div>
                ))
              }
            </div>
            <Row className="mb-3 mx-0">
              <Col sm={4}>
                <Button
                  className="px-3 btn btn-no-border"
                  style={{ width: "-webkit-fill-available" }}
                  onClick={handlePlanSubscription}
                >
                  Downgrade
                </Button>
              </Col>
              <Col sm={8}>
                <Button
                  variant="success"
                  className="px-5"
                  style={{ width: "-webkit-fill-available" }}
                  onClick={() => setShowValidateModal(false)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Col key={index} className="mb-4" sm={12} md={6} lg={3}>
          <Card
            className="p-sm-3 h-100"
            style={{ backgroundColor: cardColors[index % 4] }}
          >
            <Card.Body>
              <h3 className="fw-bold">{plan.name}</h3>
              <Card.Title className="mb-4">
                <span className="display-5 fw-bold">
                  $
                  {currentPlanPrice?.unit_price || 0}
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
            {
              plan.name !== "FREE" && (
                <div className="text-center mb-3">
                  <Button
                    variant="success"
                    className="w-75"
                    onClick={() => handlePlanButtonClick()}
                    disabled={
                      (user.userId !== null && currentSubscription.priceId === currentPlanPrice?.price_id)
                        || currentSubscription.status === "unpaid"
                    }
                  >
                    {
                      getSubscribeButtonText()
                    }
                  </Button>
                </div>
              )
            }
          </Card>
        </Col>
      </>
    )
  );
};

export default Plan;
