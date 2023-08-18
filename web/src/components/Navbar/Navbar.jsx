import React, { useEffect, useState } from "react";
// import './Navbar';
import { Button, Col, Form, Row } from "react-bootstrap"; // Import Bootstrap components

import { useDispatch, useSelector } from "react-redux";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faArrowDown,
  faBars,
} from "@fortawesome/fontawesome-free-solid";
import { useNavigate } from "react-router-dom";
import { faArrowDownShortWide } from "@fortawesome/free-solid-svg-icons";
import Allevents from "../../assets/images/Allevents.svg";
import "./Navbar.css";
import {
  toggleLoginModal,
  toggleLoginView,
} from "../../views/redux/Login/loginSlice";
import {
  toggleRegisterModal,
  toggleRegisterView,
} from "../../views/redux/Register/RegisterSlice";
import {
  getAuthenticatedUser,
  refreshToken,
} from "../../views/redux/Auth/authSlice";
import { deleteCookie, getCookie } from "../../utilities/utils";
import { handleProfileSettingsCurrentView } from "../../views/redux/TabNavigation/TabNavigationSlice";

function Header() {
  const dispatch = useDispatch();
  const [navbarToggler, setNavbarToggler] = useState(false);
  const isRegisterView = useSelector((state) => state.register.isRegisterView);
  const isLoginView = useSelector((state) => state.login.isLoginView);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshTokenValue = getCookie("refresh_token");
    if (refreshTokenValue && user.accessToken === null) {
      dispatch(refreshToken());
    }
  }, []);

  useEffect(() => {
    if (
      user.userId === null &&
      user.accessToken !== null &&
      window.location.pathname === "/"
    ) {
      dispatch(getAuthenticatedUser());
    }
  }, [user, user.accessToken]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (isRegisterView) {
      dispatch(toggleRegisterView());
    }
    if (!isLoginView) {
      dispatch(toggleLoginView());
    }
    dispatch(toggleLoginModal());
  };

  const handleRegisterClick = (e) => {
    if (isLoginView) {
      dispatch(toggleLoginView());
    }
    e.preventDefault();
    if (!isRegisterView) {
      dispatch(toggleRegisterView());
    }
    dispatch(toggleLoginModal());
    // dispatch(toggleRegisterModal());
  };

  const handleNavbarToggler = () => {
    setNavbarToggler(!navbarToggler);
  };

  const handleLogout = () => {
    deleteCookie("refresh_token");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleBack = () => {
    if (window.location.pathname === "/profile-settings") {
      dispatch(handleProfileSettingsCurrentView("profileSettings"));
      return;
    }
    navigate(-1);
  };

  return (
    <Navbar bg="body-tertiary" expand="lg" className="navbar">
      {window.location.pathname !== "/" && (
        <div
          className="d-flex"
          style={{ cursor: "pointer", width: "5vw" }}
          onClick={handleBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              // eslint-disable-next-line max-len
              d="M21.6666 9.66668H5.43992L12.8933 2.21334L10.9999 0.333344L0.333252 11L10.9999 21.6667L12.8799 19.7867L5.43992 12.3333H21.6666V9.66668Z"
              fill="#667085"
            />
          </svg>
        </div>
      )}
      <Navbar.Brand onClick={() => navigate("/")}>
        <img src={Allevents} alt="Allevents" style={{ minWidth: "100%" }} />
      </Navbar.Brand>
      {user.userId === null && (
        <Button
          type="button"
          // className="login-button"
          // variant="success"
          // type="submit"
          className="btn-no-border roboto-semi-bold-16px-information login-button-mobile me-2"
          style={{ padding: "0" }}
          onClick={(e) => handleLoginClick(e)}
        >
          Login
        </Button>
      )}

      <Navbar.Toggle
        aria-controls="navbarSupportedContent"
        className="custom-toggler"
        style={{ border: "none", outline: "0", boxShadow: "none" }}
        onClick={handleNavbarToggler}
      >
        <span className="navbar-toggler-icon">
          {navbarToggler ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M10.4695 8.95046L17.7595 1.66046C17.9234 1.46916 18.009 1.22308 17.9993 0.971403C17.9895 0.719727 17.8852 0.480988 17.7071 0.302894C17.529 0.124799 17.2903 0.0204662 17.0386 0.0107451C16.7869 0.00102391 16.5408 0.0866304 16.3495 0.250457L9.05954 7.54046L1.76954 0.240457C1.57824 0.0766302 1.33217 -0.00897537 1.08049 0.000745785C0.828814 0.0104669 0.590075 0.114799 0.411981 0.292893C0.233886 0.470988 0.129554 0.709727 0.119832 0.961403C0.110111 1.21308 0.195718 1.45915 0.359544 1.65046L7.64954 8.95046L0.349544 16.2405C0.244862 16.3301 0.159842 16.4404 0.0998186 16.5645C0.0397953 16.6886 0.00606467 16.8237 0.000745179 16.9614C-0.00457431 17.0991 0.0186316 17.2365 0.0689062 17.3648C0.119181 17.4931 0.195439 17.6097 0.292894 17.7071C0.390349 17.8046 0.506896 17.8808 0.635221 17.9311C0.763546 17.9814 0.900878 18.0046 1.0386 17.9993C1.17632 17.9939 1.31145 17.9602 1.43551 17.9002C1.55958 17.8402 1.6699 17.7551 1.75954 17.6505L9.05954 10.3605L16.3495 17.6505C16.5408 17.8143 16.7869 17.8999 17.0386 17.8902C17.2903 17.8804 17.529 17.7761 17.7071 17.598C17.8852 17.4199 17.9895 17.1812 17.9993 16.9295C18.009 16.6778 17.9234 16.4318 17.7595 16.2405L10.4695 8.95046Z"
                fill="#797979"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
            >
              <rect width="22" height="2" rx="1" fill="#1A1A1A" />
              <rect y="7" width="22" height="2" rx="1" fill="#1A1A1A" />
              <rect x="9" y="14" width="13" height="2" rx="1" fill="#1A1A1A" />
            </svg>
          )}
        </span>
      </Navbar.Toggle>
      <Navbar.Collapse id="navbarSupportedContent" className="navbar-collapse">
        <Nav className="mx-auto">
          <NavDropdown
            // title="For him"
            id="navbarDropdown"
            title={
              <div className="d-flex align-items-center">
                For him{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            }
          >
            <NavDropdown.Item href="#">Action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <div className="d-flex align-items-center">
                For her{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            }
            id="navbarDropdown"
          >
            <NavDropdown.Item href="#">Action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <div className="d-flex align-items-center">
                Vendors{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            }
            id="navbarDropdown"
          >
            <NavDropdown.Item href="#">Action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <div className="d-flex align-items-center">
                Venues{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            }
            id="navbarDropdown"
          >
            <NavDropdown.Item href="#">Action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <div className="d-flex align-items-center">
                Planning tools{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            }
            id="navbarDropdown"
          >
            <NavDropdown.Item href="#">Action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form role="search" style={{ maxHeight: "40px" }}>
          {user.userId === null ? (
            <Row>
              <Col lg={3}>
                <Button
                  type="button"
                  // className="login-button"
                  // variant="success"
                  // type="submit"
                  className="btn-no-border login-button roboto-semi-bold-16px-information"
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#A0C49D",
                    padding: "0",
                  }}
                  onClick={(e) => handleLoginClick(e)}
                >
                  Login
                </Button>
              </Col>

              <Col lg={2}>
                <Button
                  variant="outline-success"
                  type="button"
                  className="create-account-btn align-items-center justify-content-center"
                  onClick={(e) => handleRegisterClick(e)}
                  style={{ padding: "0 2vw" }}
                >
                  <span style={{ whiteSpace: "nowrap" }}>Create Account</span>
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg={3}>
                <Button
                  type="button"
                  className="btn-danger-custom text-danger roboto-semi-bold-16px-information"
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    // color: "red",
                    padding: "0",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Col>

              <Col lg={2}>
                <Button
                  variant="outline-success"
                  type="submit"
                  className="mb-2 ms-3"
                  onClick={(e) => navigate("/post-ad")}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Dashboard
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
