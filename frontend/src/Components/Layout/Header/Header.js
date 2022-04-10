import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../Actions/userAction";
import { useAlert } from "react-alert";

const Header = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const logout = () => {
    dispatch(logoutUser());
    history.push("/");
    alert.success("Logout Successfully");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Ecommerce
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link " aria-current="page" to="/cart">
                  Cart <i className="bi bi-cart3"></i>
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  <i className="bi bi-search"></i>
                </Link>
              </li>
              {!props.user && (
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                  >
                    Sig In
                  </Link>
                </li>
              )}
              {props.user && (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="/"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={props.user?.avatar?.url}
                      alt="USER"
                      className="speedDialIcon"
                    />
                    {props.user.name}
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/account">
                        Account
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/orders/me">
                        Your Orders
                      </Link>
                    </li>
                    <li onClick={logout}>
                      <Link className="dropdown-item" to="/logout">
                        Logout
                      </Link>
                    </li>

                    {props.user?.role === "admin" && (
                      <>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/dashboard">
                            DashBord
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              )}
            </ul>
            {/* <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
