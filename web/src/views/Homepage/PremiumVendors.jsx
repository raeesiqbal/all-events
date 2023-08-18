import React, { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import EmblaCarousel from "../../components/Carousel/Carousel";
import { instance } from "../../axios/axios-config";
import placeholderIcon from "../../assets/images/placeholder.jpg";

function PremiumVendors() {
  const OPTIONS = { slidesToScroll: "auto", containScroll: "trimSnaps" };
  const [publicAds, setPublicAds] = useState([]);

  const componentToRender = (slide, index) => (
    <div className="embla__slide" key={index}>
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
          <div
            className="position-absolute"
            style={{ top: "20px", right: "20px" }}
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
                icon={faHeart}
                size="lg"
                style={{ color: "#fff" }}
              />
            </div>
          </div>

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
              <span
                className="d-flex align-items-center roboto-regular-14px-information"
                style={{ margin: "0 6px" }}
              >
                <strong> 4.9 </strong>
              </span>
              <span className="d-flex align-items-center text-muted roboto-regular-14px-information">
                (142)
              </span>
            </div>
          </Card.Text>
          <Card.Text className="text-muted roboto-regular-14px-information">
            {slide.country.name}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );

  const getVenueInfo = async () => {
    // console.log(values);
    try {
      const request = await instance.request({
        url: "/api/ads/public-list/",
        method: "Get",
      });
      setPublicAds(request.data.data);
    } catch (error) {
      // handleFailedAlert();
    }
  };

  useEffect(() => {
    getVenueInfo();
  }, []);

  return (
    publicAds.length > 0 && (
      <Container
        fluid
        style={{ padding: "100px 0", backgroundColor: "#F5F5F5" }}
      >
        <Container>
          <div className="roboto-bold-36px-h1" style={{ marginLeft: "26px" }}>
            Find our Premium Premium Vendors
          </div>
          <EmblaCarousel
            slides={publicAds}
            options={OPTIONS}
            componentToRender={componentToRender}
          />
          <div className="d-flex justify-content-center mt-5">
            <Button
              variant="success"
              type="submit"
              className="roboto-semi-bold-16px-information"
            >
              See all Vendors
            </Button>
          </div>
        </Container>
      </Container>
    )
  );
}

export default PremiumVendors;
