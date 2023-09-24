import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/fontawesome-free-solid";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { DateRangePicker, defaultInputRanges } from "react-date-range";
import { addDays } from "date-fns";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../../components/Navbar/Navbar";
import viewsIcon from "../../assets/images/views.svg";
import savesIcon from "../../assets/images/saves.svg";
import reviewsIcon from "../../assets/images/reviews.svg";
import messagesIcon from "../../assets/images/messages.svg";
import editIcon from "../../assets/images/post-ad/edit.svg";
import "./Dashboard.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import { getAuthenticatedUser } from "../redux/Auth/authSlice";
import { setCompanyInformation } from "../redux/Settings/SettingsSlice";
import BillingCard from "../../components/Card/BillingCard";
import BillingTabNavigation from "../../components/TabNavigation/BillingTabNavigation";
import MyAdsDashboard from "./MyAdsDashboard";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
// import ProfilePic from "../../components/ProfilePic/ProfilePic";

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [activeTab, setActiveTab] = React.useState("1 months");
  const [activeBillingCard, setActiveBillingCard] = React.useState("free");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  useEffect(() => {
    if (user.userCompanyId === null) {
      dispatch(getAuthenticatedUser());
    }
  }, []);

  const getCompanyInfo = async () => {
    dispatch(setCompanyInformation({ id: user.userCompanyId }));
  };

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  };

  const handleDropdownClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  // const selectionRange = {
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   key: "selection",
  // };

  useEffect(() => {
    if (user.userCompanyId !== null) {
      getCompanyInfo();
    }
  }, [user]);

  return (
    <div onClick={() => setShowDatePicker(false)}>
      <Header />
      <TabNavigation />
      <div className="profile-settings-banner d-flex align-items-center">
        <div style={{ marginLeft: "100px" }}>
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
                className="d-flex align-items-center w-100"
                style={{
                  position: "relative",
                  // width: "80vw",
                  background: "#FFF",
                  borderRadius: "5px",
                  minHeight: "237px",
                  // height: "400",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  border: "1px solid #E9EDF7",
                }}
              >
                <Row className="d-flex justify-content-center">
                  <Col xs={12} sm={5} md={5} lg={6} xl={6}>
                    <ProfilePic dashboard />
                  </Col>
                  <Col
                    xs={12}
                    sm={5}
                    md={6}
                    lg={6}
                    xl={6}
                    className="user-dashboard-info-container"
                  >
                    {/* <div style={{ paddingLeft: "250px" }}> */}
                    <div>
                      <div
                        className="roboto-semi-bold-32px-h2"
                        style={{ color: "#212227" }}
                      >
                        Michele Batal Wedding Services
                      </div>
                      <div
                        className="roboto-semi-bold-24px-h3 mt-2 mb-2"
                        style={{ fontWeight: "400" }}
                      >
                        michelebatal@wedding.com
                      </div>
                      <div
                        className="roboto-semi-bold-24px-h3"
                        style={{ fontWeight: "400" }}
                      >
                        +447576898762
                      </div>
                    </div>
                  </Col>
                </Row>
                <img
                  src={editIcon}
                  alt="editIcon"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
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
                  onClick={() =>
                    dispatch(
                      handleProfileSettingsCurrentView("PersonalInformation")
                    )
                  }
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
                      347
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() =>
                    dispatch(
                      handleProfileSettingsCurrentView("CompanyInformation")
                    )
                  }
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
                      89
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* <Row> */}
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() =>
                    dispatch(handleProfileSettingsCurrentView("ChangePassword"))
                  }
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
                      32
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics-dashboard"
                  onClick={() =>
                    dispatch(handleProfileSettingsCurrentView("DeleteAccount"))
                  }
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
                      437
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Container>
        {/* <BillingTabNavigation /> */}
        <div className="roboto-semi-bold-28px-h2 mb-5">My Subscriptions</div>

        <div className="mb-5">
          <BillingTabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <Row className="dashboard-billing-container">
          <Col xs={10} md={12} lg={12} xl={12}>
            <Row className="mb-5 d-flex justify-content-center align-items-center">
              <BillingCard
                icon={messagesIcon}
                headingText="FREE"
                subText="$10"
                duration="mo"
                backgroundColor="#F5F5F5"
                activeBillingCard={activeBillingCard}
                setActiveBillingCard={setActiveBillingCard}
                border="1px solid #E9EDF7"
                />
              <BillingCard
                icon={messagesIcon}
                headingText="PRO"
                subText="$20"
                duration="mo"
                backgroundColor="#FFFAD6"
                activeBillingCard={activeBillingCard}
                setActiveBillingCard={setActiveBillingCard}
                border="1px solid #E9EDF7"
                />
              <BillingCard
                icon={messagesIcon}
                headingText="BUSINESS"
                subText="$30"
                duration="mo"
                backgroundColor="#DBE5FF"
                activeBillingCard={activeBillingCard}
                setActiveBillingCard={setActiveBillingCard}
                border="1px solid #E9EDF7"
                />
              <BillingCard
                icon={messagesIcon}
                headingText="TEAMS"
                subText="$100"
                duration="mo"
                backgroundColor="#D8FFFB"
                activeBillingCard={activeBillingCard}
                setActiveBillingCard={setActiveBillingCard}
                border="1px solid #E9EDF7"
                />
            </Row>
          </Col>
        </Row>
      </Container>

      <MyAdsDashboard />

      <Footer />
    </div>
  );
}

export default Dashboard;
