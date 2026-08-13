import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";

export function MovieCard({ movie }) {
  const { wishlist = [], addToWishlist, removetowishlist } = useContext(WishlistContext);

  // Check karo ki movie wishlist me pehle se hai ya nahi
  const isWishlisted = wishlist.some((item) => item.id === movie.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removetowishlist(movie); // Aapka exact function call
    } else {
      addToWishlist(movie);
    }
  };

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden movie-card">
        
        {/* Movie Poster + Floating Heart Button */}
        <div className="position-relative overflow-hidden">
          <img
            src={posterUrl}
            alt={movie?.title || "Movie Poster"}
            className="card-img-top w-100 object-fit-cover"
            style={{ height: "380px", transition: "transform 0.3s ease" }}
            loading="lazy"
          />

          {/* Heart Icon Button jo Add/Remove dono handle karega */}
          <button
            onClick={handleWishlistToggle}
            className={`btn btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow ${
              isWishlisted ? "btn-danger" : "btn-light"
            }`}
            style={{ width: "38px", height: "38px", zIndex: 2 }}
            aria-label="Toggle Wishlist"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Card Content */}
        <div className="card-body d-flex flex-column justify-content-between p-3">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title fw-bold text-truncate mb-0" style={{ maxWidth: "70%" }}>
                {movie?.title}
              </h5>
              <span className="badge bg-warning text-dark fw-semibold">
                ⭐ {movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>

            <p className="card-text text-muted small">
              {movie?.overview
                ? movie.overview.length > 85
                  ? `${movie.overview.slice(0, 85)}...`
                  : movie.overview
                : "No description available."}
            </p>
          </div>

          {/* Details Button */}
          <div className="mt-3">
            <Link to={`/movie/${movie?.id}`} className="btn btn-primary w-100 fw-semibold">
              View Details
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}