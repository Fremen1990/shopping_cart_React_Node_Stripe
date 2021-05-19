// dotenv package for Stripe
require("dotenv").config();

const express = require("express");
const products = require("./products.json");
const { validateCartItems } = require("use-shopping-cart/src/serverUtil");

const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

module.exports = function getRoutes() {
  const router = express.Router();

  // router.get("/products", (req, res) => {
  //   res.status(200).json({ products });
  // });

  // API ENDPOINT FOR ALL PRODUCT LIST
  router.get("/products", getProducts);

  // ADDING ENDPOINT FOR SINGLE PRODUCT PER: ProductId
  router.get("/products/:productId", getProduct);

  router.post("/checkout-sessions", createCheckoutSession);

  router.get("/checkout-sessions/:sessionId", getCheckoutSession);

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

async function createCheckoutSession(req, res) {
  try {
    const cartItems = req.body;
    const line_items = validateCartItems(products, cartItems);

    const origin =
      process.env.NODE_ENV === "production"
        ? req.headers.origin
        : "http://localhost:3000";

    const params = {
      submit_type: "pay",
      payment_method_types: ["card", "p24"],
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "PL"],
      },
      line_items,
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: origin,
      mode: "payment",
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    res.status(200).json(checkoutSession);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getCheckoutSession(req, res) {
  const { sessionId } = req.params;

  try {
    if (!sessionId.startsWith("cs_")) {
      throw Error("incorrect checkout session id");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["payment_intent"] }
    );
    res.status(200).json(checkout_session);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}
