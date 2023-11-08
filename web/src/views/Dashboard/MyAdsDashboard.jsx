import React from "react";
import {
  Card, Col, Container, Row,
} from "react-bootstrap";

function MyAdsDashboard({ userAds }) {
  const componentToRender = (slide) => (
    <Col sm={6} md={4} lg={3} className="mb-4" key={slide.id}>
      <Card
        style={{
          padding: "10px",
          border: "none",
          minHeight: "266px",
          maxHeight: "266px",
          position: "relative",
        }}
      >
        <Card.Img
          variant="top"
          src={slide?.ad_image}
          style={{
            height: "100%",
            minHeight: "186px",
            maxHeight: "186px",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            backgroundColor: "#A0C49D",
            fontWeight: "500",
            color: "white",
            padding: "0 13px",
            borderRadius: "20px",
          }}
          className="roboto-light-14px-information"
        >
          {slide?.status}
        </div>
        <Card.Body style={{ padding: "6px 0 0 6px" }}>
          <Card.Title
            style={{ margin: "0", color: "#212227" }}
            className="roboto-regular-16px-information card-title-custom"
          >
            {slide.name}
          </Card.Title>
          <Card.Text className="text-muted roboto-regular-14px-information">
            {slide.sub_category}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    userAds?.length > 0 && (
      <Container
        fluid
        className="pt-5 mt-4 px-0"
      >
        <Container>
          <div className="roboto-semi-bold-28px-h2 mb-5">My Ads</div>
          <Row>{userAds?.map((slide) => componentToRender(slide))}</Row>
        </Container>
      </Container>
    )
  );
}

export default MyAdsDashboard;
