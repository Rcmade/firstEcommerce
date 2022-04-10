import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import {
  createAllErrors,
  getProductDetails,
  newReview,
} from "../../Actions/productAction";
import ReviewCard from "./ReviewCard";
import Loader from "../Layout/Loader/Loader";
import { useAlert } from "react-alert";
import { addItemsToCart } from "../../Actions/cartActions";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../Constants/productConstant";

const ProductDetails = () => {
  const alert = useAlert();
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { success, error: reviewError } = useSelector(
    (state) => state.newReviews
  );
  const { product } = productDetails;
  const [quantity, setQuantity] = useState(1);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  useEffect(() => {
    if (productDetails?.error) {
      alert.error(productDetails?.error?.message);
      dispatch(createAllErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, alert, productDetails?.error]);

  useEffect(() => {
    if (reviewError) {
      alert.error(reviewError?.message || reviewError);
      dispatch(createAllErrors());
    }
    if (success) {
      alert.success("Review Submited Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, alert, success, reviewError, id]);

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product?.Stock <= quantity) return;
    setQuantity(quantity + 1);
  };
  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  const options = {
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
    name: "text-feedback",
    size: "large",
  };

  return (
    <>
      {productDetails?.loading && <Loader />}
      <div className="ProductDetails">
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {productDetails?.product?.images?.map((img, index) => {
              return (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={img._id}>
                  <img src={img.url} className="d-block w-100" alt="..." />
                </div>
              );
            })}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div>
          <div className="detailsBlock-1">
            <h2>{product?.name}</h2>
            <p>Product # {product?._id}</p>
          </div>
          <div className="detailsBlock-2">
            <Rating {...options} readOnly />
            <span className="detailsBlock-2-span">
              ({product?.numOfReviews} Reviews)
            </span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product?.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity}>-</button>
                <button className="quantity" disabled={true}>
                  {quantity}
                </button>
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button
                disabled={product?.Stock < 1 ? true : false}
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            </div>

            <p>
              Status:
              <b className={product?.Stock < 1 ? "redColor" : "greenColor"}>
                {product?.Stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
          </div>

          <div className="detailsBlock-4">
            Description : <p>{product?.description}</p>
            <button onClick={submitReviewToggle} className="submitReview">
              Submit Review
            </button>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={Number(rating)}
                name="rating"
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                name="comment"
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product?.reviews && product?.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
