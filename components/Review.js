import React, { useEffect, useState } from "react";
import Rating from "./Rating";
import moment from "moment";

const formatUser = (addr) =>
  addr.slice(0, 5) + "..." + addr.slice(addr.length - 5);

const Review = ({ review, id }) => {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(moment(review?.createdAt).fromNow());
  }, [review?.createdAt]);

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://avatars.dicebear.com/api/identicon/${review?.user}.svg`}
              alt={review?.user}
              className="rounded-full h-6 w-6"
            />
            <span
              onClick={() => alert(review?.user)}
              className="text-lg hover:cursor-pointer hover:text-primary hover:underline"
            >
              {formatUser(review?.user)}
            </span>
          </div>
          <div className="flex">
            <p>{date}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Rating id={id} size={"xs"} value={review?.rating} />
          <span>{review?.rating}</span>
        </div>
        <h2 className="card-title text-md">{review?.title}</h2>
        <p>{review?.title}</p>
      </div>
    </div>
  );
};

export default Review;
