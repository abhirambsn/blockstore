import React, { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import Product from "./Product";

const Products = () => {
  const { products } = useContext(StoreContext);

  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  useEffect(() => {
    if (search.length === 0) {
      setResult(products);
      return;
    }
    setResult(
      products?.filter((prod) =>
        prod.attributes.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);
  return (
    <div className="flex flex-col items-center mb-3 md:max-w-5xl lg:max-w-7xl mt-4">
      <div className="form-control">
        <label className="input-group">
          <span>
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search for Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-[200px] md:w-[400px]"
          />
        </label>
      </div>

      <div className="gap-x-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {result?.map((prod) => {
          return (
            <Product key={prod?.id} id={prod?.id} product={prod?.attributes} />
          );
        })}
      </div>
    </div>
  );
};

export default Products;
