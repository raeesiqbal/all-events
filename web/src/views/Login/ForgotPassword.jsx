/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useState } from "react";
import { Button, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as formik from "formik";
import * as Yup from "yup";
import Featured from "../../assets/images/Featured.svg";
import GreenTick from "../../assets/images/green-tick.svg";
import "./Login.css";
import { toggleLoginView } from "../redux/Login/loginSlice";
import { instance, secure_instance } from "../../axios/axios-config";

function ForgotPassword({ setForgotPassword }) {
  const { Formik } = formik;
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginClick = () => {
    // show login view
    setForgotPassword(false);
    dispatch(toggleLoginView());
  };

  const handleResetPassword = async (values, { resetForm }) => {
    try {
      setLoading(true);
      await instance.request({
        url: "/api/password-reset/",
        method: "Post",
        data: {
          email: values.email,
        },
      });
      setLoading(false);
      setEmail(values.email);
      setIsResetEmailSent(true);
    } catch (e) {
      setLoading(false);
      // --------- WILL ROUTE ON SOME PAGE ON FAILURE ---------
      console.log("error", e);
    }

    // handleLoginClick();
  };

  const InitialValues = {
    email: "",
  };

  const Schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is Required"),
  });

  return (
    <Col md={12} lg={6} className="login-modal-form-col">
      {!isResetEmailSent ? (
        <Formik
          validationSchema={Schema}
          // onSubmit={handleNextStep}
          onSubmit={handleResetPassword}
          initialValues={InitialValues}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <div className="d-flex justify-content-center align-items-center">
                <img src={Featured} alt="Featured" className="mb-3" />
              </div>
              <div
                className="d-flex justify-content-center align-items-center h4"
                style={{ marginBottom: "32px", marginTop: "27px" }}
              >
                Forgot Password?
              </div>
              <div
                className="d-flex justify-content-center align-items-center body text-center"
                style={{ marginBottom: "50px", padding: "0 50px" }}
              >
                Enter your email and we will send you a link that will redirect
                you to
                <br /> Reset your password
              </div>

              <Form.Group className="form-group mb-4" controlId="form3Example3">
                <Form.Control
                  style={{ height: "56px" }}
                  className="lg-input-small-text"
                  name="email"
                  type="email"
                  size="lg"
                  placeholder="Enter Email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="text-center text-lg-start mt-4 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success roboto-semi-bold-16px-information btn-lg w-100"
                  style={{ padding: "0 100px" }}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Send"}
                </Button>

                <div className="row" style={{ textAlign: "center" }}>
                  <p className="roboto-regular-16px-information mt-3 pt-1 mb-0 ">
                    Already have an account?{" "}
                    <a
                      href="#!"
                      style={{ color: "#0558FF", textDecoration: "none" }}
                      onClick={handleLoginClick}
                    >
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <Form>
          <div className="d-flex justify-content-center align-items-center">
            <img src={GreenTick} alt="GreenTick" className="mb-3" />
          </div>
          <div
            className="d-flex justify-content-center align-items-center h4"
            style={{ marginBottom: "32px", marginTop: "27px" }}
          >
            Email Sent
          </div>
          <div
            className="d-flex justify-content-center align-items-center body text-center"
            style={{ marginBottom: "50px", padding: "0 50px" }}
          >
            We have sent you an email for setting up a new password
          </div>

          <Form.Group className="form-group mb-4" controlId="form3Example3">
            <Form.Control
              style={{ height: "56px", color: "#797979" }}
              className="lg-input-small-text"
              name="email"
              type="email"
              size="lg"
              placeholder="Enter Email"
              value={email}
              disabled
            />
          </Form.Group>
          <div className="text-center text-lg-start mt-4 pt-2">
            <Button
              type="button"
              className="btn btn-success btn-lg w-100"
              style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              onClick={handleLoginClick}
            >
              Back to Login
            </Button>

            <div className="row" style={{ textAlign: "center" }}>
              <p className="small fw-bold mt-5 pt-1 mb-0">
                {" Already have an account?"}{" "}
                <a href="#!" className="link" onClick={handleLoginClick}>
                  Login
                </a>
              </p>
            </div>
          </div>
        </Form>
      )}
    </Col>
  );
}

export default ForgotPassword;
