import React, { useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { createAllErrors, getProducts } from "../../Actions/productAction";
import Loader from "../Layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useAlert } from "react-alert";
import Metadata from "../MetaData";
const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  let location = useLocation().search;
  const keyword = location;
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [prices, setPrices] = useState(0);
  const [ratings, setRatings] = useState(0);
  const alert = useAlert();

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    // filteredProductsCount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(createAllErrors());
    }
    dispatch(
      getProducts(
        keyword,
        currentPage,
        prices,
        category?.toLocaleLowerCase(),
        ratings
      )
    );
  }, [dispatch, keyword, currentPage, prices, category, ratings, error, alert]);

  const setCurrentPageNum = (e) => {
    setCurrentPage(e);
  };
  const priceHandler = (e) => {
    setPrices(e.target.value);
  };

  return (
    <>
      <Metadata title=" Products - Ecommerce" />
      {loading && <Loader />}
      <h2 className="productsHeading">Products</h2>

      <div className="products">
        {products &&
          products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

      {/* {keyword && ( */}
      <div className="filterBox">
        <label htmlFor="customRange1" className="form-label">
          <h4>Price Range</h4>
          <span>
            ₹{prices} - ₹{Number(prices) + Number(10000)}
          </span>
        </label>
        <input
          type="range"
          className="form-range"
          value={prices}
          onChange={priceHandler}
          id="customRange1"
          min={0}
          max={25000}
          title={`Price Range ${prices}`}
        />
        <fieldset></fieldset>

        <h5>Categories</h5>
        <fieldset></fieldset>
        <ul className="categoryBox">
          {categories.map((category) => (
            <li
              className="category-link"
              key={category}
              onClick={() => setCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>

        <label htmlFor="customRange1" className="form-label">
          <h4>Rating Above {ratings > 0 && ratings} </h4>
        </label>
        <input
          value={ratings}
          onChange={(e) => setRatings(e.target.value)}
          type="range"
          className="form-range"
          min={0}
          max={5}
          step={1}
          id="customRange3"
        />
      </div>
      {/* )} */}
      {resultPerPage < productsCount && products?.length && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount || 1}
            onChange={setCurrentPageNum}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
      )}
    </>
  );
};

export default Products;
