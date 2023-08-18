import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toggleRegisterView } from "../redux/Register/RegisterSlice";
import { toggleLoginModal, toggleLoginView } from "../redux/Login/loginSlice";
import planEventsImg from "../../assets/images/planEventsImg.svg";

function StartPlanning() {
  const dispatch = useDispatch();
  const isRegisterView = useSelector((state) => state.register.isRegisterView);
  const isLoginView = useSelector((state) => state.login.isLoginView);

  const handleCreateAccountModal = (e) => {
    if (isLoginView) {
      dispatch(toggleLoginView());
    }
    e.preventDefault();
    if (!isRegisterView) {
      dispatch(toggleRegisterView());
    }
    dispatch(toggleLoginModal());
    // dispatch(toggleRegisterModal());
  };
  return (
    // <div>StartPlanning</div>
    <Container fluid style={{ height: "auto", padding: "0" }}>
      <Row className="h-100 col-12 g-0">
        <Col
          md={5}
          className="d-flex justify-content-left"
          style={{ paddingRight: "0" }}
        >
          <img
            src={planEventsImg}
            alt="planEventsImg"
            style={{ maxWidth: "100%" }}
          />
        </Col>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center"
        >
          <div style={{ padding: "50px 0" }}>
            <div style={{ maxWidth: "461px" }}>
              <div className="text-left roboto-bold-36px-h1">
                Start planning your events!
              </div>
              <p className="text-left roboto-regular-16px-information mt-3">
                Let’s plan together your unforgettable memories! We offer you
                all the necessary tools for managing your events.
              </p>
            </div>
            <div className="d-flex justify-content-left mt-3">
              <Button
                variant="success"
                type="submit"
                className="roboto-semi-bold-16px-information"
                onClick={handleCreateAccountModal}
              >
                Create free account
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default StartPlanning;
