import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";

import Loader from "../Layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { createAllErrors, forgotPassword } from "../../Actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../MetaData";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      alert.error(error.error);
      dispatch(createAllErrors());
    }

    if (message) {
      alert.success(message);
    }
  }, [dispatch, error, alert, message]);

  return (
    <>
      {loading && <Loader />}
      <MetaData title="Forgot Password" />
      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password</h2>

          <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
            <div className="forgotPasswordEmail">
              <i className="bi bi-envelope-check-fill"></i>{" "}
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <input type="submit" value="Send" className="forgotPasswordBtn" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
