import React from "react";
import {
  Button,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import timeIcon from "../../assets/images/post-ad/carbon_time.svg";
import { cancelSubscription, resumeSubscription, listSubscriptions } from "../redux/Subscriptions/SubscriptionsSlice";
// import cancelIcon from "../../assets/images/cancel.svg";

const Subscription = ({ subscription }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = React.useState(false);

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
  const formattedDate = (d) => `${`${date(d).getDate() + getOrdinalSuffix(date(d).getDate())} ${
    date(d).toLocaleString("en-US", { month: "long" })}, ${
    date(d).getFullYear()}`}`;

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

  return (
    <>
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
        <h2>{subscription.type.type}</h2>
        <div className="d-flex w-100">
          <img src={timeIcon} alt="time icon" style={{ width: "20px", height: "20px" }} />
          <div className="my-auto ms-1" style={{ fontSize: "14px" }}>{formattedDate(subscription.created_at)}</div>
        </div>
        {
          subscription.cancel_at_period_end && (
            <div className="mt-1" style={{ fontSize: "14px", fontWeight: "500" }}>
              Validation date:
              {" "}
              {formattedDate(subscription.cancel_date)}
            </div>
          )
        }
        <div className="d-sm-flex justify-content-between mt-3">
          <div className="mb-3 my-sm-auto" style={{ fontSize: "13px" }}>
            Allowed Ads:
            {" "}
            {subscription.type.allowed_ads}
          </div>
          <div className="d-flex">
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
                  <div
                    className="d-flex"
                    style={{
                      borderRadius: "50%", height: "32px", width: "32px", backgroundColor: "rgba(217, 217, 217, 1)", cursor: "pointer",
                    }}
                    onClick={() => setDeleteModal(true)}
                  >
                    <FontAwesomeIcon className="mx-auto my-auto" icon={faBan} />
                  </div>
                </>
              )
            }
          </div>
        </div>
      </Row>
    </>
  );
};

export default Subscription;
