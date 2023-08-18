import React from "react";
import { Button, Container } from "react-bootstrap";
import EmblaCarousel from "../../components/Carousel/Carousel";
import imageByIndex from "../../components/Carousel/ImagesByCountry";

const country = ["Greece", "Jamaica", "Mexico", "Italy", "France"];

function VendorsByCountry() {
  const OPTIONS = { slidesToScroll: "auto", containScroll: "trimSnaps" };

  const SLIDE_COUNT = 25;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  const componentToRender = (index) => (
    <div className="embla__slide__vendors__by__country" key={index}>
      <img
        className="embla__slide__img"
        src={imageByIndex(index)}
        alt="Your alt text"
      />
      <div className="roboto-medium-20px-body1 mt-2">{country[index]}</div>
    </div>
  );

  return (
    <Container fluid style={{ padding: "100px 0", backgroundColor: "#FFF" }}>
      <Container>
        <div className="roboto-bold-36px-h1" style={{ marginLeft: "26px" }}>
          Find Venues in your County
        </div>
        <EmblaCarousel
          slides={SLIDES}
          options={OPTIONS}
          componentToRender={componentToRender}
        />
        <div className="d-flex justify-content-center mt-5">
          <Button
            variant="success"
            type="submit"
            className="roboto-semi-bold-16px-information"
          >
            Find vendors in your county
          </Button>
        </div>
      </Container>
    </Container>
  );
}

export default VendorsByCountry;
