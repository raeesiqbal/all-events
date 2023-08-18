/* eslint-disable no-confusing-arrow */
import { Formik } from "formik";
import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";

const DynamicRegisterationView = ({
  activeStep,
  step1Schema,
  handleStep1Submit,
  step1InitialValues,
  isShowPassword,
  getVisibilityIcon,
  handleLoginClick,
  step2Schema,
  handleRegisterationSubmit,
  step2InitialValues,
  countryOptions,
  loading,
}) =>
  activeStep === 0 ? (
    <Formik
      validationSchema={step1Schema}
      // onSubmit={handleNextStep}
      onSubmit={handleStep1Submit}
      initialValues={step1InitialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <div
            style={{ maxHeight: "296px", overflowY: "scroll" }}
            className="Container Flipped"
          >
            <Form.Group className="form-group mb-4" controlId="form3Example3">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="email"
                type="email"
                size="lg"
                placeholder="Enter Email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              className="form-group mb-3"
              controlId="form3Example4"
              style={{ position: "relative" }}
            >
              <Form.Control
                style={{ height: "56px" }}
                className="hide-validation-icon lg-input-small-text"
                name="password"
                type={isShowPassword ? "text" : "password"}
                size="lg"
                placeholder="Enter Password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password}
              />
              {getVisibilityIcon()}
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              className="form-group mb-3"
              controlId="form3Example5"
              style={{ position: "relative" }}
            >
              <Form.Control
                style={{ height: "56px" }}
                className="hide-validation-icon lg-input-small-text"
                name="password_check"
                type={isShowPassword ? "text" : "password"}
                size="lg"
                placeholder="Re-enter Password"
                value={values.password_check}
                onChange={handleChange}
                isValid={touched.password_check && !errors.password_check}
                isInvalid={!!errors.password_check}
              />
              {getVisibilityIcon()}
              <Form.Control.Feedback type="invalid">
                {errors.password_check}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example6">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="phone_number"
                type="text"
                size="lg"
                placeholder="Enter Contact Number"
                value={values.phone_number}
                onChange={handleChange}
                isValid={touched.phone_number && !errors.phone_number}
                isInvalid={!!errors.phone_number}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone_number}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example7">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="contact_person_first_name"
                type="text"
                size="lg"
                placeholder="Contact Person First Name"
                value={values.contact_person_first_name}
                onChange={handleChange}
                isValid={
                  touched.contact_person_first_name &&
                  !errors.contact_person_first_name
                }
                isInvalid={!!errors.contact_person_first_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contact_person_first_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example7">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="contact_person_last_name"
                type="text"
                size="lg"
                placeholder="Contact Person Last Name"
                value={values.contact_person_last_name}
                onChange={handleChange}
                isValid={
                  touched.contact_person_last_name &&
                  !errors.contact_person_last_name
                }
                isInvalid={!!errors.contact_person_last_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contact_person_last_name}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            <Button
              className="btn btn-success btn-lg w-100"
              style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              type="submit"
            >
              Next
            </Button>
          </div>
          <div className="row" style={{ textAlign: "center" }}>
            <p className="roboto-regular-16px-information mt-3 pt-1 mb-0 ">
              Already have an account?{" "}
              <a
                href="#!"
                style={{ color: "#0558FF", textDecoration: "none" }}
                onClick={handleLoginClick}
              >
                Login
              </a>
            </p>
          </div>
        </Form>
      )}
    </Formik>
  ) : (
    <Formik
      validationSchema={step2Schema}
      onSubmit={handleRegisterationSubmit}
      initialValues={step2InitialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <div
            style={{ maxHeight: "235px", overflowY: "scroll" }}
            className="Container Flipped"
          >
            <Form.Group className="form-group mb-3" controlId="form3Example3">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                type="text"
                name="company_name"
                size="lg"
                placeholder="Enter Company Name"
                value={values.company_name || ""}
                onChange={handleChange}
                isValid={touched.company_name && !errors.company_name}
                isInvalid={!!errors.company_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.company_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example4">
              <Form.Select
                aria-label="Default select example"
                style={{ height: "56px", border: "1px solid #797979" }}
                name="county"
                value={values.county || ""}
                onChange={handleChange}
                // onBlur={handleBlur}
                isValid={touched.county && !errors.county}
                isInvalid={touched.county && !!errors.county}
                className={errors.county ? "border-danger" : ""}
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
              <div className="text-danger" style={{ fontSize: "14px" }}>
                {errors.county}
              </div>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example5">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="city"
                type="text"
                size="lg"
                placeholder="Enter City/Commune"
                value={values.city || ""}
                onChange={handleChange}
                isValid={touched.city && !errors.city}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example5">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="address"
                type="text"
                size="lg"
                placeholder="Enter Company Address"
                value={values.address || ""}
                onChange={handleChange}
                isValid={touched.address && !errors.address}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example6">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="postal_code"
                type="text"
                size="lg"
                placeholder="Enter Postal Code"
                value={values.postal_code || ""}
                onChange={handleChange}
                isValid={touched.postal_code && !errors.postal_code}
                isInvalid={!!errors.postal_code}
              />
              <Form.Control.Feedback type="invalid">
                {errors.postal_code}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example7">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="fiscal_code"
                type="text"
                size="lg"
                placeholder="Enter Fiscal Code"
                value={values.fiscal_code || ""}
                onChange={handleChange}
                isValid={touched.fiscal_code && !errors.fiscal_code}
                isInvalid={!!errors.fiscal_code}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fiscal_code}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example8">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="firm_number"
                type="text"
                size="lg"
                placeholder="Enter Firm Number"
                value={values.firm_number || ""}
                onChange={handleChange}
                isValid={touched.firm_number && !errors.firm_number}
                isInvalid={!!errors.firm_number}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firm_number}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example9">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="bank_name"
                type="text"
                size="lg"
                placeholder="Enter Bank Name"
                value={values.bank_name || ""}
                onChange={handleChange}
                isValid={touched.bank_name && !errors.bank_name}
                isInvalid={!!errors.bank_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bank_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group mb-3" controlId="form3Example10">
              <Form.Control
                style={{ height: "56px" }}
                className="lg-input-small-text"
                name="bank_iban"
                type="text"
                size="lg"
                placeholder="Enter Bank IBAN"
                value={values.bank_iban || ""}
                onChange={handleChange}
                isValid={touched.bank_iban && !errors.bank_iban}
                isInvalid={!!errors.bank_iban}
              />
              <Form.Control.Feedback type="invalid">
                {errors.bank_iban}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div style={{ paddingLeft: "26px" }}>
            <Form.Group className="position-relative mb-1 mt-3">
              <Form.Check
                type="checkbox"
                required
                name="terms_acceptance"
                label="I agree to the Terms & Conditions"
                value={values.terms_acceptance || ""}
                // checked={values.terms_acceptance}
                onChange={handleChange}
                isInvalid={!!errors.terms_acceptance}
                feedback={errors.terms_acceptance}
                feedbackType="invalid"
                id="validationFormik107"
              />
            </Form.Group>

            <Form.Group className="position-relative mt-2">
              <Form.Check
                type="checkbox"
                required
                name="newsletter"
                label="Keep me updated with the latest news"
                value={values.newsletter || ""}
                // checked={values.terms_acceptance}
                onChange={handleChange}
                isInvalid={!!errors.newsletter}
                feedback={errors.newsletter}
                feedbackType="invalid"
                id="validationFormik107"
              />
            </Form.Group>

            <div className="text-center text-lg-start mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="btn btn-success roboto-semi-bold-16px-information btn-lg w-100"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              >
                {loading ? (
                  // "Loading…"
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
            <div className="row" style={{ textAlign: "center" }}>
              <p className="roboto-regular-16px-information mt-3 pt-1 mb-0 ">
                Already have an account?{" "}
                <a
                  href="#!"
                  style={{ color: "#0558FF", textDecoration: "none" }}
                  onClick={handleLoginClick}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

export default DynamicRegisterationView;
