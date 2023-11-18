// import React from 'react'

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlanYourEvents from "./PlanYourEvents";
import HeroSection from "./HeroSection";
import PremiumVenues from "./PremiumVenues";
import PremiumVendors from "./PremiumVendors";
import VendorsByCountry from "./VendorsByCountry";
import StartPlanning from "./StartPlanning";
import { listPremiumVenues, listPremiumVendors } from "../redux/Posts/AdsSlice";
import "./Homepage.css";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(listPremiumVenues(user?.userId !== null));
    dispatch(listPremiumVendors(user?.userId !== null));
  }, [user?.userId]);

  return (
    <>
      <HeroSection />
      <PremiumVenues />
      <PlanYourEvents />
      <PremiumVendors />
      <VendorsByCountry />
      <StartPlanning />
    </>
  );
}

export default Homepage;
