import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeComponent from "./StripeComponent";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <StripeComponent />
    </Elements>
  );
};

export default StripeCheckout;
