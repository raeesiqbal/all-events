import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { faBorderAll, faListUl } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { favoriteAd } from "../redux/Posts/AdsSlice";
import Pagination from "./Pagination";

const Ads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adsList = useSelector((state) => state.search.data.adsList);
  const count = useSelector((state) => state.search.data.pagination.count);

  const [activeView, setActiveView] = useState("list");
  const [maxWords, setMaxWords] = useState(250);

  useEffect(() => {
    setMaxWords(activeView === "list" ? 250 : 80);
  }, [activeView]);

  return (
    <Col md={9} className="ps-md-4">
      <div className="mx-0 mb-3 d-none d-md-flex justify-content-between align-items-center">
        <div>{`${count} Results`}</div>
        <div className="d-flex rounded p-2" style={{ backgroundColor: "#F4F4F4" }}>
          <div
            className={`d-flex px-3 py-2 justify-content-between align-items-center ${activeView === "list" ? "rounded bg-white fw-bold" : "text-secondary"}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveView("list")}
          >
            <FontAwesomeIcon className="me-2" icon={faListUl} size="lg" />
            List
          </div>
          <div
            className={`d-flex px-3 py-2 justify-content-between align-items-center ${activeView === "images" ? "rounded bg-white fw-bold" : "text-secondary"}`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveView("images")}
          >
            <FontAwesomeIcon className="me-2" icon={faBorderAll} size="lg" />
            Images
          </div>
        </div>
      </div>
      <Row className="mx-0">
        {
          adsList?.map((ad) => (
            <Col md={activeView === "list" ? 12 : 4} className={`mb-4 p-0 ${activeView === "list" ? "" : "pe-2"}`}>
              <Row className="rounded bg-white p-3 mx-0 h-100">
                <Col md={activeView === "list" ? 4 : 12} className="position-relative">
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
                <Col md={activeView === "list" ? 8 : 12} className={activeView === "list" ? "" : "mt-3"}>
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
                      <span style={{ fontSize: "14px", fontWeight: "700" }}>{ad.average_rating || "0.0"}</span>
                      <span>
                        {" "}
                        (
                        {ad.total_reviews}
                        )
                      </span>
                    </div>
                  </div>
                  <div className="w-100 mb-3" style={{ fontSize: "16px" }}>
                    {ad.description.length > maxWords ? `${ad.description.slice(0, maxWords)}...` : ad.description}
                  </div>
                  <div className="w-100">
                    <Button
                      variant="success"
                      className={`px-4 py-2 ${activeView === "list" ? "" : "w-100"}`}
                      onClick={() => navigate(`/view-ad/${ad.id}`)}
                    >
                      See Vendor
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          ))
        }
      </Row>
      <Pagination />
    </Col>
  );
};

export default Ads;
