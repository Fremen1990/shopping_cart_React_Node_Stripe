// LOAD REACT AND REACT ROUTER
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// LOAD REACT-QUERY
import { QueryClientProvider, QueryClient } from "react-query";

// LOAD PAGES
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Result from "./pages/Result";

// LOAD STRIPE and shoping cart handling libraries
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "use-shopping-cart";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

// APII FOR STRIPE
const stripePromise = loadStripe(
  "pk_test_51IsZiNLJQAqGBVHYnjPyS8IEBGU1Tte5a8ctv9qRVCId2dxfKeE1T5i5JR8yEiuYMmimuSuDe1G6h3xb7t43iFrX00ZDxb8QVb"
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider
        mode="checkout-session"
        stripe={stripePromise}
        currency="USD"
      >
        <BrowserRouter>
          <Navbar />

          <Toaster position="top-center" />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/result" component={Result} />
            <Route path="/:productId" component={Product} />
          </Switch>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
