import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button, Card, Col, Container,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import EmblaCarousel from "../../components/Carousel/Carousel";
import placeholderIcon from "../../assets/images/placeholder.jpg";
import { favoriteAd, listPremiumVenues } from "../redux/Posts/AdsSlice";

function PremiumVenues() {
  const user = useSelector((state) => state.auth.user);
  const { premiumVenueAds } = useSelector((state) => state.Ads);
  const dispatch = useDispatch();
  const OPTIONS = { slidesToScroll: "auto", containScroll: "trimSnaps" };

  const handlefavoriteAd = (id) => {
    dispatch(favoriteAd(id));
  };

  const componentToRender = (slide, index) => (
    <Link className="embla__slide" key={index} to={`/view-ad/${slide.id}`}>
      <Card
        style={{
          padding: "10px",
          border: "none",
          minHeight: "319px",
          maxHeight: "319px",
        }}
      >
        <Card.Img
          variant="top"
          src={
            slide.ad_media[0].media_urls.images !== undefined
              ? slide?.ad_media[0]?.media_urls.images[0]
              : placeholderIcon
          }
          style={{ height: "100%", minHeight: "186px", objectFit: "cover" }}
        />
        <Card.Body>
          {
            slide.fav !== null && (
              <div
                className="position-absolute"
                style={{ top: "20px", right: "20px", zIndex: "2" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    background: "#00000080",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                >
                  <FontAwesomeIcon
                    icon={slide.fav ? "fa-heart fa-solid" : faHeart}
                    size="lg"
                    style={{ color: "#A0C49D", cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlefavoriteAd(slide.id);
                    }}
                  />
                </div>
              </div>
            )
          }
          <Card.Title
            style={{ margin: "0" }}
            className="roboto-medium-20px-body1 card-title-custom"
          >
            {slide.name}
          </Card.Title>
          <Card.Text style={{ margin: "10px 0 7px 0" }}>
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-star"
                style={{ color: "#f0be41" }}
              />
              {
                slide.total_reviews !== 0 ? (
                  <>
                    <span
                      className="d-flex align-items-center roboto-regular-14px-information"
                      style={{ margin: "0 6px" }}
                    >
                      <strong>
                        {" "}
                        {slide.average_rating?.toFixed(1) || "0.0"}
                        {" "}
                      </strong>
                    </span>
                    <span className="d-flex align-items-center text-muted roboto-regular-14px-information">
                      (
                      {slide.total_reviews}
                      )
                    </span>
                  </>
                ) : (
                  <span className="text-muted roboto-regular-14px-information ms-1 mt-1">Not Rated</span>
                )
              }
            </div>
          </Card.Text>
          <Card.Text className="text-muted roboto-regular-14px-information">
            {slide.country.name}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );

  useEffect(() => {
    dispatch(listPremiumVenues(user?.userId !== null));
  }, [user]);

  return (
    premiumVenueAds.length > 0 && (
      <Container
        fluid
        style={{ padding: "100px 0", backgroundColor: "#F5F5F5" }}
      >
        <Container>
          <div className="roboto-bold-36px-h1" style={{ marginLeft: "26px" }}>
            Find our Premium Venues
          </div>
          <EmblaCarousel
            slides={premiumVenueAds}
            options={OPTIONS}
            componentToRender={componentToRender}
          />
          <div className="d-flex justify-content-center mt-5 w-100">
            <Col xs={10} md={6} lg={2}>
              <Button
                variant="success"
                type="submit"
                className="roboto-semi-bold-16px-information btn-height w-100"
              >
                See all Venues
              </Button>
            </Col>
          </div>
        </Container>
      </Container>
    )
  );
}

export default PremiumVenues;
