import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heroImg1 from "../../assets/images/harold.jpg";
// import heroImg1 from "../../assets/images/heroImg.svg";
import useWindowDimensions from "../../utilities/hooks/useWindowDimension";

function HeroSection() {
  const { width } = useWindowDimensions();

  return (
    <Container fluid style={{ height: "auto", padding: "0" }}>
      <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center"
          style={{ padding: "50px 20px" }}
        >
          <div>
            <div className="hero-text" style={{ maxWidth: "461px" }}>
              <h1 className="text-left heading">Lectus auctor faucibus</h1>
              <p className="text-left">
                Sit pharetra consectetur odio sit. Molestie ipsum aliquam est
                quis morbi.
              </p>
            </div>
            <div className="s003">
              <Form>
                {width > 992 ? (
                  <InputGroup className="flex-nowrap">
                    <div
                      className="d-flex"
                      style={{
                        border: "1px solid #D9D9D9",
                        borderRadius: "5px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "14px",
                          left: "25px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            // eslint-disable-next-line max-len
                            d="M19.0002 19.0002L14.6572 14.6572M14.6572 14.6572C15.4001 13.9143 15.9894 13.0324 16.3914 12.0618C16.7935 11.0911 17.0004 10.0508 17.0004 9.00021C17.0004 7.9496 16.7935 6.90929 16.3914 5.93866C15.9894 4.96803 15.4001 4.08609 14.6572 3.34321C13.9143 2.60032 13.0324 2.01103 12.0618 1.60898C11.0911 1.20693 10.0508 1 9.00021 1C7.9496 1 6.90929 1.20693 5.93866 1.60898C4.96803 2.01103 4.08609 2.60032 3.34321 3.34321C1.84288 4.84354 1 6.87842 1 9.00021C1 11.122 1.84288 13.1569 3.34321 14.6572C4.84354 16.1575 6.87842 17.0004 9.00021 17.0004C11.122 17.0004 13.1569 16.1575 14.6572 14.6572Z"
                            stroke="#1A1A1A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <FormControl
                        className="shadow-none roboto-regular-16px-information form-control"
                        placeholder="Wedding Venues"
                        style={{
                          outline: 0,
                          border: "none",
                          paddingLeft: "60px",
                          margin: "10px 0",
                          borderRadius: "0",
                          borderRight: "1px solid #D9D9D9",
                        }}
                      />
                      <FormControl
                        className="shadow-none roboto-regular-16px-information form-control"
                        placeholder="in Where"
                        style={{
                          border: "none",
                          margin: "10px 0",
                          color: "#797979",
                        }}
                      />
                      <Button
                        variant="success"
                        size="lg"
                        className="roboto-semi-bold-16px-information rounded-end-1 rounded-start-0"
                        style={{ height: "56px" }}
                      >
                        Search
                      </Button>
                    </div>
                  </InputGroup>
                ) : (
                  <>
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Wedding Venues"
                    />
                    <br />
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="in Where"
                    />
                    <br />
                    <Button
                      variant="success"
                      className="roboto-semi-bold-16px-information"
                      size="lg"
                      style={{ width: "100%" }}
                    >
                      Search
                    </Button>
                  </>
                )}
              </Form>
            </div>
          </div>
        </Col>
        <Col
          md={5}
          className="d-flex"
          style={{ justifyContent: "right", paddingRight: "0" }}
        >
          <img
            src={heroImg1}
            alt="Hero"
            style={{ maxWidth: "100%", objectFit: "cover" }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default HeroSection;
