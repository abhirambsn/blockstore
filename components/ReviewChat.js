import React, { useContext, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import Review from "./Review";

const ReviewChat = ({ reviews, productId }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0.0);
  const [posting, setPosting] = useState(false);

  const { currentAccount, postReview } = useContext(StoreContext);

  return (
    <div className="flex flex-col space-y-3 mb-2 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl border-b border-b-gray-600">Reviews</h2>
        <label
          htmlFor="newReview-modal"
          className="btn modal-button btn-secondary btn-outline flex items-center justify-center space-x-2"
        >
          <FaEdit />
          <span className="hidden md:inline">New Review</span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {reviews.map((review) => (
          <Review key={review.id} id={review.id} review={review.attributes} />
        ))}
      </div>
      <input type="checkbox" id="newReview-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Posting as{" "}
            <span className="text-primary">
              {currentAccount.slice(0, 5) + "..." + currentAccount.slice(-5)}
            </span>
          </h3>
          <div className="py-4 flex flex-col items-start justify-start">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Title.."
                className="input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Review</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Review..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.1}
                placeholder="Rating.."
                className="input input-bordered"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="modal-action flex justify-between">
            <label
              htmlFor="newReview-modal"
              className="btn btn-outline btn-error"
            >
              Close
            </label>
            <label
              onClick={() => {
                setPosting(true);
                postReview(productId, { title, text, rating });
                setTitle("");
                setText("");
                setRating(0.0);
                setPosting(false);
              }}
              disabled={posting}
              htmlFor="addProduct-modal"
              className="btn btn-outline btn-secondary flex items-center justify-center space-x-2"
            >
              <FaEdit />
              <span>Post</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewChat;
