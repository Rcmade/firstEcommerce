import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../MetaData";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, clearAllErrors } from "../../../Actions/orderAction";
import Loader from "../../Layout/Loader/Loader";
import { useAlert } from "react-alert";

import "./orderDetails.css";
const OrdetDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert = useAlert();
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearAllErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error,id]);

  return (
    <>
      {loading && <Loader />}

      <MetaData title="Order Details" />
      <div className="orderDetailsPage">
        <div className="orderDetailsContainer">
          <h1 >Order #{order && order._id}</h1>
          <p>Shipping Info</p>
          <div className="orderDetailsContainerBox">
            <div>
              <p>Name:</p>
              <span>{order.user && order.user.name}</span>
            </div>
            <div>
              <p>Phone:</p>
              <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
            </div>
            <div>
              <p>Address:</p>
              <span>
                {order.shippingInfo &&
                  `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
              </span>
            </div>
          </div>
          <p>Payment</p>
          <div className="orderDetailsContainerBox">
            <div>
              <p
                className={
                  order.paymentInfo && order.paymentInfo.status === "succeeded"
                    ? "greenColor"
                    : "redColor"
                }
              >
                {order.paymentInfo && order.paymentInfo.status === "succeeded"
                  ? "PAID"
                  : "NOT PAID"}
              </p>
            </div>

            <div>
              <p>Amount:</p>
              <span>{order.totalPrice && order.totalPrice}</span>
            </div>
          </div>

          <p>Order Status</p>
          <div className="orderDetailsContainerBox">
            <div>
              <p
                className={
                  order.orderStatus && order.orderStatus === "Delivered"
                    ? "greenColor"
                    : "redColor"
                }
              >
                {order.orderStatus && order.orderStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="orderDetailsCartItems">
          <p>Order Items:</p>
          <div className="orderDetailsCartItemsContainer">
            {order.orderItems &&
              order.orderItems.map((item) => (
                <div key={item.product}>
                  <img src={item.image} alt="Product" />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <span>
                    {item.quantity} X ₹{item.price} ={" "}
                    <b>₹{item.price * item.quantity}</b>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdetDetails;
