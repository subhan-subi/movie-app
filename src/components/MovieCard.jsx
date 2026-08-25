import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";

export function MovieCard({ movie }) {
  const { wishlist = [], addToWishlist, removetowishlist } = useContext(WishlistContext);
  const isWishlisted = wishlist.some((item) => item.id === movie.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removetowishlist(movie);
    } else {
      addToWishlist(movie);
    }
  };

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

      const routePath = movie.media_type === "tv" || movie.isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 bg-dark text-white shadow border border-secondary border-opacity-25 rounded-4 overflow-hidden position-relative group-hover">
        
        {/* Floating Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`btn btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow ${
            isWishlisted ? "btn-danger text-white" : "btn-dark bg-opacity-75 text-white"
          }`}
          style={{ width: "36px", height: "36px", zIndex: 3 }}
          aria-label="Toggle Wishlist"
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

        {/* Poster Image */}
        <div className="position-relative overflow-hidden">
          <img
            src={posterUrl}
            alt={movie?.title || "Movie Poster"}
            className="card-img-top w-100 object-fit-cover"
            style={{ height: "360px", transition: "transform 0.4s ease" }}
            loading="lazy"
          />
          <div className="position-absolute bottom-0 start-0 m-3">
            <span className="badge bg-warning text-dark fw-bold shadow-sm px-2 py-1">
              ⭐ {movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="card-body d-flex flex-column justify-content-between p-3">
          <div>
            <h6 className="card-title fw-bold text-truncate mb-2" title={movie?.title}>
              {movie?.title}
            </h6>
            <p className="card-text text-secondary small line-clamp-2" style={{ height: "38px", overflow: "hidden" }}>
              {movie?.overview || "No description available."}
            </p>
          </div>

          <div className="mt-3">
        

<Link to={routePath} className="btn btn-outline-warning w-100 fw-semibold btn-sm rounded-pill">
  View Details
</Link>
          </div>
        </div>
      </div>
    </div>
  );
}