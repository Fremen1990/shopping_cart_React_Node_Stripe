const express = require("express");
const products = require("./products.json");

module.exports = function getRoutes() {
  const router = express.Router();

  // router.get("/products", (req, res) => {
  //   res.status(200).json({ products });
  // });

  // API ENDPOINT FOR ALL PRODUCT LIST
  router.get("/products", getProducts);

  // ADDING ENDPOINT FOR SINGLE PRODUCT PER: ProductId
  router.get("/products/:productId", getProduct);

  return router;
};

// FUNCTION TO GET ALL PRODUCTS JSON
function getProducts(req, res) {
  res.status(200).json({ products });
}

//FUNCTION TO GET ONE PRODUCT BY ProductId
function getProduct(req, res) {
  const { productId } = req.params;
  const product = products.find((product) => product.id === productId);

  try {
    if (!product) {
      throw Error(`No product found for id: ${productId}`);

      // return res.status(404).json({ error });
    }
    res.status(200).json({ product });
  } catch (error) {
    return res.status(404).json({ statusCode: 404, message: error.message });
  }
}
