import React, { useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import Chip from "../../components/Chip/Chip";

function ServicesOffered({
  values,
  handleChange,
  handleAddServices,
  handleRemoveService,
}) {
  const [currentService, setCurrentService] = useState("");
  const [serviceError, setServiceError] = useState("");

  const handleServiceChange = (e) => {
    if (e.target.value.length > 40) {
      setServiceError("Service length should be less than 40");
      return;
    }
    if (e.target.value.length < 40 && serviceError !== "") {
      setServiceError("");
    }
    setCurrentService(e.target.value);
  };

  const addService = () => {
    handleAddServices(currentService);
    setCurrentService("");
  };

  return (
    <Container fluid>
      <div
        className="roboto-semi-bold-28px-h2"
        style={{ marginBottom: "24px" }}
      >
        What Services You Offer?
      </div>
      {/* className="justify-content-md-left" */}
      <Row>
        {/* <div className="roboto-regular-14px-information mt-2 mb-3">
          Add Questions and answers for your potential buyers
        </div> */}
        <Col md={6} lg={4}>
          <Form.Group className="form-group mb-3" controlId="form3Example">
            <Form.Control
              style={{ height: "56px" }}
              className="lg-input-small-text"
              type="text"
              name="currentService"
              size="sm"
              placeholder="Type your service"
              value={currentService}
              onChange={handleServiceChange}
              // isValid={touched.FAQ && !errors.FAQ}
              isInvalid={serviceError}
            />
            <Form.Control.Feedback type="invalid">
              {serviceError}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12} className="">
          <Button
            type="submit"
            onClick={addService}
            disabled={currentService.length === 0}
            className="btn btn-success roboto-semi-bold-16px-information mt-1"
          >
            Add Another
          </Button>
        </Col>

        <Row xs="auto" lg={6} style={{ maxWidth: "800px", marginTop: "20px" }}>
          {values.servicesOffered.services.map((service, index) => (
            <Col lg={3}>
              <Chip
                label={service}
                index={index}
                handleRemoveService={handleRemoveService}
              />
            </Col>
          ))}
        </Row>
      </Row>
    </Container>
  );
}

export default ServicesOffered;
