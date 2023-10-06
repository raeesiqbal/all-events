import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Calendars.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateCalendar, vendorCalendars } from "../redux/Calendars/CalendarsSlice";

const AdCalendar = ({ calendarData, index }) => {
  const dispatch = useDispatch();

  const [isDisabled, setIsDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availability, setAvailability] = useState("ad");

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setAvailability("ad");
    setIsDisabled(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    resetForm();
  };

  const updateAdCalendar = () => {
    dispatch(updateCalendar({
      id: calendarData.id,
      data: {
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        reason: "Event",
        availability,
      },
    }));
    setTimeout(() => {
      dispatch(vendorCalendars());
    }, 500);
  };

  const isBusyDate = (dt) => Object.keys(calendarData.dates).some((d) => new Date(d).toDateString() === dt.toDateString());

  const busyClassName = ({ date }) => (isBusyDate(date) ? "busy-tile" : "");

  useEffect(() => {
    if (startDate !== null && endDate !== null) setIsDisabled(false);
  }, [startDate, endDate]);

  return (
    <>
      <Modal
        show={showModal}
        onHide={toggleModal}
        dialogClassName="modal-500"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <div className="box" style={{ position: "absolute", right: "0" }} />
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "8px",
            zIndex: "20",
          }}
        >
          <div
            role="presentation"
            onClick={toggleModal}
            className="close-icon"
          >
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
        <Modal.Body className="p-4">
          <div className="w-100 text-center" style={{ fontSize: "24px", fontWeight: "600" }}>Update Calendar</div>
          <Row className="pt-5">
            <div className="w-100 mb-4">
              <div className="d-flex w-100 mb-3">
                {/* <img src={titleIcon} alt="T" className="me-3" style={{ width: "32px", height: "32px" }} /> */}
                <div className="my-auto" style={{ fontSize: "20px", fontWeight: "500" }}>Select Busy Date Range</div>
              </div>
              <DateRangePicker
                ranges={[
                  {
                    startDate: startDate || new Date(),
                    endDate: endDate || new Date(),
                    key: "selection",
                  },
                ]}
                onChange={(ranges) => {
                  setStartDate(ranges.selection.startDate);
                  setEndDate(ranges.selection.endDate);
                }}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
              />
            </div>
            <div className="w-100 mb-4">
              <div className="d-flex w-100 mb-3">
                {/* <img src={titleIcon} alt="T" className="me-3" style={{ width: "32px", height: "32px" }} /> */}
                <div className="my-auto" style={{ fontSize: "20px", fontWeight: "500" }}>Availability</div>
              </div>
              <Form.Select
                className="px-5"
                style={{ width: "fit-content" }}
                size="lg"
                defaultValue="ad"
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="ad">Busy</option>
                <option value="remove">Available</option>
              </Form.Select>
            </div>
          </Row>
          <Row className="w-100 mx-0">
            <Col md={6}>
              <Button variant="success" className="w-100" onClick={updateAdCalendar} disabled={isDisabled}>Update</Button>
            </Col>
            <Col md={6}>
              <Button
                variant="light"
                className="w-100 h-100"
                style={{ fontSize: "16px", fontWeight: "600", color: "#a0c49d" }}
                onClick={() => resetForm()}
              >
                Clear all
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <div className="d-flex w-100 justify-content-between pt-3">
        <h4>
          {index + 1}
          .
          {" "}
          {calendarData.ad}
        </h4>
        <Button variant="success" className="set-availability-button" onClick={toggleModal}>
          Set availability
        </Button>
      </div>
      <Calendar
        value={new Date()}
        tileClassName={busyClassName}
        className="mb-5"
      />
    </>
  );
};

export default AdCalendar;
