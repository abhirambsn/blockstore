import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import { useMoralisQuery } from "react-moralis";
import Rating from "../../components/Rating";
import ReviewChat from "../../components/ReviewChat";
import { StoreContext } from "../../context/StoreContext";

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { products, setCart, cart, reviews } = useContext(StoreContext);
  const [product, setProduct] = useState({});
  const [productReviews, setProductReviews] = useState([])
  

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

  useEffect(() => {
    const product = products.filter((prod) => prod.id === id)[0];
    setProduct(product);
    setProductReviews(reviews.filter((review) => review?.attributes.productId === id))
  }, [id, product, products, reviews]);
  return (
    <div className="flex flex-col max-w-screen">
      <div className="flex flex-col space-y-5 md:space-y-0 px-4 md:px-0 md:flex-row items-start justify-between">
        <Head>
          <title>Blockstore | {product?.attributes?.name}</title>
        </Head>
        <div className="flex-[0.7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product?.attributes?.image}
            alt={product?.attributes?.name}
            className="w-11/12 h-11/12"
          />
        </div>
        <div className="flex flex-col flex-1 items-start space-y-5">
          <div className="flex items-center space-x-52">
            <p className="text-3xl text-center md:text-left mr-8">
              {product?.attributes?.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white hover:cursor-pointer hover:underline hover:text-primary text-lg">
              {Math.floor(product?.attributes?.rating)}
            </span>
            <Rating id={id} size="lg" value={product?.attributes?.rating} />
          </div>
          <p className="text-2xl text-primary">
            {product?.attributes?.price} ETH
          </p>
          <div className="flex">
            <button
              onClick={addToCart}
              className="btn flex items-center justify-center space-x-4 btn-primary w-[98vw] md:w-[300px]"
            >
              <FaCartPlus size={30} />
              <span>Add to Cart</span>
            </button>
          </div>
          <div className="flex flex-col space-y-1">
            <h6 className="text-white">Description</h6>
            <p className="text-justify mr-8">
              {product?.attributes?.description}
            </p>
          </div>
          <div className="flex space-x-3 items-center">
            <h6 className="text-white">Category:</h6>
            <p>{product?.attributes?.category}</p>
          </div>
          <div className="flex flex-col border space-y-4 border-gray-500 p-3 rounded-lg w-full md:w-auto">
            <h3 className="text-2xl">Seller Details</h3>
            <div className="flex justify-start md:justify-between items-center space-x-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rounded-full border border-gray-500 w-10 h-10"
                alt={product?.attributes?.name}
                src="https://avatars.dicebear.com/api/identicon/testseed.svg"
              />
              <div className="flex flex-col space-y-0">
                <h6 className="text-white">Address</h6>
                <span className="text-primary hidden md:inline hover:underline hover:cursor-pointer">
                  {product?.attributes?.seller}
                </span>
                <span className="text-primary md:hidden hover:underline hover:cursor-pointer">
                  {product?.attributes?.seller?.slice(0, 5) +
                    "..." +
                    product?.attributes?.seller?.slice(-5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex m-7">
        <ReviewChat productId={product?.id} reviews={reviews} />
      </div>
    </div>
  );
};

export default ProductPage;
