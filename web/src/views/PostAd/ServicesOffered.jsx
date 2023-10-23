import React, { useEffect, useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import Chip from "../../components/Chip/Chip";
import { useDispatch, useSelector } from "react-redux";
import { currentSubscriptionDetails } from "../redux/Subscriptions/SubscriptionsSlice";

function ServicesOffered({
  values,
  handleChange,
  handleAddServices,
  handleRemoveService,
  // handleAddService,
  adminServices,
  adminServicesSelected,
  setAdminServicesSelected,
}) {
  const dispatch = useDispatch();

  const [currentService, setCurrentService] = useState("");
  const [serviceError, setServiceError] = useState("");
  const currentSubscription = useSelector(
    (state) => state.subscriptions.currentSubscriptionDetails
  );

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

  const handleAddItem = (index, label) => {
    // handleAddServices(label);
    // const newService = {
    //   id: index,
    //   label,
    // };
    setAdminServicesSelected([...adminServicesSelected, label]);
    // handleAddServices(currentService);
    // setCurrentService("");
  };
  // const handleRemoveAdminService = (indexToRemove, label) => {
  //   const clonedServices = [...adminServicesSelected];
  //   const filteredServices = clonedServices.filter(
  //     (item) => item.id !== indexToRemove
  //   );
  //   setAdminServicesSelected(filteredServices);
  // };
  const handleRemoveAdminService = (_, labelToRemove) => {
    const filteredServices = adminServicesSelected.filter(
      (service) => service !== labelToRemove
    );
    setAdminServicesSelected(filteredServices);
  };

  useEffect(() => {
    dispatch(currentSubscriptionDetails());
  }, []);

  return (
    <Container fluid className="mt-4">
      <div
        className="roboto-semi-bold-28px-h2"
        style={{ marginBottom: "24px" }}
      >
        {(currentSubscription && currentSubscription?.type?.offered_services) ||
        adminServices.length > 0 ? (
          <>What Services You Offer?</>
        ) : null}
      </div>
      {/* className="justify-content-md-left" */}
      <Row>
        {/* <div className="roboto-regular-14px-information mt-2 mb-3">
          Add Questions and answers for your potential buyers
        </div> */}
        {currentSubscription && currentSubscription?.type?.offered_services && (
          <>
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
            <Col md={12} className="mb-3">
              <Button
                type="submit"
                onClick={addService}
                disabled={currentService.length === 0}
                className="btn btn-success roboto-semi-bold-16px-information mt-1"
              >
                Add Another
              </Button>
            </Col>
          </>
        )}
        <div>
          {adminServices?.map((service, index) => (
            <Chip
              label={service}
              index={index}
              handleRemoveService={handleRemoveAdminService}
              handleAddItem={handleAddItem}
              adminServicesSelected={adminServicesSelected}
              adminServices
            />
          ))}
          {values.servicesOffered.services.map((service, index) => (
            <Chip
              label={service}
              index={index}
              handleRemoveService={handleRemoveService}
              selected
            />
          ))}
        </div>
      </Row>
    </Container>
  );
}

export default ServicesOffered;
