/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import {
  Button, Col, Container, Form, Row, Spinner,
} from "react-bootstrap";
import * as formik from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@mui/material";
import personIcon from "../../assets/images/profile-settings/person.svg";
import contactIcon from "../../assets/images/post-ad/contact.svg";
import { secureInstance } from "../../axios/config";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import "./ProfileSettings.css";
import { ScrollToError } from "../../utilities/ScrollToError";

function PersonalInformation() {
  const { Formik } = formik;
  const dispatch = useDispatch();

  const [personalInfo, setPersonalInfo] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isFailedAlert, setIsFailedAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    person_firstName: personalInfo.first_name,
    person_lastName: personalInfo.last_name,
    person_number: personalInfo.phone,
  };

  const Schema = Yup.object().shape({
    person_firstName: Yup.string()
      .required("First name is required")
      .min(2, "Must be at least 2 characters")
      .max(20, "Must be at most 20 characters")
      .matches(
        /^(?!.*--)[a-zA-Z][a-zA-Z -]*[a-zA-Z]$/,
        "Must only contain letters, spaces, and hyphens. Don't add two consecutive spaces or hyphens",
      ),
    person_lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Must be at least 2 characters")
      .max(20, "Must be at most 20 characters")
      .matches(
        /^(?!.*--)[a-zA-Z][a-zA-Z -]*[a-zA-Z]$/,
        "Must only contain letters, spaces, and hyphens. Don't add two consecutive spaces or hyphens",
      ),
    person_number: Yup.string()
      .min(8, "Must be at least 8 digits")
      .max(15, "Must be less than 15 digits")
      .matches(/^\+?[0-9]+$/, "Must be a valid phone number. Only digits and '+' are allowed"),
  });

  const getPersonalInfo = async () => {
    const request = await secureInstance.request({
      url: "/api/users/me/",
      method: "Get",
    });
    setPersonalInfo(request.data.data);
  };

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
    }, 3000);
  };

  const handleUpdateUserInfo = async (values) => {
    try {
      setLoading(true);
      const request = await secureInstance.request({
        url: `/api/users/${user.userId}/`,
        method: "Patch",
        data: {
          first_name: values.person_firstName,
          last_name: values.person_lastName,
          phone: values.person_number,
        },
      });

      handleAlert();
      setPersonalInfo(request.data.data);
      setLoading(false);
    } catch (error) {
      handleFailedAlert();
      setLoading(false);
    }
  };

  useEffect(() => {
    getPersonalInfo();
  }, []);

  return (
    <>
      <div className="profile-settings-banner d-flex align-items-center justify-content-between">
        <div className="banner-text-heading">
          <div className="roboto-bold-36px-h1">Personal Information</div>
          <div className="roboto-regular-18px-body3">
            Update your information with ease
          </div>
        </div>

        <ProfilePic />
      </div>

      <Col className="justify-content-center left-arrow-settings">
        <div
          className="d-flex mt-3"
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(handleProfileSettingsCurrentView("profileSettings"))}
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
        Something went wrong
      </Alert>

      <Container
        // fluid="md"
        style={{ marginTop: "50px", marginBottom: "100px" }}
        className=""
      >
        <Row className="justify-content-center">
          <Col lg={10}>
            <Formik
              validationSchema={Schema}
              // onSubmit={handleNextStep}
              onSubmit={handleUpdateUserInfo}
              initialValues={initialValues}
              enableReinitialize
              validateOnBlur={false}
              validateOnChange={false}
            >
              {({
                handleSubmit, handleChange, values, errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <ScrollToError />
                  <Col lg={4}>
                    <Form.Group className="mb-4" controlId="form3Example3">
                      <Form.Label
                        className="roboto-medium-20px-body1 d-flex align-items-center"
                        style={{ marginBottom: "20px" }}
                      >
                        <img
                          src={personIcon}
                          alt="commercialName"
                          style={{ marginRight: "16px" }}
                        />
                        First Name
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="lg-input-small-text"
                        name="person_firstName"
                        type="text"
                        size="lg"
                        placeholder="Enter First Name"
                        value={values.person_firstName}
                        onChange={handleChange}
                        // isValid={touched.person_firstName && !errors.person_firstName}
                        isInvalid={!!errors.person_firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.person_firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group className="mb-4" controlId="form3Example3">
                      <Form.Label
                        className="roboto-medium-20px-body1 d-flex align-items-center"
                        style={{ marginBottom: "20px" }}
                      >
                        <img
                          src={personIcon}
                          alt="commercialName"
                          style={{ marginRight: "16px" }}
                        />
                        Last Name
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="lg-input-small-text mt-3"
                        name="person_lastName"
                        type="text"
                        size="lg"
                        placeholder="Enter Last Name"
                        value={values.person_lastName}
                        onChange={handleChange}
                        // isValid={touched.person_lastName && !errors.person_lastName}
                        isInvalid={!!errors.person_lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.person_lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="form3Example4">
                      <Form.Label
                        className="roboto-medium-20px-body1 d-flex align-items-center"
                        style={{ marginBottom: "20px", whiteSpace: "nowrap" }}
                      >
                        <img
                          src={contactIcon}
                          alt="commercialName"
                          style={{ marginRight: "16px" }}
                        />
                        Contact Person Number
                      </Form.Label>
                      <Form.Control
                        style={{ height: "56px" }}
                        className="lg-input-small-text"
                        name="person_number"
                        type="text"
                        size="lg"
                        placeholder="Enter Number"
                        value={values.person_number}
                        onChange={handleChange}
                        // isValid={touched.person_number && !errors.person_number}
                        isInvalid={!!errors.person_number}
                      />
                      {/* {getVisibilityIcon()} */}
                      <Form.Control.Feedback type="invalid">
                        {errors.person_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <div className="d-flex justify-content-end mt-5">
                    <Col xs={12} md={5} lg={3}>
                      <Button
                        variant="success"
                        type="submit"
                        disabled={loading}
                        className="roboto-semi-bold-16px-information btn btn-height w-100"
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </Col>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PersonalInformation;
