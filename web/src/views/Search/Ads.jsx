import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { faBorderAll, faListUl } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "./Pagination";
import { secureInstance } from "../../axios/config";
import { setAdsList } from "../redux/Search/SearchSlice";

const Ads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adsList } = useSelector((state) => state.search.data);
  const { count } = useSelector((state) => state.search.data.pagination);

  const [activeView, setActiveView] = useState("list");
  const [maxWords, setMaxWords] = useState(250);

  const updatedList = (id) => (
    adsList.map((ad) => {
      if (ad.id === id) {
        return { ...ad, fav: !ad.fav };
      }
      return ad;
    })
  );

  const handleFavoriteAd = async (id) => {
    try {
      const response = await secureInstance.request({
        url: `/api/analytics/ad-fav/${id}/fav/`,
        method: "Post",
      });

      if ([200, 201, 202].includes(response.data.status_code)) {
        dispatch(setAdsList(updatedList(id)));
      }
    } catch (err) {
      // Error
    }
  };

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
            <Col
              md={activeView === "list" ? 12 : 3}
              className={`mb-4 p-0 ${activeView === "list" ? "" : "pe-3"}`}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/view-ad/${ad.id}`)}
            >
              <Row className="rounded bg-white p-2 mx-0 h-100">
                <Col md={activeView === "list" ? 3 : 12} className="position-relative px-0">
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
                              handleFavoriteAd(ad.id);
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                  <img
                    src={ad.ad_media[0].media_urls.images[0]}
                    alt=""
                    className="w-100"
                    style={{
                      maxHeight: "227px",
                      overflow: "hidden",
                      objectFit: "cover",
                      borderRadius: "5px",
                      height: activeView === "list" ? "auto" : "220px",
                    }}
                  />
                </Col>
                <Col md={activeView === "list" ? 9 : 12} className={activeView === "list" ? "" : "mt-3"}>
                  <div className={`w-100 ${activeView === "list" ? "d-md-flex" : ""} justify-content-between mb-3`}>
                    <div className={activeView === "list" ? "" : "w-100"}>
                      <div
                        className={`w-100 ${activeView === "list" ? "" : "mb-2"}`}
                        style={{ fontSize: "20px", fontWeight: "700" }}
                      >
                        {ad.name}
                      </div>
                      <div className={`w-100 ${activeView === "list" ? "" : "mb-2"}`}>
                        {ad.city}
                        ,
                        {" "}
                        {ad.country.name}
                      </div>
                    </div>
                    <div className={activeView === "list" ? "" : "w-100"}>
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
                  {
                    activeView === "list" && (
                      <div className="w-100 mb-3" style={{ fontSize: "16px" }}>
                        {ad.description.length > maxWords ? `${ad.description.slice(0, maxWords)}...` : ad.description}
                      </div>
                    )
                  }
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
