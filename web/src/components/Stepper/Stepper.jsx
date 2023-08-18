import React from "react";
import "./Stepper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/fontawesome-free-solid";
import { useDispatch, useSelector } from "react-redux";
import { handleNextStep } from "../../views/redux/Stepper/StepperSlice";

function StepperForm({ componentToRender }) {
  const dispatch = useDispatch();

  const activeStep = useSelector((state) => state.stepper.activeStep);

  const handleClickNextStep = () => {
    dispatch(handleNextStep());
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-md-12">
          <div className="wizard">
            <div className="wizard-inner" style={{ paddingRight: "30px" }}>
              <div className="connecting-line" />
              <ul
                className="nav nav-tabs justify-content-between"
                role="tablist"
              >
                <li
                  role="presentation"
                  className={activeStep === 0 ? "active" : "disabled"}
                >
                  <a
                    href="#step1"
                    data-toggle="tab"
                    aria-controls="step1"
                    role="tab"
                    aria-expanded={activeStep === 0 ? "true" : "false"}
                    // onClick={() => handleStepClick(0)}
                    style={{ textDecoration: "none" }}
                  >
                    <span className="round-tab">
                      {activeStep === 0 ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        ""
                      )}
                    </span>
                    <span
                      className="roboto-light-12px-information"
                      style={{
                        lineHeight: "100px",
                        listStyle: "none",
                        position: "absolute",
                        left: "-20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Your details
                    </span>
                  </a>
                </li>
                <li
                  role="presentation"
                  className={activeStep === 1 ? "active" : "disabled"}
                >
                  <a
                    href="#step2"
                    data-toggle="tab"
                    aria-controls="step2"
                    role="tab"
                    aria-expanded={activeStep === 1 ? "true" : "false"}
                    // onClick={() => handleStepClick(1)}
                    style={{ textDecoration: "none" }}
                  >
                    <span className="round-tab">
                      {activeStep === 1 ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        ""
                      )}
                    </span>
                    <span
                      className="roboto-light-12px-information"
                      style={{
                        lineHeight: "100px",
                        listStyle: "none",
                        position: "absolute",
                        right: "-70px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Company Details
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {componentToRender !== undefined &&
              componentToRender(handleClickNextStep)}
          </div>
        </div>
      </div>
    </div>
    // </section>
  );
}

export default StepperForm;
