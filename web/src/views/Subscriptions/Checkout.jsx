import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const clientSecret = useSelector((state) => state.subscriptions.clientSecret);
  const subscriptionId = useSelector((state) => state.subscriptions.subscriptionId);
  // eslint-disable-next-line no-undef
  const [stripe, setStripe] = useState(Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
  const [elements, setElements] = useState();

  const handleCheckout = async (event) => {
    event.preventDefault();

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.protocol}//${window.location.host}/`,
      },
    });

    if (result.error) {
      const messageContainer = document.querySelector("#error-message");
      messageContainer.textContent = result.error.message;
    } else {
      // navigate("/subscriptions");
    }
  };

  useEffect(() => {
    if (clientSecret !== "" && subscriptionId !== "") setElements(stripe.elements({ clientSecret, subscriptionId }));
  }, [clientSecret, subscriptionId]);

  useEffect(() => {
    if (elements) {
      const paymentElement = elements.create("payment");
      paymentElement.mount("#payment-element");
    }
  }, [elements]);

  return (
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
  );
};

export default Checkout;
