import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import EmblaCarousel from "../../components/Carousel/Carousel";
import placeholderIcon from "../../assets/images/placeholder.jpg";
import { favoriteAd, listPublicAds } from "../redux/Posts/AdsSlice";

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
        style={{ padding: "40px 0 100px 0", backgroundColor: "#F5F5F5" }}
      >
        <Container>
          <div className="roboto-semi-bold-28px-h2 mb-5">My Ads</div>
          <Row>{userAds?.map((slide, index) => componentToRender(slide))}</Row>
        </Container>
      </Container>
    )
  );
}

export default MyAdsDashboard;
