import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import contactIcon from "../../assets/images/post-ad/contact.svg";
import mapIcon from "../../assets/images/post-ad/map.svg";
import { secure_instance } from "../../axios/axios-config";

function ContactInformationForm({ values, errors, touched, handleChange }) {
  const [countriesList, setCountries] = useState([]);

  const countryOptions = countriesList.map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const listCountries = async () => {
    const request = await secure_instance.request({
      url: "/api/ads/country/",
      method: "Get",
    });
    // console.log(request.data);
    setCountries(request.data.data);
  };

  useEffect(() => {
    listCountries();
  }, []);

  return (
    <Container fluid style={{ paddingTop: "40px" }}>
      <div
        className="roboto-semi-bold-28px-h2"
        style={{ marginBottom: "40px" }}
      >
        Contact Information
      </div>

      <Row className="mb-3">
        <Col lg={4}>
          <Form.Group className="mb-4" controlId="form3Example3">
            <Form.Label
              className="roboto-medium-20px-body1"
              style={{ marginBottom: "20px" }}
            >
              <img
                src={contactIcon}
                alt="commercialName"
                style={{ marginRight: "16px" }}
              />
              Contact Person Number
            </Form.Label>
            <Form.Control
              style={{ height: "56px" }}
              className="lg-input-small-text"
              name="contactInformation.contact_number"
              type="text"
              size="lg"
              placeholder="Enter Number"
              value={values.contact_number}
              onChange={handleChange}
              isValid={touched.contact_number && !errors.contact_number}
              isInvalid={!!errors.contact_number}
            />
            <Form.Control.Feedback type="invalid">
              {errors.contact_number}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col lg={4}>
          <Form.Group className="mb-4" controlId="form3Example3">
            <Form.Label
              className="roboto-medium-20px-body1"
              style={{ marginBottom: "20px" }}
            >
              <img
                src={mapIcon}
                alt="commercialName"
                style={{ marginRight: "16px" }}
              />
              Website URL
            </Form.Label>
            <Form.Control
              style={{ height: "56px" }}
              className="lg-input-small-text"
              name="contactInformation.websiteUrl"
              type="text"
              size="lg"
              placeholder="Enter websiteUrl"
              value={values.websiteUrl}
              onChange={handleChange}
              // isValid={touched.websiteUrl && !errors.websiteUrl}
              isInvalid={!!errors.websiteUrl}
            />
            <Form.Control.Feedback type="invalid">
              {errors.websiteUrl}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg={4}>
          <Form.Group className="form-group mb-3" controlId="form3Example6">
            <Form.Label
              className="roboto-medium-20px-body1"
              style={{ marginBottom: "20px" }}
            >
              <img
                src={mapIcon}
                alt="commercialName"
                style={{ marginRight: "16px" }}
              />
              Country
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              style={{ height: "56px", border: "1px solid #797979" }}
              name="contactInformation.country"
              value={values.country || ""}
              onChange={handleChange}
              // onBlur={handleBlur}
              isValid={touched.country && !errors.country}
              isInvalid={touched.country && !!errors.country}
              className={errors.country ? "border-danger" : ""}
            >
              <option selected value hidden="true">
                Select County
              </option>
              {countryOptions.map((county, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <option key={index} value={county.value}>
                  {county.label}
                </option>
              ))}
            </Form.Select>

            {errors?.country && (
              <div className="text-danger">{errors.country}</div>
            )}
          </Form.Group>
        </Col>
        <Col lg={4}>
          <Form.Group className="mb-4" controlId="form3Example3">
            <Form.Label
              className="roboto-medium-20px-body1"
              style={{ marginBottom: "20px" }}
            >
              <img
                src={mapIcon}
                alt="commercialName"
                style={{ marginRight: "16px" }}
              />
              City
            </Form.Label>
            <Form.Control
              style={{ height: "56px" }}
              className="lg-input-small-text"
              name="contactInformation.city"
              type="text"
              size="lg"
              placeholder="Enter City"
              value={values.city}
              onChange={handleChange}
              isValid={touched.city && !errors.city}
              isInvalid={!!errors.city}
            />
            <Form.Control.Feedback type="invalid">
              {errors.city}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg={4}>
          <Form.Group className="mb-4" controlId="form3Example3">
            <Form.Label
              className="roboto-medium-20px-body1"
              style={{ marginBottom: "20px" }}
            >
              <img
                src={mapIcon}
                alt="commercialName"
                style={{ marginRight: "16px" }}
              />
              Street/Number
            </Form.Label>
            <Form.Control
              style={{ height: "56px" }}
              className="lg-input-small-text"
              name="contactInformation.street"
              type="text"
              size="lg"
              placeholder="Enter Street"
              value={values.street}
              onChange={handleChange}
              isValid={touched.street && !errors.street}
              isInvalid={!!errors.street}
            />
            <Form.Control.Feedback type="invalid">
              {errors.street}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg={8}>
          <Form.Group className="mb-4" controlId="form3Example3">
            <Form.Label
              className="roboto-medium-20px-body1"
              style={{ marginBottom: "20px" }}
            >
              <img
                src={mapIcon}
                alt="commercialName"
                style={{ marginRight: "16px" }}
              />
              Full Address
            </Form.Label>
            <Form.Control
              style={{ height: "56px" }}
              className="lg-input-small-text"
              name="contactInformation.fullAddress"
              type="text"
              size="lg"
              placeholder="Enter Full Address"
              value={values.fullAddress}
              onChange={handleChange}
              isValid={touched.fullAddress && !errors.fullAddress}
              isInvalid={!!errors.fullAddress}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullAddress}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactInformationForm;
