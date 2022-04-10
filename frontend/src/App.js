import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Components/Layout/Header/Header";
import Home from "./Components/Home/Home";
import ProductDetails from "./Components/Products/ProductDetails";
import Products from "./Components/Products/Products";
import Search from "./Components/Products/Search";
import LoginSignUp from "./Components/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./Actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./Components/Layout/Header/UserOptions";
import Profile from "./Components/User/Profile";
import ProtectedRouted from "./Components/Routes/ProtectedRouted";
import UpdateProfile from "./Components/User/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ForgotPassword from "./Components/User/ForgotPassword";
import ResetPassword from "./Components/User/ResetPassword";
import Cart from "./Components/Cart/Cart";
import Shipping from "./Components/Cart/Shipping";
import ConfirmOrder from "./Components/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./Components/Cart/Payment";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./Components/Cart/OrderSuccess";
import MyOrders from "./Components/Cart/Orders/MyOrders";
import OrdetDetails from "./Components/Cart/Orders/OrdetDetails";
import Dashbord from "./Components/Admin/Dashbord";
import ProductList from "./Components/Admin/ProductList";
import NewProduct from "./Components/Admin/NewProduct";
import UpdateProduct from "./Components/Admin/UpdateProduct";
import OrderList from "./Components/Admin/OrderList";
import ProcessOrder from "./Components/Admin/ProcessOrder";
import UsersList from "./Components/Admin/UsersList";
import UpdateUser from "./Components/Admin/UpdateUser";
import ProductReviews from "./Components/Admin/ProductReviews";
import NotFound from "./Components/Layout/Not Found/NotFound";
import Loader from "./Components/Layout/Loader/Loader";
const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/sendstripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <>
      {isAuthenticated && <UserOptions user={user} />}
      <Router>
        <Header user={user} />
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRouted
              exact
              path="/process/payment"
              component={Payment}
            />
          </Elements>
        )}

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path={`/product/:id`}>
            <ProductDetails />
          </Route>
          <Route exact path={`/products`}>
            <Products />
          </Route>
          <Route exact path={`/products?keyword`}>
            <Products />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/login">
            <LoginSignUp />
          </Route>
          <ProtectedRouted exact path="/account">
            <Profile />
          </ProtectedRouted>
          {/*
          
         */}
          <ProtectedRouted exact path="/me/update" component={UpdateProfile} />
          <ProtectedRouted
            exact
            path="/password/update"
            component={UpdatePassword}
          />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route
            exact
            path="/password/reset/:token"
            component={ResetPassword}
          />
          <Route exact path="/cart" component={Cart} />
          <ProtectedRouted exact path="/shipping" component={Shipping} />
          <ProtectedRouted
            exact
            path="/order/confirm"
            component={ConfirmOrder}
          />
          <ProtectedRouted exact path="/success" component={OrderSuccess} />
          <ProtectedRouted exact path="/orders/me" component={MyOrders} />
          <ProtectedRouted exact path="/order/:id" component={OrdetDetails} />
          <ProtectedRouted
            isAdmin={true}
            exact
            path="/admin/dashboard"
            component={Dashbord}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path="/admin/products"
            component={ProductList}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path="/admin/product"
            component={NewProduct}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path="/admin/product/:id"
            component={UpdateProduct}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path="/admin/orders"
            component={OrderList}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path={`/admin/order/:id`}
            component={ProcessOrder}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path={`/admin/users`}
            component={UsersList}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path={`/admin/user/:id`}
            component={UpdateUser}
          />
          <ProtectedRouted
            isAdmin={true}
            exact
            path={`/admin/reviews`}
            component={ProductReviews}
          />
          <Route
            component={
              window.location.pathname === "/process/payment" ? null : NotFound
            }
          />{" "}
        </Switch>
      </Router>
    </>
  );
};

export default App;
