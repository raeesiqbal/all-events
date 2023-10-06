import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vendorCalendars } from "../redux/Calendars/CalendarsSlice";
import AdCalendar from "./Calendar";
import { Col, Container, Row } from "react-bootstrap";

const Calendars = () => {
  const dispatch = useDispatch();
  const { calendars } = useSelector((state) => state.calendars);

  useEffect(() => {
    dispatch(vendorCalendars());
  }, []);

  return (
    <Container className="py-5 my-5">
      <h3 className="text-center mb-5">My Ads Calendars</h3>
      <Row>
        <Col md={9} className="mx-auto">
          {
            calendars?.map((calendar, index) => (
              <AdCalendar calendarData={calendar} index={index} />
            ))
          }
        </Col>
      </Row>
    </Container>
  );
};

export default Calendars;
