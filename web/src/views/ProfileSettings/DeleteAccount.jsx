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
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar/Navbar";
import oldPasswordIcon from "../../assets/images/profile-settings/old-password.svg";
import "./ProfileSettings.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { secure_instance } from "../../axios/axios-config";
import { deleteCookie } from "../../utilities/utils";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

function DeleteAccount() {
  const { Formik } = formik;
  const dispatch = useDispatch();

  const [isFailedAlert, setIsFailedAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFailedAlertMessage, setIsFailedAlertMessage] = useState(null);

  const initialValues = {
    password: "",
    confirm_password: "",
    delete_reason: "",
  };

  const Schema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(5, "Your password is too short."),
    confirm_password: Yup.string()
      .required("Passwords must match")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    delete_reason: Yup.string().required("Reason to leave is required"),
  });

  const handleFailedAlert = () => {
    setIsFailedAlert(true);
    setTimeout(() => {
      setIsFailedAlert(false);
    }, 4000);
  };

  const handleDeleteAccount = async (values) => {
    try {
      setLoading(true);
      await secure_instance.request({
        url: `/api/users/delete/`,
        method: "Post",
        data: {
          password: values.password,
          delete_reason: values.delete_reason,
        },
      });
      setLoading(false);
      deleteCookie("refresh_token");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.log(error);
      if (error.response.data.status_code === 400) {
        setIsFailedAlertMessage("Password incorrect");
      }
      handleFailedAlert();
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <TabNavigation />

      <div className="profile-settings-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Delete Account</div>
          <div className="roboto-regular-18px-body3">
            We are sorry to see you leave
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
              onSubmit={handleDeleteAccount}
              initialValues={initialValues}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
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
                        Enter Password
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="hide-validation-icon lg-input-small-text"
                        name="password"
                        type="password"
                        size="lg"
                        placeholder="Enter Old Password"
                        value={values.password}
                        onChange={handleChange}
                        isValid={touched.password && !errors.password}
                        isInvalid={!!errors.password}
                      />
                      {/* {getVisibilityIcon()} */}
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
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
                          src={oldPasswordIcon}
                          alt="commercialName"
                          style={{ marginRight: "16px" }}
                        />
                        Confirm Password
                      </Form.Label>

                      <Form.Control
                        style={{ height: "56px" }}
                        className="hide-validation-icon lg-input-small-text"
                        name="confirm_password"
                        type="password"
                        size="lg"
                        placeholder="Enter New Password"
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
                        Why are you leaving?
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="hide-validation-icon lg-input-small-text"
                        name="delete_reason"
                        type="text"
                        size="lg"
                        placeholder="Let us know what made you leave"
                        value={values.delete_reason}
                        onChange={handleChange}
                        // isValid={
                        //   touched.delete_reason && !errors.delete_reason
                        // }
                        isInvalid={!!errors.delete_reason}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.delete_reason}
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
                        "Delete"
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

export default DeleteAccount;
