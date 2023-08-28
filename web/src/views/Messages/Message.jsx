import React from "react";
import {
  Card,
  Col,
  Row,
} from "react-bootstrap";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import AdImage from "../../assets/images/hero-img.svg";
import TimeIcon from "../../assets/images/post-ad/carbon_time.svg";
import replyIcon from "../../assets/images/bi_reply.svg";
import archiveIcon from "../../assets/images/ph_archive-box-light.svg";
import gotoIcon from "../../assets/images/post-ad/goto.svg";

const Message = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Col lg={10} className="w-100 py-5 border-bottom border-2">
      <Card key={1} className="shadow-none">
        <Row>
          <Col sm={3}>
            <Card.Img
              src={message.ad_image}
              alt="AdTemp"
              className="img-fluid h-100 object-fit-cover"
              style={{ maxWidth: "310px", maxHeight: "310px" }}
            />
          </Col>
          <Col
            sm={9}
            className="d-flex justify-content-center align-items-center py-3"
          >
            <Card.Body style={{ height: "100%" }}>
              <div className="d-md-flex flex-column justify-content-between h-100">
                <Card.Title>
                  <div className="d-md-flex justify-content-between">
                    <div className="roboto-semi-bold-32px-h2 col-md-6">
                      {`${message.client.user.first_name} ${message.client.user.last_name}`}
                    </div>
                    <div className="roboto-regular-14px-information d-flex align-items-end mt-2 pe-4">
                      <img
                        src={TimeIcon}
                        alt="TimeIcon"
                        className="me-2 my-auto"
                      />
                      {dayjs(message.latest_message.created_at).format("MMM D[th], YYYY")}
                    </div>
                  </div>

                  <div
                    className="roboto-regular-14px-information text-white mt-2"
                    style={{
                      borderRadius: "6px",
                      background: "#A0C49D",
                      padding: "2px 10px",
                      fontWeight: "500",
                      width: "fit-content",
                    }}
                  >
                    {`Event Date: ${dayjs(message.event_date).format("MMM D[th], YYYY").toString()}`}
                  </div>
                </Card.Title>
                <div className="d-md-flex justify-content-between">
                  <div className="roboto-regular-14px-information col-md-6 align-items-center">
                    <Card.Text
                      className="roboto-regular-16px-information"
                      style={{
                        maxWidth: "500px",
                      }}
                    >
                      {message.latest_message.text}
                    </Card.Text>
                  </div>
                  <div className="d-flex align-items-end pt-3">
                    <img
                      src={replyIcon}
                      alt="replyIcon"
                      className="me-3"
                      onClick={() => navigate(`/edit-ad/${id}`)}
                      style={{ cursor: "pointer", width: "30px" }}
                    />
                    <img
                      src={archiveIcon}
                      alt="archiveIcon"
                      className="me-3"
                      onClick={() => {
                        setModalShow(true);
                        setCurrentAdId(id);
                      }}
                      style={{ cursor: "pointer", width: "30px" }}
                    />
                    <img
                      src={gotoIcon}
                      alt="gotoIcon"
                      className="me-3"
                      onClick={() => navigate(`/view-ad/${id}`)}
                      style={{ cursor: "pointer", width: "30px" }}
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default Message;
