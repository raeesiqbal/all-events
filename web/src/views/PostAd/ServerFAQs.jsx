/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import FAQsIcon from "../../assets/images/FAQsIcon.svg";

function ServerFAQs({
  values,
  errors,
  touched,
  handleChange,
  handleAddFieldsForFAQ,
  handleAddFAQ,
  handleRemoveFAQ,
  handleEditFAQ,
  siteFaqQuestions,
  selectedValues,
  setSelectedValues,
}) {
  console.log("selectedValues", selectedValues);
  // Initialize an array to keep track of selected values
  // Initialize an array to keep track of selected values and their respective question indexes

  // Function to handle the selection of a radio checkbox
  const [questionIdCounter, setQuestionIdCounter] = useState(0);
  // const [selectedValues, setSelectedValues] = useState([]);

  // Function to handle the selection of a radio checkbox
  const handleRadioChange = (
    sectionIndex,
    questionIndex,
    value,
    question,
    faqID
  ) => {
    console.log("sectionIndex", sectionIndex);
    console.log("questionIndex", questionIndex);
    console.log("value", value);
    console.log("question", question);
    console.log("faqID", faqID);
    const updatedValues = [...selectedValues];
    const questionId = questionIdCounter;
    setQuestionIdCounter(questionIdCounter + 1);

    updatedValues[sectionIndex] = updatedValues[sectionIndex] || [];
    updatedValues[sectionIndex][questionIndex] = {
      value,
      question,
      id: faqID,
    };
    setSelectedValues(updatedValues);
  };

  console.log("selectedValues", selectedValues);

  // useEffect(() => {
  //   setSelectedValues(
  //     siteFaqQuestions[0].site_faq_questions.map(() => ({
  //       id: null,
  //       value: null,
  //       questionIndex: null,
  //     }))
  //   );
  // }, []);
  // useEffect(() => {
  //   // const initialSelectedValues = siteFaqQuestions[0].site_faq_questions.map(
  //   //   (faq) => ({
  //   //     id: faq.id,
  //   //     value: null, // Set this to the default initial value for a radio button
  //   //     questionIndex: null,
  //   //   })
  //   // );

  //   // setSelectedValues(initialSelectedValues);
  //   setSelectedValues([]);
  // }, [siteFaqQuestions]);

  // Initialize a variable to store the total length
  // let totalLength = 0;

  // // Iterate through the data and sum up the lengths of site_faq_questions
  // siteFaqQuestions.forEach((item) => {
  //   totalLength += item.site_faq_questions.length;
  // });
  const totalSiteFaqQuestionsLength = siteFaqQuestions.reduce(
    (accumulator, item) => accumulator + item.site_faq_questions.length,
    0
  );

  const totalSelectedValuesLength = selectedValues.reduce(
    (accumulator, innerArray) => accumulator + innerArray.length,
    0
  );

  // console.log("siteFaqQuestionssiteFaqQuestions", siteFaqQuestions);
  // console.log("selectedValues", selectedValues);
  // console.log("totalLength", totalLength);
  // console.log("totalSelectedValues", totalSelectedValues);

  return (
    <Container fluid className="mt-5">
      {totalSelectedValuesLength !== totalSiteFaqQuestionsLength && (
        <div className="text-danger server-faq-container">
          Answer to all Questions are required
        </div>
      )}
      <Row>
        {/* <div className="roboto-semi-bold-28px-h2 mt-5">Pre definedFAQs</div> */}
        {/* <div className="roboto-regular-14px-information mt-2 mb-3">
          Add Questions and answers for your potential buyers
        </div> */}
        {siteFaqQuestions.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3>Section: {section.section}</h3>
            {section.site_faq_questions.map((faq, index) => (
              <Row key={index}>
                <Col md={7} lg={8}>
                  <Form.Group
                    className="form-group mb-3"
                    controlId={`form3ExampleDynamic${sectionIndex}-${index}`}
                  >
                    <Form.Label
                      className="roboto-medium-20px-body1 d-flex align-items-center justify-content-between"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="d-flex align-items-center roboto-medium-20px-body1">
                        Question {index + 1}: {faq.question}
                      </div>
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col key={index} md={7} lg={8}>
                  {faq.suggestion.length > 0 ? (
                    <Form.Group
                      className="form-group mb-3"
                      controlId={`form-${sectionIndex}-${index}`}
                    >
                      <Col sm={10}>
                        {faq.suggestion.map((suggestion, suggestionIndex) => (
                          <Form.Check
                            key={suggestionIndex}
                            type="radio"
                            label={suggestion}
                            // name={`formHorizontalRadios-${sectionIndex}-${index}`}
                            name={`formHorizontalRadios-${sectionIndex}-${index}`}
                            id={`formHorizontalRadios${suggestion}-${sectionIndex}-${index}-${suggestionIndex}`}
                            checked={
                              (selectedValues[sectionIndex] &&
                                selectedValues[sectionIndex][index] &&
                                selectedValues[sectionIndex][index].value ===
                                  suggestion) ||
                              faq.answer === suggestion
                            }
                            onChange={() =>
                              handleRadioChange(
                                sectionIndex,
                                index,
                                suggestion,
                                faq.question,
                                faq.id
                              )
                            }
                          />
                        ))}
                      </Col>
                    </Form.Group>
                  ) : (
                    <Form.Group
                      className="form-group mb-3"
                      controlId={`form-${sectionIndex}-${index}`}
                    >
                      <Form.Check
                        type="radio"
                        label="Yes"
                        name={`formHorizontalRadios-${sectionIndex}-${index}`}
                        id={`yes-${sectionIndex}-${index}`}
                        checked={
                          (selectedValues[sectionIndex] &&
                            selectedValues[sectionIndex][index] &&
                            selectedValues[sectionIndex][index].value ===
                              "Yes") ||
                          faq.answer === "Yes"
                        }
                        onChange={() =>
                          handleRadioChange(
                            sectionIndex,
                            index,
                            "Yes",
                            faq.question,
                            faq.id
                          )
                        }
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        name={`formHorizontalRadios-${sectionIndex}-${index}`}
                        id={`no-${sectionIndex}-${index}`}
                        checked={
                          (selectedValues[sectionIndex] &&
                            selectedValues[sectionIndex][index] &&
                            selectedValues[sectionIndex][index].value ===
                              "No") ||
                          faq.answer === "No"
                        }
                        onChange={() =>
                          handleRadioChange(
                            sectionIndex,
                            index,
                            "No",
                            faq.question,
                            faq.id
                          )
                        }
                      />
                    </Form.Group>
                  )}
                </Col>
              </Row>
            ))}
          </div>
        ))}

        {/* <Col md={12} className="">
          <Button
            type="button"
            onClick={handleAddFieldsForFAQ}
            className="btn btn-success roboto-semi-bold-16px-information mt-3"
          >
            {values.FAQ.faqs.length === 0 ? "Add FAQs" : "Add Another"}
          </Button>
        </Col> */}
      </Row>
    </Container>
  );
}

export default ServerFAQs;
