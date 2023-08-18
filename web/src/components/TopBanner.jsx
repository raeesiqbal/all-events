import React from "react";
import bag from "../assets/images/bag.svg";

function TopBanner() {
  return (
    <div
      className="d-flex justify-content-end align-items-center"
      style={{ backgroundColor: "black", height: "38px" }}
    >
      <div className="roboto-regular-16px-information text-white" style={{ marginRight: "5rem" }}>
        <img src={bag} alt="Featured" className="me-3 mb-1" />
        Are you a vendor?
      </div>
    </div>
  );
}

export default TopBanner;
