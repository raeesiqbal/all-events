/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import FAQsIcon from "../../assets/images/FAQsIcon.svg";

function FAQs({
  values,
  errors,
  touched,
  handleChange,
  handleAddFieldsForFAQ,
  handleAddFAQ,
  handleRemoveFAQ,
  handleEditFAQ,
}) {
  return (
    <Container fluid>
      <Row>
        <div className="roboto-semi-bold-28px-h2 mt-5">FAQs</div>
        <div className="roboto-regular-14px-information mt-2 mb-3">
          Add Questions and answers for your potential buyers
        </div>
        {values.FAQ.faqs.map((faq, index) => (
          <Row key={index}>
            <Col md={7} lg={8}>
              <Form.Group
                className="form-group mb-3"
                controlId={`form3ExampleDynamic${index}`}
              >
                <Form.Label
                  className="roboto-medium-20px-body1 d-flex align-items-center justify-content-between"
                  style={{ marginBottom: "20px" }}
                >
                  <div className="d-flex align-items-center roboto-medium-20px-body1">
                    {faq.added === true && (
                      <img
                        src={FAQsIcon}
                        alt="FAQsIcon"
                        className="me-2"
                        onClick={() => handleEditFAQ(index)}
                      />
                    )}
                    Question {index + 1}: {faq.added === true && faq.question}
                  </div>
                  <div style={{ color: "#A0C49D" }}>
                    {faq.added === false ? (
                      <span
                        style={{ textDecoration: "underline" }}
                        onClick={() => handleAddFAQ(index)}
                      >
                        Add FAQ
                      </span>
                    ) : (
                      <span
                        style={{ textDecoration: "underline" }}
                        onClick={() => handleRemoveFAQ(index)}
                      >
                        Remove FAQ
                      </span>
                    )}
                  </div>
                </Form.Label>
                {faq.added === false && (
                  <Form.Control
                    style={{ height: "56px" }}
                    className="lg-input-small-text"
                    type="text"
                    name={`FAQ.faqs[${index}].question`}
                    size="sm"
                    placeholder="Type your question"
                    value={faq.question}
                    onChange={handleChange}
                  />
                )}
              </Form.Group>
            </Col>
            <Col key={index} md={7} lg={8}>
              <Form.Group
                className="form-group mb-3"
                controlId={`form3Example${index}`}
              >
                <Form.Control
                  style={{ height: "56px" }}
                  className="lg-input-small-text"
                  type="text"
                  name={`FAQ.faqs[${index}].answer_input`}
                  size="sm"
                  placeholder="Type your answer"
                  value={faq.answer_input}
                  onChange={handleChange}
                  isValid={touched.FAQ && !errors.FAQ}
                  isInvalid={touched.FAQ && !!errors.FAQ}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.FAQ}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        ))}

        <Col md={12} className="">
          <Button
            type="button"
            onClick={handleAddFieldsForFAQ}
            className="btn btn-success roboto-semi-bold-16px-information mt-3"
          >
            {values.FAQ.faqs.length === 0 ? "Add FAQs" : "Add Another"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default FAQs;
