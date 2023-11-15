import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import useEmblaCarousel from "embla-carousel-react";
import {
  Button, Col, Container, Form, Modal, Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook, faInstagram, faTiktok, faTwitter, faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import useWindowDimensions from "../../utilities/hooks/useWindowDimension";
import Reviews from "../Reviews/Reviews";
import StarRating from "../../components/Rating/StarRating";
import MapIcon from "../../assets/images/post-ad/map-outlined.svg";
import DiscountTag from "../../assets/images/discount-tag.svg";
import { instance, secureInstance } from "../../axios/config";
import { handleStartContact } from "../redux/Contacts/ContactsSlice";
import { handleStartChat } from "../redux/Chats/ChatsSlice";
import { adCalendar, favoriteAd } from "../redux/Posts/AdsSlice";
import "./Ads.css";
import { setValidModal } from "../redux/Auth/authSlice";

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
  const [offeredServices, setOfferedServices] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [chatId, setChatId] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const calendar = useSelector((state) => state.Ads.calendar);

  const mediaQuery = useWindowDimensions();
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

  const isChatExists = async () => {
    const response = await secureInstance.request({
      url: `/api/analytics/ad-chat/${params.adId}/chat-exist/`,
      method: "Get",
    });
    if (response.data.data?.id) setChatId(response.data.data.id);
    return response.data.data.id;
  };

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const getAdInfo = async () => {
    try {
      // setLoading(true);
      const request = user?.role === "client" ? secureInstance : instance;
      const response = await request.request({
        url: `/api/ads/${params.adId}/public-get/`,
        method: "Get",
      });
      setCurrentAd(response.data.data);
      // handleAlert();
      // setPersonalInfo(request.data.data);
      // setLoading(false);
    } catch (error) {
      navigate("/");
      // handleFailedAlert();
      // setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user?.role === "client") isChatExists();
  }, [user]);

  useEffect(() => {
    if (currentAd && offeredServices.length === 0) {
      setOfferedServices(currentAd.offered_services.concat(currentAd.site_services).slice(0, 12));
    }
  }, [currentAd]);

  const displayAllOfferedServices = () => {
    setOfferedServices(currentAd.offered_services.concat(currentAd.site_services));
  };

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
    dispatch(adCalendar(params.adId));
    window.scrollTo(0, 0);
    if (user?.role === "client") isChatExists();
  }, [user?.role]);

  const getData = () => {
    const data = user.userId === null
      ? {
        email,
        phone,
        full_name: name,
        event_date: eventDate.toString(),
        message: text,
        ad: params.adId,
      } : {
        event_date: eventDate.toString(),
        message: text,
        ad: params.adId,
      };
    return {
      data,
      navigate,
    };
  };

  const submitVendorRequestForm = () => {
    dispatch(
      user.userId === null
        ? handleStartContact(getData())
        : handleStartChat(getData()),
    );
  };

  const isBusyDate = (dt) => Object.keys(calendar?.dates || {}).some((d) => new Date(d).toDateString() === dt.toDateString());

  const busyClassName = ({ date }) => (isBusyDate(date) ? "busy-tile" : "");

  return (
    <>
      <Modal
        show={openImage}
        onHide={() => {
          setOpenImage(false);
        }}
        dialogClassName="view-image-modal"
        aria-labelledby="example-custom-modal-styling-title"
        centered="true"
      >
        <div className="box" style={{ position: "absolute", right: "3.5px", top: "3px" }} />
        <div
          style={{
            position: "absolute",
            right: "11px",
            top: "6px",
            zIndex: "20",
          }}
        >
          <div
            role="presentation"
            onClick={() => {
              setOpenImage(false);
            }}
            className="close-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ cursor: "pointer" }}
            >
              <path
                d="M17 1L1 17M1 1L17 17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <Modal.Body className="p-4">
          <img src={imageSrc} alt="" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>

      <Modal
        show={openVideoModal}
        onHide={() => {
          setOpenVideoModal(false);
        }}
        dialogClassName="view-image-modal"
        aria-labelledby="example-custom-modal-styling-title"
        centered="true"
      >
        <div className="box" style={{ position: "absolute", right: "3.5px", top: "3px" }} />
        <div
          style={{
            position: "absolute",
            right: "11px",
            top: "6px",
            zIndex: "20",
          }}
        >
          <div
            role="presentation"
            onClick={() => {
              setOpenVideoModal(false);
            }}
            className="close-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ cursor: "pointer" }}
            >
              <path
                d="M17 1L1 17M1 1L17 17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <Modal.Body className="p-4">
          <h1 className="text-center">All Videos</h1>
          {
            currentAd?.ad_media[0]?.media_urls?.video && currentAd?.ad_media[0]?.media_urls?.video.map((video_url) => (
              <video
                style={{ width: "100%", maxHeight: "700px", marginTop: "30px" }}
                src={video_url}
                controls
              />
            ))
          }
        </Modal.Body>
      </Modal>

      <Container
        // fluid
        style={{ marginTop: "40px", marginBottom: "200px" }}
        className=""
      >
        <Row>
          <div className="d-flex align-items-center justify-content-between">
            <div className="roboto-bold-36px-h1 ps-4">
              {
                currentAd && currentAd.fav !== null && (
                  <FontAwesomeIcon
                    icon={currentAd.fav ? "fa-heart fa-solid" : faHeart}
                    style={{ color: "#A0C49D", cursor: "pointer" }}
                    className="me-2"
                    onClick={() => {
                      if (user.is_verified) {
                        dispatch(favoriteAd(currentAd.id));
                        setTimeout(() => {
                          getAdInfo();
                        }, 100);
                      } else {
                        dispatch(setValidModal(true));
                      }
                    }}
                  />
                )
              }
              {currentAd?.name}
            </div>

            <div>
              <img src={MapIcon} alt="MapIcon" className="me-2" />
              <span className="roboto-regular-16px-information">
                {currentAd?.city}
                {", "}
                {currentAd?.country.name}
              </span>
            </div>
          </div>
          <Col lg={8}>
            <Row>
              <div className="carousel__container__view__ad">
                <div className="embla__view__ad">
                  <div className="embla__viewport__view__ad" ref={emblaRef}>
                    {mediaQuery.width > 441 ? (
                      <div className="embla__container__view__ad">
                        {slidesModified.map((slide, index) => (
                          <div className="carousel-slide">
                            <Row className="mx-0">
                              <Col
                                sm={6}
                                md={6}
                                lg={
                                  slide[`image${index * 3 + 2}`]
                                  || slide[`image${index * 3 + 3}`]
                                    ? 6
                                    : 12
                                }
                                xl={
                                  slide[`image${index * 3 + 2}`]
                                  || slide[`image${index * 3 + 3}`]
                                    ? 6
                                    : 12
                                }
                                className="main-image-container"
                              >
                                <img
                                  src={slide[`image${index * 3 + 1}`]}
                                  alt={`image${index * 3 + 1}`}
                                  className="main-image"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setImageSrc(slide[`image${index * 3 + 1}`]);
                                    setOpenImage(true);
                                  }}
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
                                        ? "96%"
                                        : "464px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setImageSrc(slide[`image${index * 3 + 2}`]);
                                      setOpenImage(true);
                                    }}
                                  />
                                )}
                                {slide[`image${index * 3 + 3}`] && (
                                  <img
                                    src={slide[`image${index * 3 + 3}`]}
                                    alt={`image${index * 3 + 3}`}
                                    className="stacked-image"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setImageSrc(slide[`image${index * 3 + 3}`]);
                                      setOpenImage(true);
                                    }}
                                  />
                                )}
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="embla__container__view__ad">
                        {imageLinks?.map((slide, index) => (
                          <div key={index} className="carousel-slide">
                            <Row>
                              <Col>
                                <img
                                  src={slide}
                                  alt={index}
                                  className="main-image"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setImageSrc(slide);
                                    setOpenImage(true);
                                  }}
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                  <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                  {
                    currentAd?.ad_media[0]?.media_urls?.video?.length > 0 && (
                      <Button variant="light" className="px-4 py-2 w-auto" onClick={() => setOpenVideoModal(true)}>View videos</Button>
                    )
                  }
                </div>
              </div>
            </Row>
          </Col>
          <Col lg={4}>
            <div className="d-flex justify-content-between flex-column h-100">
              <div className="d-flex flex-column">
                <Calendar
                  value={new Date()}
                  tileClassName={busyClassName}
                  className="mb-5"
                />
                <div className="d-flex w-100 align-items-center pt-3">
                  <StarRating
                    averageRating={currentAd?.average_rating?.toFixed(1) || 0}
                    style={{ width: "fit-content", fontSize: "18px", marginRight: "7px" }}
                  />
                  <strong>{currentAd?.average_rating?.toFixed(1) || "0.0"}</strong>
                  <div className="ms-2" style={{ color: "#797979" }}>
                    {currentAd?.total_reviews || 0}
                    {" "}
                    Reviews
                  </div>
                </div>
                {(currentAd?.facebook !== ""
                  || currentAd?.instagram !== ""
                  || currentAd?.youtube !== ""
                  || currentAd?.tiktok !== ""
                  || currentAd?.twitter !== ""
                  || currentAd?.others !== null) && (
                  <div className="d-grid align-items-center justify-content-between mt-3">
                    <div className="roboto-regular-16px-information mb-2">
                      Follow
                      {" "}
                      <strong>{currentAd?.name}</strong>
                      {" "}
                      on
                    </div>

                    <div className="d-flex">
                      {currentAd?.facebook !== "" && (
                        <a
                          className="d-flex align-items-center justify-content-center me-1"
                          style={{
                            border: "1px solid #A0C49D",
                            background: "#A0C49D30",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            color: "#A0C49D",
                          }}
                          href={currentAd?.facebook}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      )}
                      {currentAd?.instagram !== "" && (
                        <a
                          className="d-flex align-items-center justify-content-center me-1"
                          style={{
                            border: "1px solid #A0C49D",
                            background: "#A0C49D30",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            color: "#A0C49D",
                          }}
                          href={currentAd?.instagram}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      )}
                      {currentAd?.youtube !== "" && (
                        <a
                          className="d-flex align-items-center justify-content-center me-1"
                          style={{
                            border: "1px solid #A0C49D",
                            background: "#A0C49D30",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            color: "#A0C49D",
                          }}
                          href={currentAd?.youtube}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faYoutube} />
                        </a>
                      )}
                      {currentAd?.tiktok !== "" && (
                        <a
                          className="d-flex align-items-center justify-content-center me-1"
                          style={{
                            border: "1px solid #A0C49D",
                            background: "#A0C49D30",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            color: "#A0C49D",
                          }}
                          href={currentAd?.tiktok}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faTiktok} />
                        </a>
                      )}
                      {currentAd?.twitter !== "" && (
                        <a
                          className="d-flex align-items-center justify-content-center me-1"
                          style={{
                            border: "1px solid #A0C49D",
                            background: "#A0C49D30",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            color: "#A0C49D",
                          }}
                          href={currentAd?.twitter}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                      )}
                      {currentAd?.others !== "" && (
                        <a
                          className="d-flex align-items-center justify-content-center me-1"
                          style={{
                            border: "1px solid #A0C49D",
                            background: "#A0C49D30",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            color: "#A0C49D",
                          }}
                          href={currentAd?.others}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faLink} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="d-flex">
                <Button
                  type="submit"
                  // onClick={() => navigate("/post-ad")}
                  className="btn btn-success roboto-semi-bold-16px-information w-100 mt-5"
                  style={{}}
                  // style={{ padding: "0 100px" }}
                >
                  Request pricing
                </Button>
              </div> */}
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={8}>
            <div
              className="d-flex align-items-center px-4"
              style={{
                height: "50px",
                width: "100%",
                background: "#F4F4F4",
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
              <div
                className={`${
                  currentTab === 3 && "active-tab"
                } roboto-regular-16px-information tab`}
                onClick={() => setCurrentTab(3)}
              >
                Reviews
              </div>
            </div>

            {currentTab === 1 && currentAd?.description !== null && (
              <div className="d-flex flex-column ps-4 my-4">
                <div className="d-flex roboto-semi-bold-24px-h3">About</div>

                <div
                  className="roboto-regular-16px-information mt-2"
                  style={{ overflowWrap: "break-word" }}
                  // dangerouslySetInnerHTML={{ __html: currentAd?.description?.replace(/\n/g, "<br>") }}
                >
                  {
                    currentAd?.description?.split("\n").map((content) => (
                      <>
                        {content}
                        <br />
                      </>
                    ))
                  }
                  {/* {currentAd?.description} */}
                </div>
              </div>
            )}

            {currentTab === 1 && offeredServices.length > 0 && (
              <div className="d-flex flex-column ps-4 my-4">
                <div className="d-flex roboto-semi-bold-24px-h3">
                  Offered services
                </div>

                <Row className="mt-2">
                  {offeredServices.map((service, index) => (
                    <Col key={index} lg={4}>
                      <ul className="custom-lists roboto-regular-16px-information">
                        <li className="ps-2">{service}</li>
                      </ul>
                    </Col>
                  ))}
                </Row>

                {
                  currentAd.offered_services.concat(currentAd.site_services).length > 12 && offeredServices.length === 12 && (
                    <Row className="mt-2">
                      <Col lg={4} />
                      <Col lg={4}>
                        <Button variant="success" className="px-5 w-auto" onClick={displayAllOfferedServices}>View more</Button>
                      </Col>
                      <Col lg={4} />
                    </Row>
                  )
                }
              </div>
            )}

            {currentTab === 1 && currentAd && currentAd.ad_media[0].media_urls.pdf.length > 0 && (
              <div className="d-flex flex-column ps-4 my-4">
                <div className="d-flex roboto-semi-bold-24px-h3">PDF's</div>

                <Row>
                  {
                    currentAd.ad_media[0].media_urls.pdf.map((pdf) => (
                      <Col sm={1} md={2} lg={4} className="mt-4">
                        <a
                          className="w-100 h-100"
                          style={{ textDecoration: "none", color: "black" }}
                          href={pdf}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="discount p-4">
                            <img src={DiscountTag} alt="discount-tag" className="me-2" />
                            <span style={{ maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {pdf.split("/").slice(-1)}
                            </span>
                          </div>
                        </a>
                      </Col>
                    ))
                  }
                </Row>
              </div>
            )}

            {currentTab === 2 && (
              <div className="d-flex flex-column ps-4 my-4">
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
                        >
                          {faq.answer}
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

                {currentAd?.ad_faq_ad.map((faq, index) => (
                  <div>
                    <div
                      className="d-flex roboto-regular-18px-body3 mt-4"
                      style={{ fontWeight: "700" }}
                    >
                      {faq.site_question.question}
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
                        >
                          {faq.answer}
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
            )}

            {currentTab === 3 && (
              <Reviews adId={currentAd?.id} adName={currentAd?.name} reviewPosting={currentAd?.review_posting} />
            )}
          </Col>
          <Col lg={4}>
            {user?.userId === null
            || (user?.userId !== null && user?.role === "client") ? (
                chatId !== null ? (
                  <Button variant="success" className="w-100" disabled={!user.is_verified} onClick={() => navigate(`/messages?chatId=${chatId}`)}>Go to Chat</Button>
                ) : (
                  <Form
                    className="message-vendor-form"
                  >
                    <div
                      className="d-flex justify-content-center align-items-center roboto-semi-bold-28px-h2"
                      style={{ marginBottom: "26px" }}
                    >
                      {user.userId === null ? "Contact" : "Message"}
                      {" "}
                      Vendor
                    </div>

                    <Form.Control
                      style={{ minHeight: "120px" }}
                      className="lg-input-small-text mb-4"
                      name="message.text"
                      as="textarea"
                      rows={3}
                      type="text"
                      size="lg"
                      placeholder="Message"
                      value={text || ""}
                      onChange={(e) => setText(e.target.value)}
                    />

                    {user?.userId === null ? (
                      <>
                        <Form.Control
                          style={{ height: "56px" }}
                          className="lg-input-small-text mb-4"
                          type="text"
                          name="message.full_name"
                          size="sm"
                          placeholder="First and Last Name"
                          value={name || ""}
                          onChange={(e) => setName(e.target.value)}
                        />

                        <Form.Control
                          style={{ height: "56px" }}
                          className="lg-input-small-text mb-4"
                          type="email"
                          name="message.email"
                          size="sm"
                          placeholder="Email"
                          value={email || ""}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <Form.Control
                          style={{ height: "56px" }}
                          className="lg-input-small-text mb-4"
                          type="text"
                          name="message.phone"
                          size="sm"
                          placeholder="Phone"
                          value={phone || ""}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </>
                    ) : (
                      ""
                    )}

                    <Form.Control
                      style={{ height: "56px" }}
                      className="lg-input-small-text mb-4"
                      type="date"
                      name="message.event_date"
                      size="sm"
                      placeholder="Event date"
                      value={eventDate || ""}
                      onChange={(e) => setEventDate(e.target.value)}
                    />

                    <p className="roboto-regular-14px-information">
                      By clicking ‘Send’, I agree to Allevents
                      {" "}
                      <a className="roboto-regular-14px-information" href="#">
                        Privacy Policy
                      </a>
                      , and
                      {" "}
                      <a className="roboto-regular-14px-information" href="#">
                        Terms of Use
                      </a>
                    </p>

                    <Button
                      type="button"
                      className="btn btn-success roboto-semi-bold-16px-information w-100"
                      onClick={submitVendorRequestForm}
                      disabled={!user.is_verified}
                    >
                      Send
                    </Button>
                  </Form>
                )) : (
                ""
              )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewAd;
