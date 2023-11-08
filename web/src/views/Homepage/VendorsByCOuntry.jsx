import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container } from "react-bootstrap";
import EmblaCarousel from "../../components/Carousel/Carousel";
import { venueCountries } from "../redux/Posts/AdsSlice";
import { setCategories, setCountry } from "../redux/Search/SearchSlice";

function VendorsByCountry() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const venuesCountries = useSelector((state) => state.Ads.venueCountries);

  const OPTIONS = { slidesToScroll: "auto", containScroll: "trimSnaps" };

  const SLIDE_COUNT = venuesCountries.length;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  const handleVenuesCountrySearch = (name) => {
    dispatch(setCountry({ country: name }));
    dispatch(setCategories({ categories: ["Venues"] }));
    navigate("/search");
  };

  const componentToRender = (index) => (
    <div
      className="embla__slide__vendors__by__country"
      style={{ cursor: "pointer" }}
      key={index}
      onClick={() => handleVenuesCountrySearch(venuesCountries[index].name)}
    >
      <img
        className="embla__slide__img"
        src={venuesCountries[index].image_url}
        style={{ borderRadius: "5px" }}
        alt="Your alt text"
      />
      <div className="roboto-medium-20px-body1 mt-2">{venuesCountries[index].name}</div>
    </div>
  );

  useEffect(() => {
    dispatch(venueCountries());
  }, []);

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

        <div className="d-flex justify-content-center mt-5 w-100">
          <Col xs={12} md={7} lg={3}>
            <Button
              variant="success"
              type="submit"
              className="roboto-semi-bold-16px-information btn-height w-100"
            >
              Find vendors in your county
            </Button>
          </Col>
        </div>
      </Container>
    </Container>
  );
}

export default VendorsByCountry;
