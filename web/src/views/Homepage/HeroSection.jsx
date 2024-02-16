import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import heroImg1 from "../../assets/images/heroImage.jpg";
import {
  listSuggestions,
  setCountry,
  setPayloadData,
  setSearchKeyword,
} from "../redux/Search/SearchSlice";

function HeroSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const { suggestionsList, keyword } = useSelector(
    (state) => state.search.data
  );
  const suggestionDropdown = useRef();

  const handleSuggestions = (e) => {
    e.preventDefault();

    dispatch(setSearchKeyword({ name: e.target.value }));

    if (e.target.value !== "")
      dispatch(listSuggestions({ search_string: e.target.value }));
    setShowSuggestions(e.target.value !== "");
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setSearchKeyword({ ...suggestion }));
    setShowSuggestions(false);
  };

  const handleSearchButton = () => {
    dispatch(setCountry({ country: "" }));
    if (window.location.pathname === "/") navigate("/search");
  };

  useEffect(() => {
    dispatch(setPayloadData({ data: keyword }));
  }, [keyword]);

  useEffect(() => {
    if (suggestionDropdown.current) {
      suggestionDropdown.current.style.overflowY =
        suggestionDropdown.current.clientHeight > 400 ? "scroll" : "auto";
    }
  }, [suggestionsList]);

  useEffect(() => {
    setIsDisabled(keyword.type === "" || keyword.name === "");
  }, [keyword]);

  return (
    <Container
      fluid
      style={{ height: "auto", padding: "0", marginTop: "36px" }}
    >
      <Row className="h-100 col-12 g-0 flex-column-reverse flex-md-row">
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center"
          style={{ padding: "50px 20px" }}
        >
          <div>
            <div className="hero-text" style={{ maxWidth: "461px" }}>
              <h1 className="text-left heading">Lectus auctor faucibus</h1>
              <p className="text-left">
                Sit pharetra consectetur odio sit. Molestie ipsum aliquam est
                quis morbi.
              </p>
            </div>
            <div className="position-relative me-sm-3">
              <InputGroup className="flex-nowrap">
                <div
                  className="d-flex w-100"
                  style={{
                    border: "1px solid #D9D9D9",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "25px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        // eslint-disable-next-line max-len
                        d="M19.0002 19.0002L14.6572 14.6572M14.6572 14.6572C15.4001 13.9143 15.9894 13.0324 16.3914 12.0618C16.7935 11.0911 17.0004 10.0508 17.0004 9.00021C17.0004 7.9496 16.7935 6.90929 16.3914 5.93866C15.9894 4.96803 15.4001 4.08609 14.6572 3.34321C13.9143 2.60032 13.0324 2.01103 12.0618 1.60898C11.0911 1.20693 10.0508 1 9.00021 1C7.9496 1 6.90929 1.20693 5.93866 1.60898C4.96803 2.01103 4.08609 2.60032 3.34321 3.34321C1.84288 4.84354 1 6.87842 1 9.00021C1 11.122 1.84288 13.1569 3.34321 14.6572C4.84354 16.1575 6.87842 17.0004 9.00021 17.0004C11.122 17.0004 13.1569 16.1575 14.6572 14.6572Z"
                        stroke="#1A1A1A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <FormControl
                    className="shadow-none roboto-regular-16px-information form-control"
                    placeholder="Wedding Venues"
                    style={{
                      outline: 0,
                      border: "none",
                      paddingLeft: "60px",
                      borderRadius: "0",
                      borderRight: "1px solid #D9D9D9",
                    }}
                    value={keyword.name}
                    onChange={handleSuggestions}
                  />
                  <Button
                    variant="success"
                    size="lg"
                    className="roboto-semi-bold-16px-information"
                    style={{ height: "56px", borderRadius: "0px" }}
                    disabled={isDisabled}
                    onClick={() => handleSearchButton()}
                  >
                    Search
                  </Button>
                </div>
              </InputGroup>
              {showSuggestions && (
                <div className="suggestion-dropdown" ref={suggestionDropdown}>
                  {suggestionsList.map((suggestion) => (
                    <div
                      className="w-100 px-3 py-2"
                      onClick={(e) => handleSuggestionClick(suggestion)}
                    >
                      <span className="my-auto px-2">{suggestion.name}</span>
                      <div className="px-3 py-1 bg-secondary text-white my-auto">
                        {suggestion.type.replace(/_/g, " ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col
          md={5}
          className="d-flex"
          style={{ justifyContent: "right", paddingRight: "0" }}
        >
          <img
            src={heroImg1}
            alt="Hero"
            style={{ maxWidth: "100%", objectFit: "cover" }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default HeroSection;
