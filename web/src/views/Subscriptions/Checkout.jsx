import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setScreenLoading } from "../redux/Auth/authSlice";
import { Alert } from "@mui/material";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clientSecret, subscriptionId } = useSelector((state) => state.subscriptions);
  // eslint-disable-next-line no-undef
  const [stripe, setStripe] = useState();
  const [elements, setElements] = useState();
  const [message, setMessage] = useState({
    type: null,
    text: "",
  });

  useEffect(() => {
    dispatch(setScreenLoading(true));
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => {
      setStripe(window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleCheckout = async (event) => {
    event.preventDefault();
    dispatch(setScreenLoading(true));

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.protocol}//${window.location.host}/subscriptions`,
      },
    });

    if (result.error) {
      setMessage({
        type: "error",
        text: result.error.message,
      });
    } else {
      setMessage({
        type: "success",
        text: "Checkout Successfull",
      });
    }

    setTimeout(() => {
      setMessage({
        type: null,
        text: "",
      });
    }, 4000);

    dispatch(setScreenLoading(false));
  };

  useEffect(() => {
    if (stripe && clientSecret !== "" && subscriptionId !== "") setElements(stripe.elements({ clientSecret, subscriptionId }));
  }, [clientSecret, subscriptionId, stripe]);

  useEffect(() => {
    if (elements) {
      const paymentElement = elements.create("payment");
      paymentElement.mount("#payment-element");
      setTimeout(() => {
        dispatch(setScreenLoading(false));
      }, 500);
    }
  }, [elements]);

  return (
    <>
      <Alert
        severity={message.type || "success"}
        variant="filled"
        style={{
          position: "fixed",
          top: message.type ? "80px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "ease 200ms",
          opacity: message.type ? 1 : 0,
          zIndex: 2,
        }}
      >
        {message.text}
      </Alert>

      <Container className="py-5 my-5">
        <h1>Checkout</h1>
        {
          clientSecret !== "" && (
            <Form id="payment-form" onSubmit={handleCheckout}>
              <div id="payment-element" />
              <div className="w-100 d-flex py-4">
                <Button className="ms-auto" variant="success" type="submit" id="submit">Checkout</Button>
              </div>
              <div id="error-message" />
            </Form>
          )
        }
      </Container>
    </>
  );
};

export default Checkout;
