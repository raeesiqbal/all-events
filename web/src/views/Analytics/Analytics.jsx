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
import dropdownIcon from "../../assets/images/dropdown.svg";
import "./Analytics.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import { getAuthenticatedUser } from "../redux/Auth/authSlice";
import { setCompanyInformation } from "../redux/Settings/SettingsSlice";
// import ProfilePic from "../../components/ProfilePic/ProfilePic";

function Analytics() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

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
          <div className="roboto-bold-36px-h1">Analytics</div>
          <div className="roboto-regular-18px-body3">
            Your Ads performance overview, at a glance
          </div>
        </div>
      </div>

      <Row
        className="d-flex justify-content-center align-items-center g-0"
        style={{ marginTop: "48px" }}
      >
        <Col md={11} lg={6} xl={6} />
        <Col md={11} lg={6} xl={6}>
          <Dropdown show={showDatePicker} onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle
              variant="outline"
              id="dropdown-basic"
              onClick={handleDropdownClick}
              style={{ border: "1px solid #797979", borderRadius: "4px" }}
            >
              {/* {selectedDate ? selectedDate.toDateString() : "Select Date"} */}
              <span
                style={{ marginRight: "50px", color: "#797979" }}
                className="roboto-regular-16px-information"
              >
                Select Date Range
              </span>
              <img src={dropdownIcon} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <DateRangePicker
                onChange={(item) => setState([item.selection])}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                direction="horizontal"
                rangeColors={["rgb(160, 196, 157)"]}
                staticRanges={[]}
                inputRanges={[]}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Container
        // fluid
        style={{ marginTop: "100px", marginBottom: "200px" }}
        className=""
      >
        {/* <Row className="d-flex justify-content-center align-items-center"> */}
        <Row>
          <Col md={11} lg={12} xl={12}>
            <Row className="mb-5 d-flex justify-content-center align-items-center">
              <Col md={3}>
                <Card
                  // style={{ maxWidth: "256px" }}
                  className="custom-card-analytics"
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
                  className="custom-card-analytics"
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
                  className="custom-card-analytics"
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
                  className="custom-card-analytics"
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

      <Footer />
    </div>
  );
}

export default Analytics;
