/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Spinner } from "react-bootstrap";
import * as formik from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import Featured from "../../assets/images/Featured.svg";
import "../Login/Login.css";
import visibility from "../../assets/images/visibility.svg";
import visibilityHide from "../../assets/images/visibility-hide.svg";
import baseURL from "../../utilities/BaseURL";

function ResetPassword() {
  const { Formik } = formik;
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const handleResetPassword = async (values, { resetForm }) => {
    const payload = {
      token,
      password: values.password,
    };

    try {
      setLoading(true);
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      axiosInstance
        .post(`${baseURL}/api/password-reset/confirm/`, payload)
        .then(() => {
          setLoading(false);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
          setIsAlert(true);
        });
    } catch (err) {
      console.log(err);
      // return rejectWithValue(err.response.data);
    }
  };

  const InitialValues = {
    password: "",
    confirm_password: "",
  };

  const Schema = Yup.object().shape({
    password: Yup.string()
      .test(
        "contains-mixed-characters",
        "Password must contain both numeric and non-numeric characters",
        (value) => /[0-9]/.test(value) && /[^0-9]/.test(value)
      )
      .required("Password is required")
      .min(5, "Your password is too short."),
    confirm_password: Yup.string()
      .required("Passwords must match")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const getVisibilityIcon = () => (
    <div style={{ position: "absolute", right: "15px", top: "15px" }}>
      {isShowPassword ? (
        <img
          role="presentation"
          src={visibility}
          alt="visibility"
          style={{ cursor: "pointer" }}
          onClick={() => setIsShowPassword(false)}
        />
      ) : (
        <img
          role="presentation"
          src={visibilityHide}
          alt="visibilityHide"
          style={{ cursor: "pointer" }}
          onClick={() => setIsShowPassword(true)}
        />
      )}
    </div>
  );

  useEffect(() => {
    // Get the URL search params
    const urlSearchParams = new URLSearchParams(window.location.search);

    // Get the token from the "token" parameter in the URL
    const tokenFromURL = urlSearchParams.get("token");

    // Now you can use the token for further processing
    if (tokenFromURL) {
      setToken(tokenFromURL);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false);
    }, 5000);
  }, [isAlert]);

  return (
    <Container
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Alert
        severity="error"
        variant="filled"
        style={{
          position: "fixed",
          top: isAlert ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: isAlert ? 1 : 0,
          // width: "150px",
        }}
      >
        Something went wrong
      </Alert>

      <Col md={12} lg={6} className="login-modal-form-col">
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
                style={{ marginBottom: "40px", marginTop: "22px" }}
              >
                Reset Password
              </div>
              <Form.Group
                className="mb-3"
                controlId="form3Example4"
                style={{ position: "relative" }}
              >
                <Form.Control
                  style={{ height: "56px" }}
                  className="hide-validation-icon lg-input-small-text"
                  name="password"
                  type={isShowPassword ? "text" : "password"}
                  size="lg"
                  placeholder="Enter New Password"
                  value={values.password}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                  isInvalid={!!errors.password}
                />
                {getVisibilityIcon()}
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="form3Example4"
                style={{ position: "relative" }}
              >
                <Form.Control
                  style={{ height: "56px" }}
                  className="hide-validation-icon lg-input-small-text"
                  name="confirm_password"
                  type={isShowPassword ? "text" : "password"}
                  size="lg"
                  placeholder="Confirm New Password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  isValid={touched.confirm_password && !errors.confirm_password}
                  isInvalid={!!errors.confirm_password}
                />
                {getVisibilityIcon()}
                <Form.Control.Feedback type="invalid">
                  {errors.confirm_password}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="text-center text-lg-start mt-4 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success roboto-semi-bold-16px-information btn-lg w-100"
                  style={{ padding: "0 100px" }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Container>
  );
}

export default ResetPassword;
