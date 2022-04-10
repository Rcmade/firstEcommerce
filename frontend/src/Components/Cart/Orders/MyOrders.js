import React, { useEffect } from "react";
import "./myOrders.css";
import { clearAllErrors, myOrders } from "../../../Actions/orderAction";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { useAlert } from "react-alert";

import Loader from "../../Layout/Loader/Loader";
import MetaData from "../../MetaData";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);
  const alert = useAlert();

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
    //   sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <i className="bi bi-send-check-fill"></i>
          </Link>
        );
      },
    },
  ];
  let rows = [];
  orders && orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
  });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearAllErrors());
    }
    dispatch(myOrders());
  }, [dispatch, alert, error]);
  return (
    <>
      {loading && <Loader />}
      <MetaData title={`${user.name} - Orders`} />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        className="myOrdersTable"
        autoHeight
      />
      <p id="myOrdersHeading">{user.name}'s Orders</p>
    </>
  );
};

export default MyOrders;
