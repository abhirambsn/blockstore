import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { RiArrowRightLine, RiWallet2Line } from "react-icons/ri";
import { StoreContext } from "../context/StoreContext";
import { useRouter } from "next/router";

const CustomerOrderCard = ({ order, id, customer }) => {
  const router = useRouter();
  const {
    listedProducts,
    markAsShipped,
    releaseFunds,
    markAsDelivered,
    refund,
  } = useContext(StoreContext);

  const formatWalletAddress = (address) =>
    address?.slice(0, 5) + "..." + address?.slice(-5);

  return (
    <div className="card lg:card-side bg-base-300 shadow-xl">
      <div className="card-body space-y-2">
        <h2 className="card-title">Order # {id}</h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <p className="font-bold">{!customer ? "Customer" : "Seller"}</p>
            <div className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element   */}
              <img
                src={
                  !customer
                    ? `https://avatars.dicebear.com/api/identicon/${order?.user}.svg`
                    : `https://avatars.dicebear.com/api/identicon/${order?.seller}.svg`
                }
                alt={!customer ? "Customer" : "Seller"}
                className="rounded-full h-6 w-6"
              />
              <span className="hover:underline hover:cursor-pointer text-primary">
                {!customer
                  ? formatWalletAddress(order?.user)
                  : formatWalletAddress(order?.seller)}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Order Date</p>
            <span className="text-secondary">
              {order?.createdAt.toDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Product</p>
            <span
              className="hover:text-success hover:cursor-pointer hover:underline"
              onClick={() => router.push(`/product/${order?.product?.id}`)}
            >
              {order?.product?.attributes?.name?.slice(0, 20)}...
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Quantity</p>
            <span>{order?.qty}</span>
          </div>
          {customer && (
            <div className="flex flex-col space-y-2">
              <p className="font-bold">Amount</p>
              <span className="text-info">
                {order?.product?.attributes?.price * order?.qty} ETH
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Escrow A/c ID</p>
            <span className="text-accent">{order?.escrowId}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Status</p>
            <span
              className={`${
                order?.status === "Completed"
                  ? "text-success"
                  : order?.status === "Refunded"
                  ? "text-error"
                  : "text-warning"
              }`}
            >
              {order?.status}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Transaction Hash</p>
            <span>
              <Link
                href={`https://goerli.etherscan.io/tx/${order?.txnHash}`}
                passHref
              >
                <a
                  className="hover:underline hover:text-primary hover:cursor-pointer"
                  target="_blank"
                >
                  {order?.txnHash?.slice(0, 20)}...
                </a>
              </Link>
            </span>
          </div>
        </div>
        <div className="flex justify-between space-x-2">
          {customer ? (
            <>
              <button
                disabled={order?.status !== "Shipped"}
                onClick={() => markAsDelivered(id, order?.escrowId)}
                className="btn btn-success min-h-[2rem] h-[2rem] btn-outline flex items-center justify-center space-x-2"
              >
                <RiArrowRightLine />
                <span>Mark as Delivered</span>
              </button>
              <button
                onClick={() => refund(id, order?.escrowId)}
                disabled={
                  order?.status === "Completed" ||
                  order?.status === "Refunded" ||
                  order?.status === "Pending"
                }
                className="btn btn-error min-h-[2rem] h-[2rem] btn-outline flex items-center justify-center space-x-2"
              >
                <RiWallet2Line />
                <span>Take Refund</span>
              </button>
            </>
          ) : (
            <>
              <button
                disabled={order?.status !== "Pending"}
                onClick={() => markAsShipped(id, order?.escrowId)}
                className="btn btn-primary min-h-[2rem] h-[2rem] btn-outline flex items-center justify-center space-x-2"
              >
                <RiArrowRightLine />
                <span>Mark as Shipped</span>
              </button>
              <button
                onClick={() => releaseFunds(id, order?.escrowId)}
                disabled={
                  order?.status !== "Delivered" || !order?.status === "Refunded"
                }
                className="btn btn-success min-h-[2rem] h-[2rem] btn-outline flex items-center justify-center space-x-2"
              >
                <RiWallet2Line />
                <span>Release Funds</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderCard;
