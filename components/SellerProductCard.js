import { useRouter } from "next/router";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const SellerProductCard = ({ product, id }) => {
  const router = useRouter();
  return (
    <div className="card lg:card-side bg-base-300 shadow-xl">
      <figure className="mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product?.image} alt={product?.name} className="w-44 h-44" />
      </figure>
      <div className="card-body">
        <h2 className="card-title hover:cursor-pointer hover:text-success" onClick={() => router.push(`/product/${id}`)}>{product?.name?.slice(0,30)}</h2>
        <p>{product?.description?.slice(0, 80)}...</p>
        <span className="text-primary font-bold">{product?.price} ETH</span>
        <div className="card-actions justify-end">
          <button className="btn btn-error btn-outline">
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
