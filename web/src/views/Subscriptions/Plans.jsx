import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Row,
} from "react-bootstrap";
import { listPlans } from "../redux/Subscriptions/SubscriptionsSlice";
import Plan from "./Plan";
import Login from "../Login/Login";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Plans = () => {
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.subscriptions.plans);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(listPlans(user?.userId !== null));
  }, [user]);

  return (
    <>
      <Login />
      <Header />
      <Container className="py-5">
        <h1 className="mb-5 fw-bold ps-2">Plans</h1>
        <Row className="my-5 mx-0">
          {plans.map((plan, index) => <Plan plan={plan} index={index} />)}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Plans;
