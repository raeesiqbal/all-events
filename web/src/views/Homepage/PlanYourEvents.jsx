import React from "react";
import {
  Card, Col, Container, Row,
} from "react-bootstrap";

import "./Homepage.css";
import imageByIndex from "../../components/Carousel/ImagesByIndex";

const eventsList = [
  {
    id: 1,
    title: "Manage your events",
    description:
      "A vivamus blandit in mollis. Consectetur ornare diam risus integer dui vitae aenean lacus. Aliquam.",
    button: "Start your first event",
    // image: image1,
  },
  {
    id: 2,
    title: "Guest List",
    description:
      "A vivamus blandit in mollis. Consectetur ornare diam risus integer dui vitae aenean lacus. Aliquam.",
    button: "Choose your guests",
    // // image: image2,
  },
  {
    id: 3,
    title: "Event Vendors",
    description:
      "A vivamus blandit in mollis. Consectetur ornare diam risus integer dui vitae aenean lacus. Aliquam.",
    button: "Choose your vendors",
    // // image: image3,
  },
  {
    id: 4,
    title: "Budget Plan",
    description:
      "A vivamus blandit in mollis. Consectetur ornare diam risus integer dui vitae aenean lacus. Aliquam.",
    button: "Plan your budget",
    // // image: image4,
  },
];

function PlanYourEvents() {
  return (
    <Container style={{ padding: "100px 0" }}>
      <div className="d-flex flex-column col-mobile">
        <div
          className="justify-content-left roboto-bold-36px-h1"
          style={{ marginBottom: "50px" }}
        >
          Upcoming Features
        </div>

        <Row>
          {eventsList
            && eventsList.map((product) => {
              const {
                id, title, description,
              } = product;
              return (
                <Col xs={12} md={12} lg={6}>
                  <Card className="event-card" key={id}>
                    <Row className="g-0">
                      <Col
                        sm={7}
                        xs={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <Card.Body>
                          <Card.Title
                            className="roboto-semi-bold-24px-h3"
                            style={{ marginBottom: "8px" }}
                          >
                            {title}
                          </Card.Title>
                          <Card.Text
                            className="roboto-regular-16px-information description-mobile"
                            style={{ marginBottom: "20px" }}
                          >
                            {description}
                          </Card.Text>
                          {/* <Button
                            type="button"
                            className="btn-no-border roboto-semi-bold-16px-information btn-height"
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#A0C49D",
                              padding: "0",
                            }}
                          >
                            {button}
                          </Button> */}
                        </Card.Body>
                      </Col>
                      <Col
                        xs={6}
                        sm={5}
                        style={{ padding: "10px 0", paddingRight: "10px" }}
                      >
                        <Card.Img
                          src={imageByIndex(id)}
                          alt="Event"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
        </Row>

        {/* <div className="d-flex justify-content-center mt-5 w-100">
          <Col xs={12} md={7} lg={3}>
            <Button
              variant="success"
              type="submit"
              className="btn btn-height w-100"
            >
              Try all planning tools
            </Button>
          </Col>
        </div> */}
      </div>
    </Container>
  );
}

export default PlanYourEvents;
