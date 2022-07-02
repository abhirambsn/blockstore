import React, { useContext } from "react";
import { ConnectButton, CryptoLogos } from "web3uikit";
import { StoreContext } from "../context/StoreContext";
import {
  FaShoppingCart,
  FaEthereum,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, currentAccount, logOut, balance, getBalance, cart } =
    useContext(StoreContext);
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex="0" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 space-y-2"
          >
            <li>
              <button
                onClick={() => router.push("/orders")}
                className="btn flex items-center justify-center space-x-3"
              >
                <span>My Orders</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/cart")}
                className="btn btn-warning btn-outline flex items-center justify-center space-x-3"
              >
                <FaShoppingCart size={15} />
                <p>{cart?.length}</p>
              </button>
            </li>
            <li>
              <button
                onClick={getBalance}
                className="btn btn-primary btn-outline flex space-x-3 items-center justify-center"
              >
                <FaEthereum size={25} />
                <span>{balance} ETH</span>
              </button>
            </li>
            <li>
              <button
                onClick={logOut}
                className="btn btn-success btn-outline flex items-center space-x-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-8 h-8"
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="Metamask Wallet"
                />
                <span>
                  {currentAccount.slice(0, 5)}...
                  {currentAccount.slice(currentAccount.length - 4)}
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (router.pathname.includes("seller")) {
                    router.push("/");
                  } else {
                    router.push("/seller");
                  }
                }}
                className="btn btn-outline flex items-center justify-center space-x-1"
              >
                <FaArrowRight size={20} />
                <span>
                  {router.pathname.includes("seller") ? "Customer" : "Seller"}
                </span>
              </button>
            </li>
          </ul>
        </div>
        <a
          className="btn btn-ghost normal-case text-xl"
          onClick={() => router.replace("/")}
        >
          blockStore
        </a>
      </div>
      <div className="navbar-end flex lg:hidden">
        {!isAuthenticated && <ConnectButton />}
      </div>
      <div className="navbar-end hidden lg:flex">
        {!isAuthenticated ? (
          <ConnectButton />
        ) : (
          <div className="flex space-x-4 ml-2">
            <button
              onClick={() => router.push("/orders")}
              className="btn flex items-center justify-center space-x-3"
            >
              <span>My Orders</span>
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="btn btn-warning btn-outline flex items-center justify-center space-x-3"
            >
              <FaShoppingCart size={15} />
              <p>{cart?.length}</p>
            </button>

            <div
              className="tooltip tooltip-bottom"
              data-tip="Click to Refresh Balance"
            >
              <button
                onClick={getBalance}
                className="btn btn-primary btn-outline flex space-x-3 items-center justify-center modal-button"
              >
                <FaEthereum size={25} />
                <span>{balance} ETH</span>
              </button>
            </div>
            <div className="tooltip tooltip-bottom" data-tip="Click to Logout">
              <button
                onClick={logOut}
                className="btn btn-success btn-outline flex items-center justify-between space-x-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-8 h-8"
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="Metamask Wallet"
                />
                <span>
                  {currentAccount.slice(0, 5)}...
                  {currentAccount.slice(currentAccount.length - 4)}
                </span>
              </button>
            </div>
          </div>
        )}
        <ul className="menu menu-horizontal p-0 ml-2">
          <li>
            <button
              onClick={() => {
                if (router.pathname.includes("seller")) {
                  router.push("/");
                } else {
                  router.push("/seller");
                }
              }}
              className="btn btn-outline flex items-center justify-center space-x-1"
            >
              <FaArrowRight size={20} />
              <span>
                {router.pathname.includes("seller") ? "Customer" : "Seller"}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
