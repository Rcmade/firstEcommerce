import React, { useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import Metadata from "../MetaData";
import { createAllErrors, getProducts } from "../../Actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const { loading, error, products } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  useEffect(() => {
    if (error?.message) {
      alert.error(error?.message);
      dispatch(createAllErrors());
    }
    dispatch(getProducts());
  }, [dispatch, alert, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Metadata title="Ecommerce" />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <i className="bi bi-mouse2"></i>
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {products &&
              products?.map((product , index) => <ProductCard key={index} product={product} />)}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
