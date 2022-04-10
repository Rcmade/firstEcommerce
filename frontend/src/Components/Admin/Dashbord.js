import React, { useEffect } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  getAdminProduct,
  // deleteProduct,
} from "../../Actions/productAction";

import { Doughnut, Line } from "react-chartjs-2";
import { getAllOrders } from "../../Actions/orderAction";
import { getAllUsers } from "../../Actions/userAction";

const Dashbord = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.allOrders);
  let outOfStock = 0;

  const { users } = useSelector((state) => state.allUsers);

  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  orders && orders.forEach((item) => (totalAmount += item.totalPrice));



  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "Total Amount",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  };

  return (
    <>
      <div className="dashboard">
        <MetaData title="Dashboard - Admin Panel" />
        <Sidebar />

        <div className="dashboardContainer">
          <h1 component="h1">Dashboard</h1>

          <div className="dashboardSummary">
            <div>
              <p>
                Total Amount <br /> {totalAmount} RS
              </p>
            </div>
            <div className="dashboardSummaryBox2">
              <Link to="/admin/products">
                <p>Product</p>
                <p>{products && products.length}</p>
              </Link>
              <Link to="/admin/orders">
                <p>Orders</p>
                <p>{orders && orders.length}</p>
              </Link>
              <Link to="/admin/users">
                <p>Users</p>
                <p></p>
                <p>{users && users.length}</p>
              </Link>
            </div>
          </div>

          <div className="lineChart">
            <Line data={lineState} />
          </div>

          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashbord;
