import React, { useContext } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import Head from "next/head";
import { PropagateLoader } from "react-spinners";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { cartAtom } from "../atom/cartAtom";

const CartPage = () => {
  const {
    setCart,
    isLoading,
    setIsLoading,
    buyProducts,
    txnUrls,
    error,
    setError,
    errorMsg,
    setErrorMsg,
    deleteFromCart,
  } = useContext(StoreContext);

  const cart = useRecoilValue(cartAtom);

  return cart?.length > 0 ? (
    <div className="flex flex-col items-end justify-center space-y-5">
      <Head>
        <title>Blockstore | Cart</title>
      </Head>

      <div className="flex flex-col max-w-screen w-full items-start overflow-x-auto">
        <h3 className="text-xl mb-4 ml-2 text-white">
          {cart?.length} Item(s) in your Cart
        </h3>
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart?.map((cartItem, idx) => (
              <tr key={idx}>
                <th>{idx + 1}</th>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-10 h-10 rounded-lg"
                    src={cartItem?.image}
                    alt={cartItem?.name}
                  />
                </td>
                <td>{cartItem?.name}</td>
                <td className="flex items-center space-x-3">
                  <div className="p-2 bg-black rounded-full cursor-pointer">
                    <FaPlus />
                  </div>
                  <span>{cartItem?.qty}</span>
                  <div className="p-2 bg-black rounded-full cursor-pointer">
                    <FaMinus />
                  </div>
                </td>
                <td>{cartItem?.price} ETH</td>
                <td>{cartItem?.price * cartItem?.qty} ETH</td>
                <td>
                  <button
                    onClick={() => deleteFromCart(cartItem?.id)}
                    className="btn btn-error btn-outline flex items-center justify-center space-x-2"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center">
        <label
          onClick={() => {
            setIsLoading(true);
            buyProducts();
          }}
          className="btn btn-primary mr-5 modal-button"
          htmlFor="payment-modal"
        >
          Pay Now
        </label>

        <input type="checkbox" id="payment-modal" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box flex flex-col items-center space-y-5">
            <h3 className="font-bold text-center text-lg">
              Payment in Progress
            </h3>
            <div className="py-4 flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center flex-col justify-center space-y-4">
                  <PropagateLoader color="#3ABFF8" />
                  <span className="text-sm mt-5 mb-2">
                    NOTE: You need to Authorize multiple Wallet Transactions for
                    multiple products
                  </span>
                </div>
              ) : (
                <div className="flex items-center flex-col space-y-5">
                  <p
                    className={`text-3xl ${
                      !error ? "text-success" : "text-error"
                    }`}
                  >
                    {!error ? "Payment Complete!" : "Payment Failed :("}
                  </p>
                  {error && errorMsg && (
                    <p className="text-xl text-center text-error">{errorMsg}</p>
                  )}
                  <ul>
                    {txnUrls.map((url, i) => (
                      <Link key={i} href={url} passHref>
                        <li className="flex items-center space-x-4">
                          Product #{i}:{" "}
                          <a
                            target="_blank"
                            referrerPolicy="noreferrer nooopener"
                            className="text-success underline"
                          >
                            View on Block Explorer
                          </a>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-action">
              {!isLoading && (
                <label
                  onClick={() => {
                    if (!error) setCart([]);
                    setError(false);
                    setErrorMsg("");
                  }}
                  htmlFor="payment-modal"
                  className="btn"
                >
                  Close
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center mt-5">
      <Head>
        <title>Blockstore | Cart</title>
      </Head>
      <h3 className="text-4xl text-center">
        <span className="text-white">Cart is Empty!!</span>
        <br />
        <Link href="/" passHref>
          <a className="text-xl text-secondary underline underline-offset-4">
            Go Shopping :)
          </a>
        </Link>
      </h3>
    </div>
  );
};

export default CartPage;
