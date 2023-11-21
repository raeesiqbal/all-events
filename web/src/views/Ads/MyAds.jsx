/* eslint-disable camelcase */
import React, { useEffect } from "react";
import {
  Button, Card, Col, Container, Modal, Row,
} from "react-bootstrap";
// import * as formik from "formik";
// import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import placeholderIcon from "../../assets/images/placeholder.jpg";
import TimeIcon from "../../assets/images/post-ad/carbon_time.svg";
import MapIcon from "../../assets/images/post-ad/map-outlined.svg";
import deleteIcon from "../../assets/images/post-ad/delete.svg";
import editIcon from "../../assets/images/post-ad/edit.svg";
import gotoIcon from "../../assets/images/post-ad/goto.svg";
import noAds from "../../assets/images/post-ad/no-ads.svg";
import { secureInstance } from "../../axios/config";
import { handleUpdateAds, listVendorAds } from "../redux/Posts/AdsSlice";
import { handleProfileSettingsCurrentView } from "../redux/TabNavigation/TabNavigationSlice";
import useWindowDimensions from "../../utilities/hooks/useWindowDimension";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import "./Ads.css";

function MyAds() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = React.useState(false);
  const [currentAdId, setCurrentAdId] = React.useState(null);

  const { user } = useSelector((state) => state.auth);
  const { vendorAds } = useSelector((state) => state.Ads);
  const currentSubscription = useSelector(
    (state) => state.subscriptions.currentSubscriptionDetails,
  );
  const { width } = useWindowDimensions();

  const infostyle = {
    border: "2px solid #9B9B9B",
    color: "#9B9B9B",
    borderRadius: "50%",
    fontSize: "13px",
    width: "20px",
    height: "20px",
  };

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

  const isPaidSubscription = () => currentSubscription && currentSubscription.status !== "unpaid";

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listVendorAds());
  }, []);

  const sortedAdvertisements = [...vendorAds].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <>
      <Modal
        show={modalShow}
        onHide={() => {
          dispatch(setModalShow(false));
        }}
        size="md"
        aria-labelledby="example-custom-modal-styling-title"
        centered="true"
      >
        <div
          className="box"
          style={{ position: "absolute", right: "3.5px", top: "3px" }}
        />
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
              dispatch(setModalShow(false));
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
        <Modal.Body className="text-center p-4">
          <h4>Are you sure to delete this ad?</h4>
          <div className="text-center px-5 mt-4">
            <Button
              variant="outline-secondary"
              size="lg"
              className="roboto-regular-16px-information px-5 fw-bold me-3"
              onClick={() => setModalShow(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="roboto-regular-16px-information px-5 fw-bold text-white"
              onClick={() => handleDeleteAd()}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="my-ad-banner d-flex align-items-center justify-content-between">
        <div style={{ marginLeft: "2rem" }}>
          <div className="roboto-bold-36px-h1">Ad Management</div>
          <div className="roboto-regular-18px-body3">
            Keep track of your posted ads with ease
          </div>
        </div>
        <ProfilePic />
      </div>

      <Container fluid style={{ marginTop: "60px", marginBottom: "200px" }}>
        {vendorAds.length > 0 && (
          <Container className="mb-4 px-0">
            <Row>
              {currentSubscription
                && currentSubscription.status !== "unpaid"
                && vendorAds.length >= currentSubscription?.type?.allowed_ads && (
                  <div className="d-flex align-items-center px-0">
                    <div
                      style={infostyle}
                      className="d-flex align-items-center justify-content-center me-2"
                    >
                      <FontAwesomeIcon icon={faInfo} size="sm" />
                    </div>
                    <div style={{ fontSize: "20px" }}>
                      Ad Limit Reached,
                      {currentSubscription.type.type !== "featured" && (
                        <>
                          {" "}
                          <Link to="/plans">Upgrade</Link>
                          {" "}
                          your package to post
                          more Ads
                        </>
                      )}
                    </div>
                  </div>
              )}
              {currentSubscription === null && (
                <div className="d-flex align-items-center px-0">
                  <div
                    style={infostyle}
                    className="d-flex align-items-center justify-content-center me-2"
                  >
                    <FontAwesomeIcon icon={faInfo} size="sm" />
                  </div>
                  <div style={{ fontSize: "20px" }}>
                    Please subscribe to a plan to active your Ads.
                    {" "}
                    <Link to="/plans">Click here</Link>
                    {" "}
                    to see our plans.
                  </div>
                </div>
              )}
              {currentSubscription
                && currentSubscription.status === "unpaid" && (
                  <div className="d-flex align-items-center px-0">
                    <div
                      style={infostyle}
                      className="d-flex align-items-center justify-content-center me-2"
                    >
                      <FontAwesomeIcon icon={faInfo} size="sm" />
                    </div>
                    <div style={{ fontSize: "20px" }}>
                      Plan failed to renew, please update your payment method.
                      {" "}
                      <span
                        className="click-here"
                        onClick={() => {
                          dispatch(
                            handleProfileSettingsCurrentView("PaymentMethod"),
                          );
                          navigate("/profile-settings");
                        }}
                      >
                        Click here
                      </span>
                    </div>
                  </div>
              )}
            </Row>
          </Container>
        )}
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
                status,
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
                            maxHeight: "245px",
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
                                    className="roboto-regular-14px-information text-white px-2"
                                    style={{
                                      borderRadius: "8px",
                                      background: `${
                                        status === "active"
                                          ? "#A0C49D"
                                          : "#C6A451"
                                      }`,
                                      fontWeight: "500",
                                      height: "fit-content",
                                    }}
                                  >
                                    {status}
                                  </div>
                                </div>
                                <div
                                  className="mt-1"
                                  style={{ fontSize: "20px", color: "#797979" }}
                                >
                                  {sub_category.name}
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
                                  wordBreak: "break-word",
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
                                  <Tooltip
                                    title={
                                      isPaidSubscription() && user.is_verified
                                        ? "Edit"
                                        : "Can't Edit"
                                    }
                                    placement="top"
                                  >
                                    <img
                                      src={editIcon}
                                      alt="editIcon"
                                      className="me-3"
                                      onClick={() => (isPaidSubscription() && user.is_verified
                                        ? navigate(`/edit-ad/${id}`)
                                        : null)}
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
                      disabled={!isPaidSubscription() || !user.is_verified}
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
              {currentSubscription
                && currentSubscription.status !== "unpaid"
                && vendorAds.length < currentSubscription?.type?.allowed_ads && (
                  <Button
                    variant="success"
                    type="submit"
                    className="roboto-semi-bold-16px-information btn btn-height w-100"
                    onClick={() => navigate("/post-ad")}
                  >
                    Post another Ad
                  </Button>
              )}
            </Row>
          </Container>
        )}
      </Container>
    </>
  );
}

export default MyAds;
