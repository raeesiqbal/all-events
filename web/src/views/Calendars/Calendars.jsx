import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vendorCalendars } from "../redux/Calendars/CalendarsSlice";
import AdCalendar from "./Calendar";
import { Col, Container, Row } from "react-bootstrap";
import ProfilePic from "../../components/ProfilePic/ProfilePic";

const Calendars = () => {
  const dispatch = useDispatch();
  const { calendars } = useSelector((state) => state.calendars);
  const [currentAd, setCurrentAd] = useState(1);
  const [adTabSize, setAdTabSize] = useState(5);

  useEffect(() => {
    dispatch(vendorCalendars());
  }, []);

  useEffect(() => {
    if (calendars?.length === 1) setAdTabSize(2);
    if (calendars?.length === 2) setAdTabSize(3);
    if (calendars?.length > 2) setAdTabSize(5);
  }, [calendars]);

  const truncateString = (inputString) => {
    if (inputString.length <= 12) {
      return inputString;
    } else {
      return inputString.slice(0, 12) + "...";
    }
  };

  return (
    <>
      <div className="my-ad-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "2rem" }}>
          <div className="roboto-bold-36px-h1">My Ads Calendars</div>
          <div className="roboto-regular-18px-body3">
            Your Central Hub for Calendar Tracking
          </div>
        </div>
        <ProfilePic />
      </div>
      <Container className="py-5 my-5">
        {/* <h3 className="text-center mb-5">My Ads Calendars</h3> */}
        <Row className="mx-0">
          <Col md={9} lg={adTabSize} className="mx-auto">
            <Row className="mx-0 bg-white rounded">
              {calendars?.map((calendar, index) => (
                <Col className="p-2 text-center" style={{ height: "56px" }}>
                  <div
                    className={`p-2 rounded interval ${
                      currentAd === index + 1 ? "active-interval" : ""
                    }`}
                    onClick={() => setCurrentAd(index + 1)}
                  >
                    {/* {`Ad ${index + 1}`} */}
                    {truncateString(calendar.ad)}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        {calendars?.length > 0 && (
          <Row className="pt-5">
            <Col md={9} className="mx-auto">
              <AdCalendar
                calendarData={calendars[currentAd - 1]}
                index={currentAd - 1}
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Calendars;
