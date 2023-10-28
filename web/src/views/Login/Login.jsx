/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-confusing-arrow */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as formik from "formik";
import * as Yup from "yup";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Featured from "../../assets/images/Featured.svg";
import arrowBack from "../../assets/images/arrow-back.svg";
import visibility from "../../assets/images/visibility.svg";
import visibilityHide from "../../assets/images/visibility-hide.svg";
import documentIcon from "../../assets/images/ep_document.svg";
import vendorIcon from "../../assets/images/vendor-icon.svg";
import userIcon from "../../assets/images/user-icon.png";
import arctIcon from "../../assets/images/arcticons_samsung-shop.svg";
import "./Login.css";
import { toggleLoginModal, toggleLoginView } from "../redux/Login/loginSlice";
import { toggleRegisterView } from "../redux/Register/RegisterSlice";
import StepperForm from "../../components/Stepper/Stepper";
import {
  handleNextStep,
  handlePrevStep,
  setActiveStep,
} from "../redux/Stepper/StepperSlice";
import ForgotPassword from "./ForgotPassword";
import CarouselFadeExample from "../../components/Carousel/SingleImgCarousel";
import {
  handleLogin,
  handleLoginStatusFalse,
  handleRegister,
  handleResgisterationStatus,
  handleWelcomeUserAlert,
} from "../redux/Auth/authSlice";
import { instance } from "../../axios/config";
import DynamicRegisterationView from "./ViewHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Formik } = formik;

  const step1InitialValues = {
    email: "",
    password: "",
    password_check: "",
    contact_person_first_name: "",
    contact_person_last_name: "",
  };

  const step2InitialValues = {
    company_name: "",
    county: "",
    city: "",
    address: "",
    postal_code: "",
    fiscal_code: "",
    firm_number: "",
    bank_name: "",
    bank_iban: "",
    terms_acceptance: false,
    newsletter: true,
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is Required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Your password is too short."),
  });

  const step1Schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is Required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Must be at least 6 characters")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/\d/, "Must contain at least one digit"),
    // .required("Password is required")
    // .min(5, "Your password is too short."),
    phone_number: Yup.string()
      .min(8, "Must be at least 8 digits")
      .max(15, "Must be less than 15 digits")
      .matches(/^\+?[0-9]{1,15}$/, "Must be a valid phone number"),
    // .matches(/^\+?\d/, "Must include digits only"),
    password_check: Yup.string()
      .required("Passwords must match")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    contact_person_first_name: Yup.string()
      .required("First name is required")
      .min(2, "Must be at least 2 characters")
      .max(20, "Must be at most 20 characters")
      .matches(
        /^[a-zA-Z\s-]*$/,
        "Must only contain letters, spaces, and hyphens"
      ),
    contact_person_last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Must be at least 2 characters")
      .max(20, "Must be at most 20 characters")
      .matches(
        /^[a-zA-Z\s-]*$/,
        "Must only contain letters, spaces, and hyphens"
      ),
    // terms_acceptance: Yup.bool()
    //   .required()
    //   .oneOf([true], "Terms must be accepted"),
  });

  const step2Schema = Yup.object().shape({
    company_name: Yup.string()
      .required("Company Name is required")
      .min(6, "Must be at least 6 characters")
      .max(50, "Must be at most 50 characters")
      .matches(
        /^[a-zA-Z0-9, .&\s]*$/,
        'Must only contain letters, numbers, spaces, ", . &" signs'
      ),
    // .matches(
    //   /^[a-zA-Z, .&\s]*$/,
    //   'Must only contain letters, spaces ", . &" signs'
    // ),
    county: Yup.string().required(),
    city: Yup.string()
      .required("City is required")
      .min(3, "Must be at least 3 characters")
      .max(25, "Must be at most 25 characters")
      .matches(/^[a-zA-Z\s-]*$/, 'Must only contain letters, spaces, and "-"'),
    address: Yup.string()
      .required("Address is required")
      .min(5, "Must be at least 5 characters")
      .max(80, "Must be at most 80 characters")
      .matches(
        /^[a-zA-Z0-9, .\-/]*$/,
        'Can only contain letters, digits, spaces, ",", ".", "-", and "/" signs'
      ),
    postal_code: Yup.string()
      .min(5, "Must be at least 5 digits")
      .max(7, "Must be at most 7 digits")
      .matches(/^\d{5,7}$/, "Must only contain digits"),
    fiscal_code: Yup.string()
      .required("Fiscal code is required")
      .min(4, "Must be at least 4 characters")
      .max(20, "Must be at most 20 characters")
      .matches(
        /^[a-zA-Z0-9\s]*$/,
        "Can only contain letters, digits, and spaces"
      ),
    firm_number: Yup.string()
      .required("Firm number is required")
      .min(4, "Must be at least 4 characters")
      .max(20, "Must be at most 20 characters")
      .matches(
        /^[a-zA-Z0-9/.]*$/,
        'Can only contain letters, digits, "/", and "." signs'
      ),
    bank_name: Yup.string()
      .max(30, "Must be at most 30 characters")
      .matches(
        /^[a-zA-Z0-9\s]*$/,
        "Can only contain letters, digits, and spaces"
      ),
    bank_iban: Yup.string()
      .max(30, "Bank IBAN must be at most 30 characters")
      .matches(/^[a-zA-Z0-9]*$/, "Can only contain letters and digits"),
    terms_acceptance: Yup.bool()
      .required()
      .oneOf([true], "Terms must be accepted"),
    newsletter: Yup.bool(),
  });

  const isLoginModal = useSelector((state) => state.login.isLoginModal);
  const isLoginView = useSelector((state) => state.login.isLoginView);
  const isRegistered = useSelector((state) => state.auth.isRegistered);
  const isLoggedInState = useSelector((state) => state.auth.isLoggedInState);
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);
  const isRegisterView = useSelector((state) => state.register.isRegisterView);
  const activeStep = useSelector((state) => state.stepper.activeStep);

  const [forgotPassword, setForgotPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [tempCredentials, setTempCredentials] = useState({
    email: "",
    password: "",
  });
  const [countries, setCountries] = useState([]);
  const [selectedRole, setSelectedRole] = useState("client");
  const [hideRegisterStep1, setHideRegisterStep1] = useState(false);

  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const handleClose = () => {
    setHideRegisterStep1(false);
    dispatch(toggleLoginModal());
  };

  useEffect(() => {
    if (isRegisterView && error && error.user?.email) {
      if (error.user.email.length > 0) {
        dispatch(setActiveStep(0));
      }
    }
  }, [error]);

  const listCountries = async () => {
    const request = await instance.request({
      url: "/api/ads/country/",
      method: "Get",
    });
    setCountries(request.data.data);
  };

  useEffect(() => {
    listCountries();
  }, []);

  const handleRegisterClick = () => {
    // hide login view
    dispatch(toggleLoginView());
    // show register view
    dispatch(toggleRegisterView());
  };

  const handleLoginClick = () => {
    // show login view
    dispatch(toggleLoginView());
    // hide register view
    dispatch(toggleRegisterView());
  };

  const handleClickArrowBack = () => {
    if (forgotPassword) {
      setForgotPassword(false);
      dispatch(toggleLoginView());
    } else {
      dispatch(handlePrevStep());
    }
  };

  const handleClickForgotPassword = () => {
    if (isLoginView) {
      dispatch(toggleLoginView());
    }
    setForgotPassword(true);
  };

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

  const handleStep1Submit = () => {
    dispatch(handleNextStep());
    console.log("aaa");
  };

  const handleRegisterationSubmit = (values, { resetForm }) => {
    let data = {
      user: {
        email: values.email,
        first_name: values.contact_person_first_name,
        last_name: values.contact_person_last_name,
        phone: values.phone_number,
        password: values.password,
        role: "vendor_user",
        // eslint-disable-next-line no-unneeded-ternary
        newsletter:
          // eslint-disable-next-line no-unneeded-ternary
          values.newsletter === undefined || values.newsletter === true
            ? true
            : false,
        terms_acceptance: values.terms_acceptance,
      },
    };

    setTempCredentials({
      email: values.email,
      password: values.password,
    });

    if (selectedRole === "vendor") {
      data = {
        ...data,
        name: values.company_name,
        is_active: true,
        postal_code: values.postal_code,
        fiscal_code: values.fiscal_code,
        address: values.address,
        firm_number: values.firm_number,
        bank_name: values.bank_name,
        bank_iban: values.bank_iban,
        country: parseInt(values.county, 10),
        city: values.city,
      };
    }

    dispatch(handleRegister({ data, role: selectedRole }));
    // resetForm();
  };

  const handleSubmitLogin = (values, { resetForm }) => {
    dispatch(
      handleLogin({
        email: values.email,
        password: values.password,
      })
    );
  };

  useEffect(() => {
    if (isRegistered) {
      dispatch(
        handleLogin({
          email: tempCredentials.email,
          password: tempCredentials.password,
        })
      );
      dispatch(handleResgisterationStatus());
      setTimeout(() => {
        dispatch(handleWelcomeUserAlert(true));
      }, 1000);
    }
  }, [isRegistered]);

  useEffect(() => {
    if (isLoggedInState) {
      handleClose();
      dispatch(handleLoginStatusFalse());
      navigate("/dashboard");
      // navigate(selectedRole === "client" ? "/" : "/dashboard");
    }
  }, [isLoggedInState]);

  return (
    <Modal
      show={isLoginModal}
      onHide={handleClose}
      dialogClassName="modal-90w"
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
        <div role="presentation" onClick={handleClose} className="close-icon">
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

      {selectedRole !== "client" && activeStep > 0 && (
        <div
          style={{
            position: "absolute",
            left: "0",
            paddingTop: "18px",
            paddingLeft: "24px",
          }}
        >
          <div role="presentation" onClick={handleClickArrowBack}>
            <img
              src={arrowBack}
              alt="arrowBack"
              className="arrowBack-icon"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )}

      {isLoginView && (
        <div
          style={{
            position: "absolute",
            left: "0",
            paddingTop: "19px",
            paddingLeft: "24px",
          }}
        >
          <div role="presentation" onClick={handleClose}>
            <img
              src={arrowBack}
              alt="arrowBack"
              className="arrowBack-icon"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )}

      <Container fluid style={{ height: "auto", padding: "0" }}>
        <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
          {/* -----------------------------------------LOGIN----------------------------------------- */}
          {isLoginView ? (
            <Col md={12} lg={6} className="login-modal-form-col">
              <div className="d-flex justify-content-center align-items-center">
                <img src={Featured} alt="Featured" className="mb-3" />
              </div>
              <div
                className="d-flex justify-content-center align-items-center roboto-semi-bold-18px-body2"
                style={{ marginBottom: "26px" }}
              >
                Login
              </div>

              {error && (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  {error.detail ? error.detail : "Error"}
                </Alert>
              )}

              <Formik
                validationSchema={loginSchema}
                // onSubmit={handleNextStep}
                onSubmit={handleSubmitLogin}
                initialValues={{
                  email: "",
                  password: "",
                }}
                validateOnBlur={false}
                validateOnChange={false}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="form3Example3">
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
                        placeholder="Enter Password"
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

                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Check type="checkbox" className="mb-0">
                        <Form.Check.Input className="me-2" />
                        <Form.Check.Label className="roboto-regular-14px-information">
                          Keep me Logged In
                        </Form.Check.Label>
                      </Form.Check>
                      <div className="row" style={{ textAlign: "center" }}>
                        <p className="roboto-regular-16px-information mt-2 mb-0 ">
                          <span
                            style={{
                              color: "#0558FF",
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                            onClick={handleClickForgotPassword}
                          >
                            Forgot password?
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                      <Button
                        type="submit"
                        className="btn btn-success w-100 roboto-semi-bold-16px-information"
                        disabled={loading}
                        style={{
                          paddingLeft: "2.5rem",
                          paddingRight: "2.5rem",
                          height: "44px",
                        }}
                      >
                        {loading ? (
                          // "Loading…"
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Login"
                        )}
                      </Button>

                      <h4 className="login-page-text-divider">
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#475467",
                          }}
                        >
                          OR
                        </span>
                      </h4>
                      <div className="row" style={{ textAlign: "center" }}>
                        <p className="roboto-regular-16px-information mt-2 mb-0 ">
                          {" Don't have an account?"}{" "}
                          <span
                            style={{
                              color: "#0558FF",
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                            onClick={handleRegisterClick}
                          >
                            Register
                          </span>
                        </p>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
          ) : isRegisterView ? (
            // -----------------------------------------REGISTER-----------------------------------------
            <Col md={12} lg={6} className="login-modal-form-col">
              <div
                className="d-flex justify-content-center align-items-center roboto-semi-bold-18px-body2"
                style={{ marginBottom: "8px" }}
              >
                Register
              </div>

              {error && (
                <Alert severity="error" style={{ marginBottom: "10px" }}>
                  {error.user?.email && error.user.email.length > 0
                    ? error.user.email[0]
                    : "Error"}
                </Alert>
              )}
              {!hideRegisterStep1 && (
                <div className="w-100 pt-5">
                  <div
                    className="w-100 border border-dark p-3 mb-5 mt-2"
                    style={{ borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => setSelectedRole("client")}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <FontAwesomeIcon icon={faCircleUser} fontSize="30px" />
                      <input
                        className="form-check-input"
                        style={{ width: "1.5em", height: "1.5em" }}
                        checked={selectedRole === "client"}
                        type="radio"
                        name="flexRadioDefault"
                        value="client"
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        lineHeight: "24px",
                        color: "#797979",
                      }}
                    >
                      Are you looking for services for your projects?
                    </div>
                  </div>
                  <div
                    className="w-100 border border-dark p-3 mb-5"
                    style={{ borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => setSelectedRole("vendor")}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <FontAwesomeIcon icon={faStore} fontSize="28px" />
                      <input
                        className="form-check-input"
                        style={{ width: "1.5em", height: "1.5em" }}
                        checked={selectedRole === "vendor"}
                        type="radio"
                        name="flexRadioDefault"
                        value="vendor"
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        lineHeight: "24px",
                        color: "#797979",
                      }}
                    >
                      Are you looking to sell your services?
                    </div>
                  </div>
                  <Button
                    className="btn-success w-100"
                    onClick={() => setHideRegisterStep1(true)}
                  >
                    Next
                  </Button>
                </div>
              )}
              {hideRegisterStep1 &&
                (selectedRole === "client" ? (
                  <DynamicRegisterationView
                    activeStep={activeStep}
                    step1Schema={step1Schema}
                    step1InitialValues={step1InitialValues}
                    isShowPassword={isShowPassword}
                    getVisibilityIcon={getVisibilityIcon}
                    handleLoginClick={handleLoginClick}
                    handleRegisterationSubmit={handleRegisterationSubmit}
                    loading={loading}
                    role={selectedRole}
                  />
                ) : (
                  <StepperForm
                    componentToRender={() => (
                      <DynamicRegisterationView
                        activeStep={activeStep}
                        step1Schema={step1Schema}
                        handleStep1Submit={handleStep1Submit}
                        step1InitialValues={step1InitialValues}
                        isShowPassword={isShowPassword}
                        getVisibilityIcon={getVisibilityIcon}
                        handleLoginClick={handleLoginClick}
                        step2Schema={step2Schema}
                        handleRegisterationSubmit={handleRegisterationSubmit}
                        step2InitialValues={step2InitialValues}
                        countryOptions={countryOptions}
                        loading={loading}
                        role={selectedRole}
                      />
                    )}
                  />
                ))}
            </Col>
          ) : forgotPassword ? (
            <ForgotPassword setForgotPassword={setForgotPassword} />
          ) : (
            ""
          )}
          <Col
            md={0}
            lg={6}
            className="login-image-mobile"
            style={{ maxWidth: "500px" }}
          >
            <CarouselFadeExample />
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

export default Login;
