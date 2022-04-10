const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProduct,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getProductDetails);
router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);
router
.route("/admin/product/:id")
.put(isAuthenticated, authorizeRoles("admin"), updateProduct)
.delete(isAuthenticated, authorizeRoles("admin"), deleteProduct)
router.route("/review").put(isAuthenticated, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

  router
    .route("/admin/products")
    .get(isAuthenticated, authorizeRoles("admin"), getAdminProduct);
module.exports = router;

