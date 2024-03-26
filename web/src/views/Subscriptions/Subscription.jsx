import React, { useEffect } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faDownload,
  faInfo,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Alert, Tooltip } from "@mui/material";
import {
  cancelSubscription,
  resumeSubscription,
  listSubscriptions,
  getInvoiceList,
} from "../redux/Subscriptions/SubscriptionsSlice";
import timeIcon from "../../assets/images/post-ad/carbon_time.svg";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import { secureInstance } from "../../axios/config";
import { setScreenLoading } from "../redux/Auth/authSlice";
// import cancelIcon from "../../assets/images/cancel.svg";

const Subscription = ({ subscription }) => {
  const CANCELLED = ["cancelled"];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { invoiceList, invoiceLoading } = useSelector(
    (state) => state.subscriptions
  );
  const [invoiceModal, setInvoiceModal] = React.useState(false);
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
  const formattedDate = (d) =>
    `${date(d).getDate().toString()}${getOrdinalSuffix(
      date(d).getDate()
    )} ${date(d).toLocaleString("en-US", { month: "long" })}, ${date(d)
      .getFullYear()
      .toString()}`;

  const handleCancelSubscription = async () => {
    dispatch(cancelSubscription());
    setDeleteModal(false);
    setTimeout(() => {
      dispatch(listSubscriptions());
    }, 2000);
  };

  const handleResumeSubscription = async () => {
    dispatch(resumeSubscription());
    setDeleteModal(false);
    setTimeout(() => {
      dispatch(listSubscriptions());
    }, 2000);
  };

  const handleDownloadInvoice = (url) => {
    if (subscription.name.toLowerCase() === "free") return;
    dispatch(setScreenLoading(true));
    try {
      const a = document.createElement("a");
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
      setMessage({
        text: "downloaded",
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
    if (message.text !== null) {
      setTimeout(() => {
        setMessage({
          ...message,
          text: null,
        });
      }, 3000);
    }
  }, [message]);

  useEffect(() => {
    if (invoiceModal) {
      dispatch(getInvoiceList(subscription.id));
    }
  }, [invoiceModal]);

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
          zIndex: 2000,
        }}
      >
        {message.text || ""}
      </Alert>

      {/* Invoice modal */}
      <Modal
        show={invoiceModal}
        onHide={() => {
          setInvoiceModal(false);
        }}
        size="md"
        aria-labelledby="example-custom-modal-styling-title"
        centered="true"
      >
        <div
          className="box"
          style={{ position: "absolute", right: "3.5px", top: "3px" }}
        />
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
              setInvoiceModal(false);
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
          {invoiceLoading ? (
            <div className="loading-icon" style={{ height: "100px" }}>
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          ) : (
            <div class="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Amount Paid</th>
                    <th scope="col">Amount Due</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created At</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((inv) => (
                    <tr>
                      <td>{inv.amount_paid}</td>
                      <td>{inv.amount_due}</td>
                      <td>{inv.status}</td>
                      <td>{inv.created}</td>
                      <td>
                        <Tooltip
                          className="ms-3"
                          title="download"
                          placement="top"
                        >
                          <div
                            className="d-flex"
                            style={{
                              borderRadius: "50%",
                              height: "32px",
                              width: "32px",
                              backgroundColor: "rgba(217, 217, 217, 1)",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleDownloadInvoice(inv.invoice_pdf);
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-auto my-auto"
                              icon={faDownload}
                            />
                          </div>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invoiceList.length === 0 && (
                <div>There are no invoices to download</div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Invoice modal */}

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
            Do you really want to{" "}
            {subscription.cancel_at_period_end ? "resume" : "cancel"} this
            subscription?
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
            onClick={() =>
              subscription.cancel_at_period_end
                ? handleResumeSubscription()
                : handleCancelSubscription()
            }
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mx-0 mt-4 w-100 ps-2 p-3 subscription-free">
        <h2>{subscription.name}</h2>
        <div className="d-flex w-100">
          <img
            src={timeIcon}
            alt="time icon"
            style={{ width: "25px", height: "25px" }}
          />
          <div
            className="my-auto ms-1"
            style={{ fontSize: "18px", lineHeight: "18px" }}
          >
            {formattedDate(subscription?.created_at)}
          </div>
        </div>
        {subscription.cancel_at_period_end && (
          <div className="mt-1" style={{ fontSize: "18px", fontWeight: "500" }}>
            Cancels on {formattedDate(subscription.cancel_date)}
          </div>
        )}
        <div className="d-sm-flex justify-content-between mt-3">
          <div>
            <div className="mb-3 my-sm-auto w-100">
              Allowed Ads: {subscription.allowed_ads}
            </div>
            {subscription.status === "unpaid" && (
              <div className="d-flex align-items-center w-100">
                <div
                  style={infostyle}
                  className="d-flex align-items-center justify-content-center me-1"
                >
                  <FontAwesomeIcon icon={faInfo} size="sm" />
                </div>
                Plan failed to renew, please update your payment method.{" "}
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
            )}
          </div>
          {!CANCELLED.includes(subscription.status) && (
            <div className="d-flex align-items-center">
              {subscription.cancel_at_period_end ? (
                <Button
                  type="button"
                  variant="success"
                  className="me-3 px-5 py-0"
                  style={{ fontSize: "12px !important", height: "32px" }}
                  disabled={!user.is_verified}
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
                    disabled={
                      subscription.status === "unpaid" || !user.is_verified
                    }
                    style={{ fontSize: "12px !important", height: "32px" }}
                    onClick={() => navigate("/plans")}
                  >
                    Upgrade
                  </Button>

                  <Tooltip
                    title={
                      subscription.name.toLowerCase() === "free"
                        ? "Cannot cancel a free subscription"
                        : "Cancel Subscription"
                    }
                    placement="top"
                  >
                    <div
                      className="d-flex"
                      style={{
                        borderRadius: "50%",
                        height: "32px",
                        width: "32px",
                        backgroundColor: "rgba(217, 217, 217, 1)",
                        cursor: "pointer",
                      }}
                      onClick={
                        subscription.name.toLowerCase() === "free"
                          ? null
                          : () => setDeleteModal(true)
                      }
                    >
                      <FontAwesomeIcon
                        className="mx-auto my-auto"
                        icon={faBan}
                      />
                    </div>
                  </Tooltip>

                  <Tooltip
                    className="ms-3"
                    title={
                      subscription.name.toLowerCase() === "free"
                        ? "There is no invoice for free plan"
                        : "Download Invoice"
                    }
                    placement="top"
                  >
                    <div
                      className="d-flex"
                      style={{
                        borderRadius: "50%",
                        height: "32px",
                        width: "32px",
                        backgroundColor: "rgba(217, 217, 217, 1)",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (subscription.name.toLowerCase() !== "free") {
                          setInvoiceModal(true);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        className="mx-auto my-auto"
                        icon={faDownload}
                      />
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          )}
        </div>
      </Row>
    </>
  );
};

export default Subscription;
