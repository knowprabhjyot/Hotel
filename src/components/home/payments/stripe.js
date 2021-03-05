import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentsComponent from "./payments";

const PUBLIC_KEY = loadStripe('pk_test_51IRNgPLNWOJy0ayPsI70Wnwvc10SZJ4FEKIAuXBJMjyY1rVj7dQNdwoobINUH767MgrV3FacRLaO5RK87obv1Q7300ftlJLDDC');

const StripeComponent = () => {
  return (
    <Elements stripe={PUBLIC_KEY}>
        <PaymentsComponent />
    </Elements>
  );
};

export default StripeComponent;