import React from "react";

const arr = [1, 2, 3, 4, 5];

const Rating = ({ value, size, id }) => {
  return (
    <div className={`rating rating-${size}`}>
      {arr.map((i, idx) => (
        <input
          readOnly
          key={i}
          type="radio"
          name={`rating-${id}`}
          className={`bg-yellow-500 mask mask-star-2`}
          checked={i === Math.floor(value)}
        />
      ))}
    </div>
  );
};

export default Rating;
