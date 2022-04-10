import React, { useState } from "react";
import "./Search.css";
import { useHistory } from "react-router-dom";
import Metadata from "../MetaData";

const Search = (props) => {
  const history = useHistory();
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/products?keyword=${keyword}`);
    } else {
      history.push("/products");
    }
  };

  return (
    <>
      <Metadata title={`Search The Products Here - Ecommerce`} />;
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </>
  );
};

export default Search;
