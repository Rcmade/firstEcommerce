import React from "react";
import { Link } from "react-router-dom";
import "./orderSuccess.css";

const OrderSuccess = () => {
  return (
    <>
      <div className="orderSuccess">
        <i className="bi bi-check2-circle"></i>
        <p>Your Order has been Placed successfully </p>
        <Link to="/orders/me">View Orders</Link>
      </div>
    </>
  );
};

export default OrderSuccess;
