import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card, Col, Container, Row,
} from "react-bootstrap";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { favoriteAd, listFavoriteAds } from "../redux/Posts/AdsSlice";
import Header from "../../components/Navbar/Navbar";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import Footer from "../../components/Footer/Footer";
import noAds from "../../assets/images/post-ad/no-ads.svg";
import gotoIcon from "../../assets/images/post-ad/goto.svg";
import placeholderIcon from "../../assets/images/placeholder.jpg";

const FavoriteAds = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const favoriteAds = useSelector((state) => state.Ads.favoriteAds);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listFavoriteAds());
  }, []);

  const sortedAdvertisements = [...favoriteAds].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <>
      <Header />
      <TabNavigation role={user?.role} />

      <div className="my-ad-banner p-md-5">
        <div className="roboto-bold-36px-h1 mb-2">Ad Management</div>
        <div className="roboto-regular-18px-body3">
          Keep track of your favorite ads with ease
        </div>
      </div>

      <Container
        fluid
        style={{ marginTop: "40px", marginBottom: "200px" }}
      >
        <Row className="justify-content-center">
          {sortedAdvertisements.length > 0 ? (
            sortedAdvertisements.map((product) => {
              const {
                id,
                ad,
              } = product;
              return (
                <Col lg={10} className="mb-4">
                  <Card key={id} className="ad-card">
                    <Row className="g-0">
                      <Col sm={3} style={{ padding: "20px" }}>
                        <Card.Img
                          src={ad.ad_image || placeholderIcon}
                          alt="AdTemp"
                          style={{ height: "100%", maxHeight: "300px", objectFit: "cover" }}
                        />
                      </Col>
                      <Col
                        sm={9}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <Card.Body style={{ height: "100%" }}>
                          <div className="d-flex flex-column justify-content-between h-100">
                            <div>
                              <Card.Title style={{ marginBottom: "8px" }}>
                                <div className="d-flex justify-content-between">
                                  <div className="roboto-semi-bold-28px-h2">
                                    {ad.name}
                                  </div>
                                  <div
                                    className="roboto-regular-14px-information text-white"
                                    style={{
                                      borderRadius: "10px",
                                      background: "#A0C49D",
                                      padding: "4px 10px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {ad.company}
                                  </div>
                                </div>

                                {/* <div className="roboto-regular-14px-information d-flex align-items-center mt-2">
                                  <img
                                    src={TimeIcon}
                                    alt="TimeIcon"
                                    className="me-2"
                                  />
                                  {dayjs(created_at).format("MMM D[th], YYYY")}
                                </div> */}
                              </Card.Title>
                              <Card.Text
                                className="roboto-regular-16px-information"
                                style={{
                                  marginTop: "20px",
                                  marginBottom: "17px",
                                  maxWidth: "70%",
                                }}
                              >
                                {`${
                                  ad.description && ad.description.slice(0, 200)
                                }...`}
                              </Card.Text>
                            </div>

                            <div>
                              <div
                                style={{
                                  border: "1px solid rgba(26, 26, 26, 0.2)",
                                  width: "100%",
                                }}
                              />
                              <div className="d-flex justify-content-between mt-3">
                                <div className="roboto-regular-14px-information d-flex align-items-center">
                                  {/* <img
                                    src={MapIcon}
                                    alt="MapIcon"
                                    className="me-2"
                                  />
                                  {country.name} */}
                                </div>
                                <div className="d-flex">
                                  <Link to={`/view-ad/${ad.id}`}>
                                    <img
                                      src={gotoIcon}
                                      alt="gotoIcon"
                                      className="me-3"
                                      style={{ cursor: "pointer", width: "40px" }}
                                    />
                                  </Link>
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                      background: "#00000080",
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faHeart}
                                      size="lg"
                                      style={{ color: "#fff" }}
                                      onClick={() => {
                                        dispatch(favoriteAd(ad.id));
                                        window.location.reload();
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })
          ) : (
            <>
              <Col lg={6} style={{ padding: "30px 0" }}>
                <Col
                  lg={10}
                  className="d-flex justify-content-center text-center"
                >
                  <div className="roboto-semi-bold-28px-h2">
                    Currently you have no favorite Ads!
                  </div>
                </Col>
              </Col>

              <Col lg={6} className="d-flex">
                <img
                  src={noAds}
                  alt="noAds"
                  style={{ maxWidth: "100%", objectFit: "cover" }}
                />
              </Col>
            </>
          )}
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default FavoriteAds;
