// import React from 'react'

import React from "react";
import Header from "../../components/Navbar/Navbar";
import PlanYourEvents from "./PlanYourEvents";
import "./Homepage.css";
import HeroSection from "./HeroSection";
import PremiumVenues from "./PremiumVenues";
import PremiumVendors from "./PremiumVendors";
import VendorsByCountry from "./VendorsByCOuntry";
import StartPlanning from "./StartPlanning";
import Footer from "../../components/Footer/Footer";
import Login from "../Login/Login";
import TopBanner from "../../components/TopBanner";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import { useSelector } from "react-redux";

function Homepage() {
  const { accessToken } = useSelector((state) => state.auth.user);

  return (
    <>
      <Login />
      <TopBanner />
      <Header />
      {accessToken !== null && <TabNavigation />}
      <HeroSection />
      <PremiumVenues />
      <PlanYourEvents />
      <PremiumVendors />
      <VendorsByCountry />
      <StartPlanning />
      <Footer />
    </>
  );
}

export default Homepage;
