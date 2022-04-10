import React from "react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: "Shipping Details",
      icon: <i className="bi bi-truck-flatbed"></i>,
    },
    {
      label: "Confirm Order",
      icon: <i className="bi bi-check-circle-fill"></i>,
    },
    {
      label: "Payment",
      icon: <i className="bi bi-credit-card"></i>,
    },
  ];

  return (
    <>
      <nav className="bradeNav">
        <ol className="breadol">
          {steps.map((item, index) => (
            <li
              key={index}
              className={`breadli ${activeStep === index ? "activeLi" : ""}`}
            >
              {item.icon} {item.label}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default CheckoutSteps;
