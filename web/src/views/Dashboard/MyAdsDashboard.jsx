import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import EmblaCarousel from "../../components/Carousel/Carousel";
import placeholderIcon from "../../assets/images/placeholder.jpg";
import { favoriteAd, listPublicAds } from "../redux/Posts/AdsSlice";

function MyAdsDashboard({ userAds }) {
  const user = useSelector((state) => state.auth.user);
  // const publicAds = useSelector((state) => state.Ads.publicAds);
  const dispatch = useDispatch();
  const OPTIONS = { slidesToScroll: "auto", containScroll: "trimSnaps" };

  const handlefavoriteAd = (id) => {
    dispatch(favoriteAd(id));
  };

  const componentToRender = (slide) => (
    // <Link className="embla__slide" key={index} to={`/view-ad/${slide.id}`}>
    <Card
      style={{
        padding: "10px",
        border: "none",
        minHeight: "266px",
        maxHeight: "266px",
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
    // </Link>
  );

  useEffect(() => {
    // dispatch(listPublicAds(user?.userId !== null));
  }, [user]);
  console.log("userAds", userAds);

  return (
    userAds.length > 0 && (
      <Container
        fluid
        style={{ padding: "40px 0 100px 0", backgroundColor: "#F5F5F5" }}
      >
        <Container>
          <div className="roboto-semi-bold-28px-h2 mb-2">My Ads</div>
          {/* <EmblaCarousel
            slides={userAds}
            options={OPTIONS}
            componentToRender={componentToRender}
          /> */}
          {userAds.map((slide, index) => componentToRender(slide))}
          {/* {componentToRender(userAds)} */}
        </Container>
      </Container>
    )
  );
}

export default MyAdsDashboard;
