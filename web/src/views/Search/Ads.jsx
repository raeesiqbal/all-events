import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { faHeart, faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { favoriteAd } from "../redux/Posts/AdsSlice";

const Ads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adsList = useSelector((state) => state.search.data.adsList);

  return (
    <Col md={9}>
      <Row>
        {
          adsList?.map((ad) => (
            <Col md={12} className="mb-4 rounded bg-white p-3">
              <Row>
                <Col md={4} className="position-relative">
                  {
                    ad.fav !== null && (
                      <div
                        className="position-absolute"
                        style={{ top: "20px", right: "20px", zIndex: "2" }}
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
                            icon={ad.fav ? "fa-heart fa-solid" : faHeart}
                            size="lg"
                            style={{ color: "#fff", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(favoriteAd(ad.id));
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                  <img src={ad.ad_media[0].media_urls.images[0]} className="w-100" style={{ maxHeight: "227px", overflow: "hidden", objectFit: "cover" }} />
                </Col>
                <Col md={8}>
                  <div className="w-100 d-md-flex justify-content-between mb-3">
                    <div>
                      <div className="w-100" style={{ fontSize: "20px", fontWeight: "700" }}>{ad.name}</div>
                      <div className="w-100">
                        {ad.city}
                        ,
                        {" "}
                        {ad.country.name}
                      </div>
                    </div>
                    <div>
                      <span className="star-filled">&#9733;</span>
                      <span style={{ fontSize: "14px", fontWeight: "700" }}> 4.9</span>
                      <span> (142)</span>
                    </div>
                  </div>
                  <div className="w-100 mb-3" style={{ fontSize: "16px" }}>{ad.description}</div>
                  <div className="w-100">
                    <Button variant="success" className="px-4 py-2" onClick={() => navigate(`/view-ad/${ad.id}`)}>See Vendor</Button>
                  </div>
                </Col>
              </Row>
            </Col>
          ))
        }
      </Row>
    </Col>
  );
};

export default Ads;
