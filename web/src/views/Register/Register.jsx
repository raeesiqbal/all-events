/* eslint-disable max-len */
import React, { useState } from "react";
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import {
  Button, Col, Container, Form, Modal, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import Featured from "../../assets/images/Featured.svg";
import loginImg1 from "../../assets/images/login-img-1.svg";
import X from "../../assets/images/X.svg";
import heroImg from "../../assets/images/harold.jpg";
import "./Register.css";
// import { toggleLoginModal } from "../redux/Login/loginSlice";
import Stepper from "../../components/Stepper/Stepper";
import { toggleRegisterModal } from "../redux/Register/RegisterSlice";
// import { faClose } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserDetails() {
  return <h2>User details</h2>;
}

function Payment() {
  return <h2>Payment information</h2>;
}

function Confirmation() {
  return <h2>Booking is confirmed</h2>;
}

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();

  const isRegisterModal = useSelector((state) => state.register.isRegisterModal);

  const handleClose = () => dispatch(toggleRegisterModal());

  const steps = [
    "User details",
    "Payment",
    "Booking confirmation",
  ];

  function getSectionComponent() {
    switch (activeStep) {
      case 0: return <UserDetails />;
      case 1: return <Payment />;
      case 2: return <Confirmation />;
      default: return null;
    }
  }
  return (
    // <Modal show={isLoginModal} onHide={handleClose} size="xl" centered="true">
    <Modal
      show={isRegisterModal}
      onHide={handleClose}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
      centered="true"
    >

      <div className="box" style={{ position: "absolute", right: "0" }} />
      <div style={{ position: "absolute", right: "0" }}>

        <div role="presentation" onClick={handleClose}>
          <img src={X} alt="X" className="close-icon" style={{ cursor: "pointer" }} />
        </div>
      </div>
      <Container fluid style={{ height: "auto", padding: "0" }}>
        <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
          <Col md={12} lg={6} className="login-modal-form-col">
            <Form>
              <div className="d-flex justify-content-center align-items-center h4" style={{ marginBottom: "36px" }}>Register</div>

              <div>
                <Stepper
                  steps={steps}
                  activeStep={activeStep}
                />
                <div style={{ padding: "20px" }}>
                  {getSectionComponent()}
                  {(activeStep !== 0 && activeStep !== steps.length - 1)
                    && <button type="button" onClick={() => setActiveStep(activeStep - 1)}>Previous</button>}
                  {activeStep !== steps.length - 1
                    && <button type="button" onClick={() => setActiveStep(activeStep + 1)}>Next</button>}
                </div>
              </div>

              <Form.Group className="mb-4" controlId="form3Example3">
                <Form.Control style={{ height: "56px" }} className="lg-input-small-text" type="email" size="lg" placeholder="Enter Email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="form3Example4">
                <Form.Control style={{ height: "56px" }} className="lg-input-small-text" type="password" size="lg" placeholder="Enter Password" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="form3Example5">
                <Form.Control style={{ height: "56px" }} className="lg-input-small-text" type="password" size="lg" placeholder="Re-enter Password" />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <Form.Check type="checkbox" className="mb-0">
                  <Form.Check.Input className="me-2" />
                  <Form.Check.Label>Keep me updated with the latest news</Form.Check.Label>
                </Form.Check>
                <Form.Check type="checkbox" className="mb-0">
                  <Form.Check.Input className="me-2" />
                  <Form.Check.Label>I agree to the Terms & Conditions</Form.Check.Label>
                </Form.Check>
              </div>
              {/* <a href="#!" className="text-body">Forgot password?</a> */}

              <div className="text-center text-lg-start mt-4 pt-2">
                <Button type="button" className="btn btn-success btn-lg w-100" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>
                  Register
                </Button>

                <div className="row" style={{ textAlign: "center" }}>
                  <p className="small fw-bold mt-3 pt-1 mb-0 ">
                    Already have an account?
                    {" "}
                    <a href="#!" className="link-danger">Login</a>
                  </p>
                </div>
              </div>
            </Form>
          </Col>
          <Col md={0} lg={6} className="d-flex login-image-mobile" style={{ justifyContent: "right", paddingRight: "0" }}>
            <img src={heroImg} alt="heroImg" style={{ maxWidth: "100%", objectFit: "cover" }} />
          </Col>
        </Row>
      </Container>
    </Modal>
    // </section>
  );
}

export default Register;
