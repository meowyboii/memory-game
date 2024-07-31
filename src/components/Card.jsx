/* eslint-disable react/prop-types */
import "./Card.css";
export const Card = ({ title, poster, handleClick }) => {
  return (
    <button className="card" onClick={handleClick}>
      <div className="card-image">
        <img src={poster} alt={title + " Poster"} />
      </div>
      <h2>{title}</h2>
    </button>
  );
};
