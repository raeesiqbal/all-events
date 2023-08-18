/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
// import * as formik from "formik";
// import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/fontawesome-free-solid";
import useEmblaCarousel from "embla-carousel-react";
import Header from "../../components/Navbar/Navbar";
// import FbIcon from "../../assets/images/post-ad/fb-outlined.svg";
// import InstaIcon from "../../assets/images/post-ad/insta-outlined.svg";
import FbIcon from "../../assets/images/post-ad/facebook.svg";
import InstaIcon from "../../assets/images/post-ad/insta.svg";
import youtubeIcon from "../../assets/images/post-ad/youtube.svg";
import tiktokIcon from "../../assets/images/post-ad/tiktok.svg";
import twitterIcon from "../../assets/images/post-ad/twitter.svg";
import otherIcon from "../../assets/images/post-ad/sub-category.svg";
import MapIcon from "../../assets/images/post-ad/map-outlined.svg";
import one from "../../assets/images/post-ad/1.svg";
import two from "../../assets/images/post-ad/2.svg";
import three from "../../assets/images/post-ad/3.svg";
import TickIcon from "../../assets/images/post-ad/tick.svg";
// import deleteIcon from "../../assets/images/post-ad/delete.svg";
// import editIcon from "../../assets/images/post-ad/edit.svg";
// import gotoIcon from "../../assets/images/post-ad/goto.svg";
// import noAds from "../../assets/images/post-ad/no-ads.svg";

// import bannerBackgroundImg from "../../assets/images/profile-settings/ads-bg.svg";
// import confirmPasswordIcon from "../../assets/images/profile-settings/confirm-password.svg";
// import questionIcon from "../../assets/images/profile-settings/question.svg";

// import profile_bg from "../../assets/images/profile-settings/profile-bg.svg";
// import "./ProfileSettings.css";
import Footer from "../../components/Footer/Footer";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { secure_instance } from "../../axios/axios-config";
import "./Ads.css";

export function PrevButton(props) {
  const { enabled, onClick } = props;

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className="embla__button__view__ad embla__button__view__ad--prev"
      onClick={onClick}
      disabled={!enabled}
    >
      <svg className="embla__button__svg" viewBox="137.718 -1.001 366.563 644">
        <path
          fill="currentColor"
          d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z"
        />
      </svg>
    </button>
  );
}

export function NextButton(props) {
  const { enabled, onClick } = props;

  return (
    <button
      className="embla__button__view__ad embla__button__view__ad--next"
      onClick={onClick}
      disabled={!enabled}
    >
      <svg className="embla__button__svg" viewBox="0 0 238.003 238.003">
        <path
          fill="currentColor"
          d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z"
        />
      </svg>
    </button>
  );
}

