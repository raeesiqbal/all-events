import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import * as formik from "formik";
import * as Yup from "yup";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../components/Navbar/Navbar";
import user from "../../assets/images/profile-settings/user.svg";
import oldPasswordIcon from "../../assets/images/profile-settings/old-password.svg";
import newPasswordIcon from "../../assets/images/profile-settings/new-password.svg";
import confirmPasswordIcon from "../../assets/images/profile-settings/confirm-password.svg";
// import contactIcon from "../../assets/images/post-ad/contact.svg";

// import profile_bg from "../../assets/images/profile-settings/profile-bg.svg";
import "./ProfileSettings.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { secure_instance } from "../../axios/axios-config";
import { deleteCookie } from "../../utilities/utils";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

function ChangePassword() {
  const { Formik } = formik;
  const [isAlert, setIsAlert] = useState(false);
  const [isFailedAlert, setIsFailedAlert] = useState(false);
  const [isFailedAlertMessage, setIsFailedAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  const Schema = Yup.object().shape({
    old_password: Yup.string()
      .required("Password is required")
      .min(5, "Your password is too short."),
    new_password: Yup.string()
      .required("Password is required")
      .min(5, "Your password is too short."),
    confirm_password: Yup.string()
      .required("Passwords must match")
      .oneOf([Yup.ref("new_password")], "Passwords must match"),
  });

  const handleAlert = () => {
    setIsAlert(true);
    setTimeout(() => {
      setIsAlert(false);
    }, 3000);
  };
  const handleFailedAlert = () => {
    setIsFailedAlert(true);
    setTimeout(() => {
      setIsFailedAlert(false);
    }, 5000);
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      const request = await secure_instance.request({
        url: "/api/users/update-password/",
        method: "Patch",
        data: {
          old_password: values.old_password,
          new_password: values.new_password,
        },
      });
      setLoading(false);
      handleAlert();
      deleteCookie("refresh_token");
      // navigate("/");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      setIsFailedAlertMessage(error.response.data.message);
      handleFailedAlert();
      setLoading(false);
    }
    // request
  };

  return (
    <>
      <Header />
      <TabNavigation />

      <div className="profile-settings-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Change Password</div>
          <div className="roboto-regular-18px-body3">
            Update your information with ease
          </div>
        </div>

        <ProfilePic />
      </div>

      <Col className="justify-content-center" style={{ marginLeft: "54px" }}>
        <div
          className="d-flex mt-3"
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch(handleProfileSettingsCurrentView("profileSettings"))
          }
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

      <Alert
        severity="success"
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
        Updated successfully
      </Alert>

      <Alert
        severity="error"
        variant="filled"
        style={{
          position: "fixed",
          top: isFailedAlert ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: isFailedAlert ? 1 : 0,
          // width: "150px",
        }}
      >
        {isFailedAlertMessage !== null
          ? isFailedAlertMessage
          : "Something went wrong"}
      </Alert>

      <Container
        fluid
        style={{ marginTop: "70px", marginBottom: "200px" }}
        className=""
      >
        <Row className="justify-content-center">
          <Col lg={10}>
            <Formik
              validationSchema={Schema}
              // onSubmit={handleNextStep}
              onSubmit={handleResetPassword}
              initialValues={initialValues}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                errors,
                setErrors,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Col lg={4}>
                    <Form.Group
                      className="form-group mb-4"
                      controlId="form3Example4"
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
                        Old Password
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="hide-validation-icon lg-input-small-text"
                        name="old_password"
                        type="password"
                        size="lg"
                        placeholder="Enter Old Password"
                        value={values.old_password}
                        onChange={handleChange}
                        isValid={touched.old_password && !errors.old_password}
                        isInvalid={!!errors.old_password}
                      />
                      {/* {getVisibilityIcon()} */}
                      <Form.Control.Feedback type="invalid">
                        {errors.old_password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group
                      className="form-group mb-4"
                      controlId="form3Example4"
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
                        New Password
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="hide-validation-icon lg-input-small-text"
                        name="new_password"
                        type="password"
                        size="lg"
                        placeholder="Enter New Password"
                        value={values.new_password}
                        onChange={handleChange}
                        isValid={touched.new_password && !errors.new_password}
                        isInvalid={!!errors.new_password}
                      />
                      {/* {getVisibilityIcon()} */}
                      <Form.Control.Feedback type="invalid">
                        {errors.new_password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group
                      className="form-group mb-4"
                      controlId="form3Example4"
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
                        Confirm New Password
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="hide-validation-icon lg-input-small-text"
                        name="confirm_password"
                        type="password"
                        size="lg"
                        placeholder="Confirm New Password"
                        value={values.confirm_password}
                        onChange={handleChange}
                        isValid={
                          touched.confirm_password && !errors.confirm_password
                        }
                        isInvalid={!!errors.confirm_password}
                      />
                      {/* {getVisibilityIcon()} */}
                      <Form.Control.Feedback type="invalid">
                        {errors.confirm_password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col className="d-flex justify-content-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      // onClick={handleClickSubmit}
                      style={{ marginTop: "8rem", width: "30%" }}
                      className="btn btn-success roboto-semi-bold-16px-information btn-lg"
                    >
                      {loading ? (
                        // "Loading…"
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </Col>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default ChangePassword;
