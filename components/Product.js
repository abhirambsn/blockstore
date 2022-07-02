import { useRouter } from "next/router";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import Rating from "./Rating";

const Product = ({ product, id }) => {
  const router = useRouter();
  const { cart, setCart } = useContext(StoreContext);
  const addToCart = () => {
    const productExists = cart?.filter((cartItem) => cartItem.id === id);
    if (productExists.length > 0) {
      const newCart = cart?.filter((cartItem) => cartItem.id !== id);
      setCart([...newCart, { id, ...product, qty: productExists[0].qty + 1 }]);
    } else {
      setCart([...cart, { id, ...product, qty: 1 }]);
    }
    toast.success("Added to Cart!");
  };
  return (
    <div className="mt-8 card card-compact w-96 bg-base-100 shadow-xl">
      <figure className="mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product?.image} className="w-64 h-64" alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2
          className="card-title cursor-pointer"
          onClick={() => router.push(`/product/${id}`)}
        >
          {product?.name.slice(0, 30)}...
        </h2>
        <p>{product?.description.slice(0, 100)}...</p>
        <div className="flex items-center space-x-2">
          <Rating size={"sm"} id={id} value={Math.floor(product?.rating)} />
        </div>
        <div className="card-actions justify-between items-center">
          <div className="font-bold text-primary text-xl flex items-center space-x-2 justify-center">
            <span>{product?.price} ETH</span>
          </div>
          <button
            onClick={addToCart}
            className="btn btn-success btn-sm space-x-4 rounded-md flex items-center justify-center"
          >
            <FaCartPlus />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
