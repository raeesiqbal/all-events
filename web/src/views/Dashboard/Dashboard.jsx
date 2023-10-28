import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card, Col, Container, Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import viewsIcon from "../../assets/images/views.svg";
import savesIcon from "../../assets/images/saves.svg";
import reviewsIcon from "../../assets/images/reviews.svg";
import messagesIcon from "../../assets/images/messages.svg";
import editIcon from "../../assets/images/post-ad/edit.svg";
import timeIcon from "../../assets/images/post-ad/carbon_time.svg";
import "./Dashboard.css";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import { setCompanyInformation } from "../redux/Settings/SettingsSlice";
import MyAdsDashboard from "./MyAdsDashboard";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { secureInstance } from "../../axios/config";
import { listPlans } from "../redux/Subscriptions/SubscriptionsSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentSubscription = useSelector((state) => state.subscriptions.currentSubscriptionDetails);

  const [dashboardData, setDashboardData] = useState({});

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

  const getCompanyInfo = async () => {
    dispatch(setCompanyInformation({ id: user.userCompanyId }));
  };

  const handleProfileEdit = () => {
    // dispatch(setCompanyInformation({ id: user.userCompanyId }));
    navigate("/profile-settings");
    setTimeout(() => {
      dispatch(handleProfileSettingsCurrentView("PersonalInformation"));
    }, 1);
  };

  const getDashboardInfo = async () => {
    // dispatch(setCompanyInformation({ id: user.userCompanyId }));
    try {
      const request = await secureInstance.request({
        url: "/api/analytics/ad-analytics/dashboard/",
        method: "Get",
      });
      setDashboardData(request.data.data);
      // setUserAds(request.data.data.my_ads)
      // setparentImagesUploadedImages([
      //   ...pdfsToUpload,
      //   request.data.data.file_url,
      // ]);
    } catch (e) {
      // setImageUrlToUpload(response.data.data);
      // --------- WILL ROUTE ON SOME PAGE ON FAILURE ---------
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (user.userCompanyId !== null) {
      getCompanyInfo();
      getDashboardInfo();
    }
    dispatch(listPlans(user?.userId !== null));
  }, [user?.userId]);

  return (
    <div>
      <div className="profile-settings-banner d-flex align-items-center">
        <div className="banner-text-heading">
          <div className="roboto-bold-36px-h1">Dashboard</div>
          <div className="roboto-regular-18px-body3">
            Your Ads performance overview, at a glance
          </div>
        </div>
      </div>

      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col sm={10} md={10} lg={10} xl={10}>
            <div
              className="d-flex justify-content-center mt-5"
              style={{ width: "100%" }}
            >
              <div
                className="w-100"
                style={{
                  position: "relative",
                  // width: "100%",
                  background: "#FFF",
                  borderRadius: "5px",
                  minHeight: "237px",
                  // height: "400",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  border: "1px solid #E9EDF7",
                }}
              >
                <div className="d-flex h-100">
                  <div className="me-3" style={{ width: "225px" }}>
                    <ProfilePic dashboard />
                  </div>
                  <div
                    className="my-auto"
                  >
                    {/* <div style={{ paddingLeft: "250px" }}> */}
                    <div>
                      <div
                        className="roboto-semi-bold-32px-h2 w-100"
                        style={{ color: "#212227" }}
                      >
                        {`${user?.first_name} ${user?.last_name}`}
                      </div>
                      <div
                        className="roboto-semi-bold-24px-h3 mt-2 mb-2"
                        style={{ fontWeight: "400" }}
                      >
                        {dashboardData.user_details?.email}
                      </div>
                      <div
                        className="roboto-semi-bold-24px-h3"
                        style={{ fontWeight: "400" }}
                      >
                        {dashboardData.user_details?.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  src={editIcon}
                  alt="editIcon"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  onClick={handleProfileEdit}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Container
        // fluid
        style={{ marginTop: "60px", marginBottom: "20px" }}
        className=""
      >
        {/* <Row className="d-flex justify-content-center align-items-center"> */}
        <Row className="dashboard-analytics-container">
          <Col xs={10} md={12} lg={12} xl={12}>
            <Row className="mb-5 d-flex justify-content-center align-items-center">
              <div className="roboto-semi-bold-28px-h2 mb-5">Analytics</div>
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() => dispatch(
                    handleProfileSettingsCurrentView("PersonalInformation"),
                  )}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={viewsIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Views</div>
                    </div>
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {dashboardData?.total_views}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() => dispatch(
                    handleProfileSettingsCurrentView("CompanyInformation"),
                  )}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={savesIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Saves</div>
                    </div>
                    {/* <Card.Title>Company Information</Card.Title> */}
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {dashboardData?.total_saves}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* <Row> */}
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() => dispatch(handleProfileSettingsCurrentView("ChangePassword"))}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={reviewsIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Reviews</div>
                    </div>
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {dashboardData?.total_reviews}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() => dispatch(handleProfileSettingsCurrentView("DeleteAccount"))}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgb(234,121,186,0.1)",
                          borderRadius: "50%",
                          marginRight: "16px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={messagesIcon}
                          alt="personalInfo"
                          className="mb-4"
                          style={{ marginTop: "24px" }}
                        />
                      </div>

                      <div>Total Messages</div>
                    </div>
                    <Card.Text
                      className="roboto-bold-36px-h1"
                      style={{
                        marginTop: "36px",
                        fontSize: "40px",
                        fontWeight: "400",
                        marginBottom: "8px",
                      }}
                    >
                      {dashboardData?.total_messages}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Container>
        <div className="roboto-semi-bold-28px-h2 mb-5">My Subscription</div>

        <Row className={`mx-0 mt-4 w-100 ps-2 p-3 subscription-${currentSubscription?.type?.type}`}>
          <h2>{currentSubscription?.type?.type}</h2>
          <div className="d-flex w-100">
            <img src={timeIcon} alt="time icon" style={{ width: "20px", height: "20px" }} />
            <div className="my-auto ms-1" style={{ fontSize: "14px" }}>{formattedDate(currentSubscription?.created_at)}</div>
          </div>
          <div className="d-sm-flex justify-content-between mt-3">
            <div className="mb-3 my-sm-auto" style={{ fontSize: "13px" }}>
              Allowed Ads:
              {" "}
              {currentSubscription?.type?.allowed_ads}
            </div>
            <div className="d-flex">
              <Button
                type="button"
                variant="success"
                className="me-3 px-5 py-0"
                style={{ fontSize: "12px !important", height: "32px" }}
                onClick={() => navigate("/subscriptions")}
              >
                Manage
              </Button>
            </div>
          </div>
        </Row>
      </Container>

      <MyAdsDashboard userAds={dashboardData.my_ads} />
    </div>
  );
}

export default Dashboard;
