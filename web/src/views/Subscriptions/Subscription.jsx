import React, { useEffect } from "react";
import {
  Button,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faDownload, faInfo } from "@fortawesome/free-solid-svg-icons";
import { Alert, Tooltip } from "@mui/material";
import { cancelSubscription, resumeSubscription, listSubscriptions } from "../redux/Subscriptions/SubscriptionsSlice";
import timeIcon from "../../assets/images/post-ad/carbon_time.svg";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import { secureInstance } from "../../axios/config";
import { setScreenLoading } from "../redux/Auth/authSlice";
// import cancelIcon from "../../assets/images/cancel.svg";

const Subscription = ({ subscription }) => {
  const CANCELLED = ["cancelled"];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = React.useState(false);
  const [message, setMessage] = React.useState({
    type: null,
    text: null,
  });

  const infostyle = {
    backgroundColor: "#9B9B9B",
    color: "white",
    borderRadius: "50%",
    fontSize: "11px",
    width: "16px",
    height: "16px",
  };

  const date = (d) => new Date(d);

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
  const formattedDate = (d) => `${date(d).getDate().toString()}${getOrdinalSuffix(date(d).getDate())} ${
    date(d).toLocaleString("en-US", { month: "long" })}, ${
    date(d).getFullYear().toString()}`;

  const handleCancelSubscription = async () => {
    dispatch(cancelSubscription({ subscription_id: subscription.subscription_id }));
    setDeleteModal(false);
    setTimeout(() => {
      dispatch(listSubscriptions());
    }, 2000);
  };

  const handleResumeSubscription = async () => {
    dispatch(resumeSubscription({ subscription_id: subscription.subscription_id }));
    setDeleteModal(false);
    setTimeout(() => {
      dispatch(listSubscriptions());
    }, 2000);
  };

  const handleDownloadInvoice = async () => {
    dispatch(setScreenLoading(true));
    try {
      const response = await secureInstance.request({
        url: "/api/subscriptions/download-invoice/",
        method: "Get",
      });

      const a = document.createElement("a");
      a.href = response.data.data;
      a.click();

      window.URL.revokeObjectURL(response.data.data);
      setMessage({
        text: response.data.message,
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.message,
        type: "error",
      });
    }
    dispatch(setScreenLoading(false));
  };

  useEffect(() => {
    if (message !== "") {
      setTimeout(() => {
        setMessage({
          type: null,
          text: null,
        });
      }, 4000);
    }
  }, [message]);

  return (
    <>
      <Alert
        severity={message.type || "error"}
        variant="filled"
        style={{
          position: "fixed",
          top: message.text ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: message.text ? 1 : 0,
          zIndex: 2,
        }}
      >
        {message.text || ""}
      </Alert>

      <Modal
        show={deleteModal}
        onHide={() => {
          setDeleteModal(false);
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ border: "none" }} />
        <Modal.Body>
          <h4>
            Do you really want to
            {" "}
            {subscription.cancel_at_period_end ? "resume" : "cancel"}
            {" "}
            this subscription?
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setDeleteModal(false);
            }}
            variant="danger"
            className="btn-md roboto-regular-16px-information text-white"
            style={{
              height: "44px",
              fontWeight: "500",
              paddingLeft: "32px",
              paddingRight: "32px",
            }}
            // style={{ backgroundColor: "red" }}
          >
            No
          </Button>
          <Button
            variant="success"
            onClick={() => (subscription.cancel_at_period_end ? handleResumeSubscription() : handleCancelSubscription())}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mx-0 mt-4 w-100 ps-2 p-3 subscription-free">
        <h2>{subscription.name}</h2>
        <div className="d-flex w-100">
          <img src={timeIcon} alt="time icon" style={{ width: "25px", height: "25px" }} />
          <div className="my-auto ms-1" style={{ fontSize: "18px", lineHeight: "18px" }}>{formattedDate(subscription?.created_at)}</div>
        </div>
        {
          subscription.cancel_at_period_end && (
            <div className="mt-1" style={{ fontSize: "18px", fontWeight: "500" }}>
              Cancels on
              {" "}
              {formattedDate(subscription.cancel_date)}
            </div>
          )
        }
        <div className="d-sm-flex justify-content-between mt-3">
          <div>
            <div className="mb-3 my-sm-auto w-100">
              Allowed Ads:
              {" "}
              {subscription.allowed_ads}
            </div>
            {
              subscription.status === "unpaid" && (
                <div className="d-flex align-items-center w-100">
                  <div
                    style={infostyle}
                    className="d-flex align-items-center justify-content-center me-1"
                  >
                    <FontAwesomeIcon
                      icon={faInfo}
                      size="sm"
                    />
                  </div>
                  Plan failed to renew, please update your payment method.
                  {" "}
                  <span
                    className="click-here"
                    onClick={() => {
                      dispatch(handleProfileSettingsCurrentView("PaymentMethod"));
                      navigate("/profile-settings");
                    }}
                  >
                    Click here
                  </span>
                </div>
              )
            }
          </div>
          {
            !CANCELLED.includes(subscription.status) && (
              <div className="d-flex align-items-center">
                {
                  subscription.cancel_at_period_end ? (
                    <Button
                      type="button"
                      variant="success"
                      className="me-3 px-5 py-0"
                      style={{ fontSize: "12px !important", height: "32px" }}
                      onClick={() => setDeleteModal(true)}
                    >
                      Resume
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="success"
                        className="me-3 px-5 py-0"
                        style={{ fontSize: "12px !important", height: "32px" }}
                        onClick={() => navigate("/plans")}
                      >
                        Upgrade
                      </Button>

                      <Tooltip title="Cancel subscription" placement="top">
                        <div
                          className="d-flex"
                          style={{
                            borderRadius: "50%", height: "32px", width: "32px", backgroundColor: "rgba(217, 217, 217, 1)", cursor: "pointer",
                          }}
                          onClick={() => setDeleteModal(true)}
                        >
                          <FontAwesomeIcon className="mx-auto my-auto" icon={faBan} />
                        </div>
                      </Tooltip>

                      <Tooltip className="ms-3" title="Download Invoice" placement="top">
                        <div
                          className="d-flex"
                          style={{
                            borderRadius: "50%", height: "32px", width: "32px", backgroundColor: "rgba(217, 217, 217, 1)", cursor: "pointer",
                          }}
                          onClick={handleDownloadInvoice}
                        >
                          <FontAwesomeIcon className="mx-auto my-auto" icon={faDownload} />
                        </div>
                      </Tooltip>
                    </>
                  )
                }
              </div>
            )
          }
        </div>
      </Row>
    </>
  );
};

export default Subscription;
