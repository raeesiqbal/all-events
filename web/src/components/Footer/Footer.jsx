import React from "react";
import "./Footer.css";
import {
  faTwitter,
  faInstagram,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "react-bootstrap";
import { faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Allevents from "../../assets/images/Allevents.svg";

function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="d-flex flex-column h-100" style={{ position: "relative" }}>
      <footer
        className="w-100 pt-4 flex-shrink-0"
        style={{ background: "#000F0D", paddingBottom: "0" }}
      >
        <div className="container pt-4" style={{ paddingBottom: "0" }}>
          <Container>
            <div className="row gy-4 gx-5">
              <div className="col-lg-4 col-md-6">
                {/* <h5 className="h1 text-white">Allevents</h5> */}
                <img src={Allevents} alt="Allevents" className="mt-4" />

                {/* <i className="fas fa-brands fa-instagram" style={{ color: "#ffffff" }}></i> */}
                <p className="roboto-regular-14px-information text-white mt-5">
                  Maecenas consectetur in a a imperdiet nunc cras ipsum.
                  Consequat sed eu sed pharetra velit.
                </p>
              </div>
              <div className="col-lg-4 col-md-6 links-container">
                <ul style={{ paddingLeft: "0" }}>
                  <li className="col-heading">
                    <h3> Resources </h3>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      For him
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      For her
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      Event types
                    </a>
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-4 col-md-6 links-container">
                <ul style={{ paddingLeft: "0" }}>
                  <li className="col-heading">
                    <h3> Contact </h3>
                  </li>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ color: "#A0C49D", marginRight: "14px" }}
                    />
                    <li
                      className="p-0 m-0"
                      style={{ textDecoration: "none", listStyle: "none" }}
                    >
                      <a
                        href="/"
                        className="roboto-regular-14px-information text-white"
                      >
                        support@allevents.com
                      </a>
                    </li>
                  </div>
                  <div className="d-flex">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{
                          color: "#A0C49D",
                          marginRight: "14px",
                          marginLeft: "2px",
                        }}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      <li
                        className="p-0 m-0 mt-3"
                        style={{ textDecoration: "none", listStyle: "none" }}
                      >
                        <a
                          href="/"
                          className="roboto-regular-14px-information text-white text-right"
                        >
                          A cursus turpis eu a pellentesque. Nulla neque donec
                          mauris at.
                        </a>
                      </li>
                    </div>
                  </div>
                  <li>
                    <div
                      className="col item social d-flex align-items-center justify-content-between mt-5"
                      style={{ width: "204px" }}
                    >
                      <FontAwesomeIcon
                        icon={faInstagram}
                        style={{ color: "#FFF" }}
                        size="2xl"
                      />
                      <FontAwesomeIcon
                        icon={faFacebook}
                        style={{ color: "#FFF" }}
                        size="2xl"
                      />
                      <FontAwesomeIcon
                        icon={faTwitter}
                        style={{ color: "#FFF" }}
                        size="2xl"
                      />
                      <FontAwesomeIcon
                        icon={faLinkedin}
                        style={{ color: "#FFF" }}
                        size="2xl"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-center p-4 mt-3"
              style={{ borderTop: "1px solid #ffffff1a" }}
            >
              <span
                className="copyright roboto-regular-14px-information text-white"
                style={{ opacity: "0.6" }}
              >
                Allevents © 2023 - All Right Are Reserved
              </span>
            </div>
          </Container>
        </div>
      </footer>

      <div style={{ position: "absolute", right: "150px", top: "-40px" }}>
        <button
          id="goTop"
          className="btn-footer-top btn-up"
          type="button"
          onClick={handleScrollToTop}
        >
          <svg
            fill="#ffffff"
            height="60px"
            width="60px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="-330 -330 990.00 990.00"
            xmlSpace="preserve"
            stroke="#ffffff"
            transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
            strokeWidth="0.0033"
          >
            <g
              id="SVGRepo_bgCarrier"
              strokeWidth="0"
              transform="translate(0,0), scale(1)"
            >
              <rect
                x="-330"
                y="-330"
                width="990.00"
                height="990.00"
                rx="495"
                fill="#A0C49D"
                strokeWidth="0"
              />
            </g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#CCCCCC"
              strokeWidth="6.6"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                id="XMLID_224_"
                // eslint-disable-next-line max-len
                d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Footer;
