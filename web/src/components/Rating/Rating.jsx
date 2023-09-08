import React from "react";
import StarRating from "./StarRating";
import "./StarRating.css";

function Rating({ averageRating }) {
  return (
    <div
      className="w-100 h-100 bg-white text-center p-3"
      style={{ borderRadius: "10px", boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.1)" }}
    >
      <h1 className="mb-0 line-height-1" style={{ fontWeight: "900" }}>{averageRating}</h1>
      <p>out of 5.0</p>
      <StarRating averageRating={averageRating} />
    </div>
  );
}

export default Rating;
