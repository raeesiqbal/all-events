import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Navbar/Navbar";
import personalInfo from "../../assets/images/profile-settings/personal-info.svg";
import companyInfo from "../../assets/images/profile-settings/company-info.svg";
import changePass from "../../assets/images/profile-settings/change-pass.svg";
import deleteIcon from "../../assets/images/profile-settings/delete.svg";
import "./ProfileSettings.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import { getAuthenticatedUser } from "../redux/Auth/authSlice";
import { setCompanyInformation } from "../redux/Settings/SettingsSlice";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

function ProfileSettings() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user.userCompanyId === null) {
      dispatch(getAuthenticatedUser());
    }
  }, []);

  const getCompanyInfo = async () => {
    dispatch(setCompanyInformation({ id: user.userCompanyId }));
  };

  useEffect(() => {
    if (user.userCompanyId !== null) {
      getCompanyInfo();
    }
  }, [user]);

  return (
    <>
      <Header />
      <TabNavigation />
      <div className="profile-settings-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "100px" }}>
          <div className="roboto-bold-36px-h1">Profile Settings</div>
          <div className="roboto-regular-18px-body3">
            Update your information with ease
          </div>
        </div>

        <ProfilePic />
      </div>

      <Container
        fluid
        style={{ marginTop: "100px", marginBottom: "200px" }}
        className=""
      >
        <Row className="justify-content-center">
          <Col md={11} lg={9} xl={8}>
            <Row className="mb-5">
              <Col md={6}>
                <Card
                  style={{ width: "21rem" }}
                  className="custom-card"
                  onClick={() =>
                    dispatch(
                      handleProfileSettingsCurrentView("PersonalInformation")
                    )
                  }
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <img
                        src={personalInfo}
                        alt="personalInfo"
                        className="mb-4"
                      />
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{
                          fontSize: "30px",
                          color: "#878787",
                          marginTop: "12px",
                        }}
                        className="cards-arrow"
                      />
                    </div>
                    <Card.Title>Personal Information</Card.Title>
                    <Card.Text>Edit your information with ease</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  style={{ width: "21rem" }}
                  className="custom-card"
                  onClick={() =>
                    dispatch(
                      handleProfileSettingsCurrentView("CompanyInformation")
                    )
                  }
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <img
                        src={companyInfo}
                        alt="companyInfo"
                        className="mb-4"
                      />
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{
                          fontSize: "30px",
                          color: "#878787",
                          marginTop: "12px",
                        }}
                        className="cards-arrow"
                      />
                    </div>
                    <Card.Title>Company Information</Card.Title>
                    <Card.Text>Update your company info</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Card
                  style={{ width: "21rem" }}
                  className="custom-card"
                  onClick={() =>
                    dispatch(handleProfileSettingsCurrentView("ChangePassword"))
                  }
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <img src={changePass} alt="changePass" className="mb-4" />
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{
                          fontSize: "30px",
                          color: "#878787",
                          marginTop: "12px",
                        }}
                        className="cards-arrow"
                      />
                    </div>
                    <Card.Title>Change Password</Card.Title>
                    <Card.Text>Update your account password</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  style={{ width: "21rem" }}
                  className="custom-card"
                  onClick={() =>
                    dispatch(handleProfileSettingsCurrentView("DeleteAccount"))
                  }
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <img src={deleteIcon} alt="deleteIcon" className="mb-4" />
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{
                          fontSize: "30px",
                          color: "#878787",
                          marginTop: "12px",
                        }}
                        className="cards-arrow"
                      />
                    </div>
                    <Card.Title>Delete Account</Card.Title>
                    <Card.Text>Deactivate your account</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default ProfileSettings;
