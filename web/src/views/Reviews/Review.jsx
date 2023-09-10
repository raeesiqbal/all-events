import React from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import StarRating from "../../components/Rating/StarRating";
import defaultProfilePhoto from "../../assets/images/profile-settings/person.svg";

const Review = ({ review }) => {
  const user = useSelector((state) => state.auth.user);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  return (
    <Row className="w-100">
      <Col sm={2} className="d-flex">
        <img
          src={user.userImage || defaultProfilePhoto}
          alt="Profile"
          className="ms-auto"
          style={{ width: "70px", height: "70px", borderRadius: "50%" }}
        />
      </Col>
      <Col sm={10} className="py-2">
        <div style={{ fontSize: "16px" }}>
          <span className="me-3" style={{ fontWeight: "700", width: "fit-content" }}>
            {review.full_name}
          </span>
          <span style={{ color: "#797979" }}>{review.title}</span>
        </div>
        <div
          className="d-flex w-100 mb-2"
        >
          <div className="me-2">
            <StarRating averageRating={review.rating} style={{ fontSize: "18px" }} />
          </div>
        </div>
        <div className="w-100 mb-2">
          {review.message}
        </div>
        <div className="mb-2" style={{ fontSize: "16px", color: "#797979" }}>
          Sent on
          {" "}
          {formatDate(review.created_at)}
        </div>
        <div className="d-md-flex justify-content-between">
          {
            review.photos.map((photo, index) => (
              <img src={photo} alt={index} className="me-2" height="122px" />
            ))
          }
        </div>
      </Col>
    </Row>
  );
};

export default Review;
