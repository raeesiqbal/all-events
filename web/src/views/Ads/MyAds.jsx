/* eslint-disable camelcase */
import React, { useEffect } from "react";
import {
  Button, Card, Col, Container, Modal, Row,
} from "react-bootstrap";
// import * as formik from "formik";
// import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import placeholderIcon from "../../assets/images/placeholder.jpg";
import TimeIcon from "../../assets/images/post-ad/carbon_time.svg";
import MapIcon from "../../assets/images/post-ad/map-outlined.svg";
import deleteIcon from "../../assets/images/post-ad/delete.svg";
import editIcon from "../../assets/images/post-ad/edit.svg";
import gotoIcon from "../../assets/images/post-ad/goto.svg";
import noAds from "../../assets/images/post-ad/no-ads.svg";
import { secureInstance } from "../../axios/config";
import "./Ads.css";
import { handleUpdateAds, listVendorAds } from "../redux/Posts/AdsSlice";
import useWindowDimensions from "../../utilities/hooks/useWindowDimension";
import { currentSubscriptionDetails } from "../redux/Subscriptions/SubscriptionsSlice";

function MyAds() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = React.useState(false);
  const [currentAdId, setCurrentAdId] = React.useState(null);

  const user = useSelector((state) => state.auth.user);
  const vendorAds = useSelector((state) => state.Ads.vendorAds);
  const currentSubscription = useSelector((state) => state.subscriptions.currentSubscriptionDetails);
  const { width } = useWindowDimensions();

  const handleDeleteAd = async () => {
    try {
      // setLoading(true);
      await secureInstance.request({
        url: `/api/ads/${currentAdId}/`,
        method: "Delete",
      });
      const updatedAds = vendorAds.filter((ad) => ad.id !== currentAdId);
      dispatch(handleUpdateAds(updatedAds));
      setModalShow(false);
      // setCurrentAd(request.data.data);
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
    dispatch(currentSubscriptionDetails());
    dispatch(listVendorAds());
  }, []);

  const sortedAdvertisements = [...vendorAds].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={{ border: "none" }} />
        <Modal.Body>
          <h4>Are you sure you want to delete this ad?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            className="btn-md roboto-regular-16px-information text-white"
            style={{
              height: "44px",
              fontWeight: "500",
              paddingLeft: "32px",
              paddingRight: "32px",
            }}
            onClick={() => handleDeleteAd()}
          >
            Delete
          </Button>
          <Button className="btn-success" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="my-ad-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "2rem" }}>
          <div className="roboto-bold-36px-h1">Ad Management</div>
          <div className="roboto-regular-18px-body3">
            Keep track of your posted ads with ease
          </div>
        </div>
      </div>

      <Container
        fluid
        style={{ marginTop: "40px", marginBottom: "200px" }}
        className=""
      >
        <Row
          className="justify-content-center"
          style={{
            flexDirection:
              sortedAdvertisements.length === 0
              && width <= 768
              && "column-reverse",
          }}
        >
          {sortedAdvertisements.length > 0 ? (
            sortedAdvertisements.map((product) => {
              const {
                id,
                name,
                sub_category,
                created_at,
                country,
                ad_media,
                description,
              } = product;
              return (
                <Col lg={10} className="mb-4">
                  <Card key={id} className="ad-card">
                    <Row className="g-0">
                      <Col xs={12} sm={3} style={{ padding: "20px" }}>
                        <Card.Img
                          src={
                            ad_media[0].media_urls.images !== undefined
                              ? ad_media[0]?.media_urls?.images[0]
                              : placeholderIcon
                          }
                          alt="AdTemp"
                          style={{
                            height: "100%",
                            maxHeight: "330px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col
                        xs={12}
                        sm={9}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <Card.Body style={{ height: "100%" }}>
                          <div className="d-flex flex-column justify-content-between h-100">
                            <div>
                              <Card.Title style={{ marginBottom: "8px" }}>
                                <div className="d-flex justify-content-between">
                                  <div className="roboto-semi-bold-28px-h2">
                                    {name}
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
                                    {sub_category.name}
                                  </div>
                                </div>

                                <div className="roboto-regular-14px-information d-flex align-items-center mt-2">
                                  <img
                                    src={TimeIcon}
                                    alt="TimeIcon"
                                    className="me-2"
                                  />
                                  {dayjs(created_at).format("MMM D[th], YYYY")}
                                </div>
                              </Card.Title>
                              <Card.Text
                                className="roboto-regular-16px-information"
                                style={{
                                  marginTop: "20px",
                                  marginBottom: "17px",
                                  maxWidth: "70%",
                                }}
                              >
                                {description
                                  && (description.length > 200
                                    ? `${description.slice(0, 200)}...`
                                    : description)}
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
                                  <img
                                    src={MapIcon}
                                    alt="MapIcon"
                                    className="me-2"
                                  />
                                  {country.name}
                                </div>
                                <div>
                                  <Tooltip title="Edit" placement="top">
                                    <img
                                      src={editIcon}
                                      alt="editIcon"
                                      className="me-3"
                                      onClick={() => navigate(`/edit-ad/${id}`)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>

                                  <Tooltip title="Delete" placement="top">
                                    <img
                                      src={deleteIcon}
                                      alt="deleteIcon"
                                      className="me-3"
                                      onClick={() => {
                                        setModalShow(true);
                                        setCurrentAdId(id);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>

                                  <Tooltip title="View" placement="top">
                                    <img
                                      src={gotoIcon}
                                      alt="gotoIcon"
                                      className="me-3"
                                      onClick={() => navigate(`/view-ad/${id}`)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>
                                  {/* {
                                    user.role === "client" && (
                                      <img
                                        src={gotoIcon}
                                        alt="editIcon"
                                        className="me-3"
                                        onClick={() => dispatch(favoriteAd(id))}
                                        style={{ cursor: "pointer" }}
                                      />
                                    )
                                  } */}
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
                <Col lg={10} className="d-flex justify-content-center">
                  <div className="roboto-semi-bold-28px-h2">
                    Currently you have no Ads!
                  </div>
                </Col>
                <Col lg={12} className="d-flex justify-content-center mt-4">
                  <ul>
                    <li
                      className="roboto-regular-18px-body3"
                      style={{ color: "#797979" }}
                    >
                      Post your Services as an ad and start making money
                    </li>
                    <li
                      className="roboto-regular-18px-body3"
                      style={{ color: "#797979" }}
                    >
                      Multiple categories to choose from
                    </li>
                    <li
                      className="roboto-regular-18px-body3"
                      style={{ color: "#797979" }}
                    >
                      Easy transactions and smooth process
                    </li>
                    <Button
                      type="submit"
                      onClick={() => navigate("/post-ad")}
                      className="btn btn-success roboto-semi-bold-16px-information btn-lg mt-5"
                      style={{ width: "80%", marginLeft: "-20px" }}
                    >
                      Post an Ad
                    </Button>
                  </ul>
                </Col>
              </Col>

              <Col sm={12} md={12} lg={6}>
                <div className="d-flex justify-content-center w-100">
                  <img
                    src={noAds}
                    alt="noAds"
                    style={{ maxWidth: "100%", objectFit: "cover" }}
                  />
                </div>
              </Col>
            </>
          )}
        </Row>

        {vendorAds.length > 0 && (
          <Container className="d-flex justify-content-end mt-5">
            <Row className="d-flex justify-content-end">
              {
                (currentSubscription === null || (currentSubscription && vendorAds.length < currentSubscription?.type?.allowed_ads)) && (
                  <Button
                    variant="success"
                    type="submit"
                    className="roboto-semi-bold-16px-information btn btn-height w-100"
                    onClick={() => navigate("/post-ad")}
                  >
                    Post another Ad
                  </Button>
                )
              }
              {
                currentSubscription && vendorAds.length >= currentSubscription?.type?.allowed_ads && (
                  <h5 className="text-danger">
                    You have posted maximum allowed ads.
                    {" "}
                    {
                      currentSubscription.type.type !== "featured" && (
                        "If you want to post more ads, please update your subscription package."
                      )
                    }
                  </h5>
                )
              }
            </Row>
          </Container>
        )}
      </Container>
    </>
  );
}

export default MyAds;
