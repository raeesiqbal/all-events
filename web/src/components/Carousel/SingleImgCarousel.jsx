import React from "react";
import Carousel from "react-bootstrap/Carousel";
import loginImg1 from "../../assets/images/login-img-1.svg";
import loginImg2 from "../../assets/images/login-img-2.svg";
import loginImg3 from "../../assets/images/login-img-3.svg";
import "./Carousel.css";

function CarouselFadeExample() {
  return (
    <Carousel fade controls={false}>
      <Carousel.Item>
        <img
          src={loginImg1}
          style={{ maxWidth: "100%", objectFit: "cover" }}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img src={loginImg2} alt="Second slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img src={loginImg3} alt="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselFadeExample;
