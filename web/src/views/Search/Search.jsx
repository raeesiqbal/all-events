import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "react-bootstrap";
import Header from "../../components/Navbar/Navbar";
import HeroSection from "../Homepage/HeroSection";
import Footer from "../../components/Footer/Footer";
import Login from "../Login/Login";
import TopBanner from "../../components/TopBanner";
import "./Search.css";
import Filters from "./Filters";
import { listAdsByKeyword } from "../redux/Search/SearchSlice";
import Ads from "./Ads";

const Search = () => {
  const dispatch = useDispatch();
  const keyword = useSelector((state) => state.search.data.keyword);

  useEffect(() => {
    dispatch(listAdsByKeyword({ keyword, limit: 10, offset: 0 }));
  }, []);

  return (
    <>
      <Login />
      <TopBanner />
      <Header />
      <HeroSection />
      <Row className="py-4 p-md-5 mx-md-5 mx-3">
        <Filters />
        <Ads />
      </Row>
      <Footer />
    </>
  );
};

export default Search;
