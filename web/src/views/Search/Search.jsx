import React from "react";
import { Row } from "react-bootstrap";
import HeroSection from "../Homepage/HeroSection";
import "./Search.css";
import Filters from "./Filters";
import Ads from "./Ads";

const Search = () => (
  <>
    <HeroSection />
    <Row className="py-4 p-xl-5 mx-lg-5 mx-3">
      <Filters />
      <Ads />
    </Row>
  </>
);

export default Search;
