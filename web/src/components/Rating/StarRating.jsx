import React from "react";
import "./StarRating.css";

function StarRating({ averageRating, style }) {
  // Calculate the number of full stars
  const fullStars = Math.floor(averageRating);

  // Calculate the percentage of the partially filled star
  const partialStarPercentage = (averageRating - fullStars) * 100;

  // Create an array of stars
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      // Full star
      stars.push(<span key={i} className="star-filled">&#9733;</span>);
    } else if (i === fullStars + 1 && partialStarPercentage > 0) {
      // Partially filled star
      const style = {
        width: `${partialStarPercentage}%`,
      };
      stars.push(
        <span key={i} className="star-partial">
          <span className="star-filled" style={style}>&#9733;</span>
          <span className="star-empty" style={{ flex: 1 }}>&#9733;</span>
        </span>,
      );
    } else {
      // Empty star
      stars.push(<span key={i} className="star-empty">&#9733;</span>);
    }
  }

  return (
    <div className="star-rating" style={style}>
      {stars}
    </div>
  );
}

export default StarRating;
