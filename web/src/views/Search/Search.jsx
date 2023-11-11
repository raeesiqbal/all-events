import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "react-bootstrap";
import HeroSection from "../Homepage/HeroSection";
import "./Search.css";
import Filters from "./Filters";
import Ads from "./Ads";
import { listAdsByFilter, setPayloadData } from "../redux/Search/SearchSlice";

const Search = () => {
  const dispatch = useDispatch();
  const { isLoggedInState } = useSelector((state) => state.auth);
  const { offset, limit } = useSelector((state) => state.search.data.pagination);
  const { keyword } = useSelector((state) => state.search.data);
  const {
    categories, subcategories, questions, commercialName, country,
  } = useSelector((state) => state.search.data.payload);

  useEffect(() => {
    dispatch(setPayloadData({ data: keyword }));
    dispatch(listAdsByFilter({
      data: {
        data: {
          categories, subcategories, questions, commercial_name: commercialName, country,
        },
        filter: true,
      },
      limit,
      offset,
      isLoggedIn: isLoggedInState,
    }));
  }, [isLoggedInState]);

  return (
    <>
      <HeroSection />
      <Row className="py-4 p-xl-5 mx-lg-5 mx-3">
        <Filters />
        <Ads />
      </Row>
    </>
  );
};

export default Search;