function ViewAd() {
  const [currentTab, setCurrentTab] = useState(1);
  const [currentAd, setCurrentAd] = useState(null);
  const params = useParams();

  const options = { slidesToScroll: "auto", containScroll: "trimSnaps" };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // Original array of image links
  const imageLinks = currentAd?.ad_media[0]?.media_urls.images;

  // Divide the image links into chunks of three
  // Function to chunk the array into groups of three
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const imageChunks = imageLinks?.length > 0 ? chunkArray(imageLinks, 3) : [];

  // Create the slides array with dynamically generated keys
  const slidesModified = imageChunks?.map((chunk, index) => {
    const slide = {};
    chunk.forEach((link, imageIndex) => {
      slide[`image${index * 3 + imageIndex + 1}`] = link;
    });
    return slide;
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const getAdInfo = async () => {
    try {
      // setLoading(true);
      const request = await secure_instance.request({
        url: `/api/ads/${params.adId}/`,
        method: "Get",
      });
      setCurrentAd(request.data.data);
      // handleAlert();
      // setPersonalInfo(request.data.data);
      // setLoading(false);
    } catch (error) {
      // handleFailedAlert();
      // setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSelect = useCallback((emblaApi) => {
    // setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    // onInit(emblaApi);
    onSelect(emblaApi);
    // emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    getAdInfo();
  }, []);

  return (
    <>
      <Header />
      <TabNavigation />

      <Container
        // fluid
        style={{ marginTop: "40px", marginBottom: "200px" }}
        className=""
      >
        <Row>
          <div className="d-flex align-items-center justify-content-between mb-2 mx-3">
            <div className="roboto-bold-36px-h1">{currentAd?.name}</div>

            <div>
              <img src={MapIcon} alt="MapIcon" className="me-2" />
              <span className="roboto-regular-16px-information">
                {currentAd?.country.name}
              </span>
            </div>
          </div>
          <Col lg={8}>
            <Row>
              <div className="carousel__container__view__ad">
                <div className="embla__view__ad">
                  <div className="embla__viewport__view__ad" ref={emblaRef}>
                    <div className="embla__container__view__ad">
                      {slidesModified.map((slide, index) => (
                        <div key={index} className="carousel-slide">
                          {console.log({ slide })}
                          <Row>
                            <Col
                              sm={6}
                              md={6}
                              lg={
                                slide[`image${index * 3 + 2}`] ||
                                slide[`image${index * 3 + 3}`]
                                  ? 6
                                  : 12
                              }
                              xl={
                                slide[`image${index * 3 + 2}`] ||
                                slide[`image${index * 3 + 3}`]
                                  ? 6
                                  : 12
                              }
                              className="main-image-container"
                            >
                              <img
                                src={slide[`image${index * 3 + 1}`]}
                                alt={`image${index * 3 + 1}`}
                                className="main-image"
                              />
                            </Col>

                            <Col
                              sm={6}
                              md={6}
                              lg={6}
                              xl={6}
                              className="image-stack"
                            >
                              {slide[`image${index * 3 + 2}`] && (
                                <img
                                  src={slide[`image${index * 3 + 2}`]}
                                  alt={`image${index * 3 + 2}`}
                                  className="stacked-image"
                                  style={{
                                    minHeight: slide[`image${index * 3 + 3}`]
                                      ? "100%"
                                      : "464px",
                                  }}
                                />
                              )}
                              {slide[`image${index * 3 + 3}`] && (
                                <img
                                  src={slide[`image${index * 3 + 3}`]}
                                  alt={`image${index * 3 + 3}`}
                                  className="stacked-image"
                                />
                              )}
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  </div>
                  <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                  <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                </div>
              </div>
            </Row>
          </Col>
          <Col lg={4}>
            <div className="d-flex justify-content-between flex-column h-100">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faStar} style={{ color: "#f0be41" }} />
                  <FontAwesomeIcon
                    icon="fa-solid fa-star"
                    style={{ color: "#f0be41" }}
                  />
                  <FontAwesomeIcon
                    icon="fa-solid fa-star"
                    style={{ color: "#f0be41" }}
                  />
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
                    142 reviews
                  </span>
                </div>

                {(currentAd?.facebook !== "" ||
                  currentAd?.instagram !== "" ||
                  currentAd?.youtube !== "" ||
                  currentAd?.tiktok !== "" ||
                  currentAd?.twitter !== "" ||
                  currentAd?.others !== null) && (
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <div className="roboto-regular-16px-information">
                      Follow us on
                    </div>

                    <div>
                      {currentAd?.facebook !== "" && (
                        <img
                          src={FbIcon}
                          alt="FbIcon"
                          className="me-1"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            window.open(`/${currentAd?.facebook}`, "_blank")
                          }
                          // onClick={() => navigate(`/${currentAd?.facebook}`)}
                        />
                      )}
                      {currentAd?.instagram !== "" && (
                        <img
                          src={InstaIcon}
                          alt="InstaIcon"
                          className="me-1"
                          style={{ cursor: "pointer" }}
                          // onClick={() => navigate(`/${currentAd?.instagram}`)}
                          onClick={() =>
                            window.open(`/${currentAd?.instagram}`, "_blank")
                          }
                        />
                      )}
                      {currentAd?.youtube !== "" && (
                        <img
                          src={youtubeIcon}
                          className="me-1"
                          alt="youtubeIcon"
                          style={{ cursor: "pointer" }}
                          // onClick={() => navigate(`/${currentAd?.youtube}`)}
                          onClick={() =>
                            window.open(`/${currentAd?.youtube}`, "_blank")
                          }
                        />
                      )}
                      {currentAd?.tiktok !== "" && (
                        <img
                          src={tiktokIcon}
                          className="me-1"
                          alt="tiktokIcon"
                          style={{ cursor: "pointer" }}
                          // onClick={() => navigate(`/${currentAd?.tiktok}`)}
                          onClick={() =>
                            window.open(`/${currentAd?.tiktok}`, "_blank")
                          }
                        />
                      )}
                      {currentAd?.twitter !== "" && (
                        <img
                          src={twitterIcon}
                          className="me-1"
                          alt="twitterIcon"
                          style={{ cursor: "pointer" }}
                          // onClick={() => navigate(`/${currentAd?.twitter}`)}
                          onClick={() =>
                            window.open(`/${currentAd?.twitter}`, "_blank")
                          }
                        />
                      )}
                      {currentAd?.others !== null && (
                        <img
                          src={otherIcon}
                          className="me-1"
                          alt="otherIcon"
                          style={{ cursor: "pointer" }}
                          // onClick={() => navigate(`/${currentAd?.others}`)}
                          onClick={() =>
                            window.open(`/${currentAd?.others}`, "_blank")
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex">
                <Button
                  type="submit"
                  // onClick={() => navigate("/post-ad")}
                  className="btn btn-success roboto-semi-bold-16px-information w-100 mt-5"
                  style={{}}
                  // style={{ padding: "0 100px" }}
                >
                  Request pricing
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={8}>
            <div
              className="d-flex align-items-center"
              style={{
                height: "50px",
                width: "100%",
                background: "#F4F4F4",
                padding: "0px 20px",
              }}
            >
              <div
                className={`${
                  currentTab === 1 && "active-tab"
                } roboto-regular-16px-information tab me-1`}
                onClick={() => setCurrentTab(1)}
              >
                About
              </div>
              <div
                className={`${
                  currentTab === 2 && "active-tab"
                } roboto-regular-16px-information tab`}
                onClick={() => setCurrentTab(2)}
              >
                FAQs
              </div>
            </div>
          </Col>
        </Row>

        {currentAd?.description !== null && (
          <Row className="mt-4">
            <Col lg={8}>
              <div className="d-flex flex-column">
                <div className="d-flex roboto-semi-bold-24px-h3">About</div>

                <div
                  className="roboto-regular-16px-information mt-4"
                  style={{ overflowWrap: "break-word" }}
                >
                  {currentAd?.description}
                </div>
              </div>
            </Col>
          </Row>
        )}

        {currentAd?.offered_services.length > 0 && (
          <Row className="mt-5">
            <Col lg={7}>
              <div className="d-flex flex-column">
                <div className="d-flex roboto-semi-bold-24px-h3">
                  Offered services
                </div>

                <Row className="mt-3">
                  {currentAd.offered_services.map((service, index) => (
                    <Col key={index} lg={4}>
                      <ul className="custom-lists roboto-regular-16px-information">
                        <li>{service}</li>
                      </ul>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        )}

        {currentAd?.ad_faqs.length > 0 && (
          <Row className="mt-5">
            <Col lg={7}>
              <div className="d-flex flex-column">
                <div className="d-flex roboto-semi-bold-24px-h3">
                  Frequently Asked Questions
                </div>

                {currentAd?.ad_faqs.map((faq, index) => (
                  <div>
                    <div
                      className="d-flex roboto-regular-18px-body3 mt-4"
                      style={{ fontWeight: "700" }}
                    >
                      {faq.question}
                    </div>
                    <Row className="mt-3">
                      <Col key={index} lg={4}>
                        {/* ----------- FOR THE CHECKBOX TYPE ANSWERS, USE THIS LI UL ELEMENT----------- */}
                        {/* <li>{faq.question}</li> */}
                        {/* <ul className="custom-lists-tick-icon roboto-regular-16px-information">
                        <li>{faq.question}</li>
                      </ul> */}
                        <div
                          className="roboto-regular-18px-body3 mb-2"
                          style={{ fontWeight: "700" }}
                        >
                          {faq.answer_input}
                        </div>
                      </Col>
                    </Row>

                    <div
                      style={{
                        border: "1px solid #D9D9D9",
                        width: "100%",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Container>

      <Footer />
    </>
  );
}

export default ViewAd;
