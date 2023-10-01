// import React from 'react'

import React from "react";
import PlanYourEvents from "./PlanYourEvents";
import "./Homepage.css";
import HeroSection from "./HeroSection";
import PremiumVenues from "./PremiumVenues";
import PremiumVendors from "./PremiumVendors";
import VendorsByCountry from "./VendorsByCOuntry";
import StartPlanning from "./StartPlanning";

function Homepage() {
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
