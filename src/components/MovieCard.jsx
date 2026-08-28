
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import "./MovieCard.css"; 
export function MovieCard({ movie }) {
  const { wishlist = [], addToWishlist, removetowishlist } =
    useContext(WishlistContext);

  if (!movie) return null;

  const isTV = movie.media_type === "tv" || movie.isTV;
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.split("-")[0] : "N/A";

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";

  const isWishlisted = wishlist.some((item) => item.id === movie.id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750/111827/94a3b8?text=No+Poster";

  const routePath = isTV
    ? `/tv/${movie.id}`
    : `/movie/${movie.id}`;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removetowishlist(movie);
    } else {
      addToWishlist(movie);
    }
  };

  return (
    <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4">
      <article className="movie-card">

        {/* Poster */}
        <div className="movie-card-poster">

          <Link to={routePath} className="movie-card-image-link">
            <img
              src={posterUrl}
              alt={title}
              className="movie-card-image"
              loading="lazy"
            />

            {/* Image Overlay */}
            <div className="movie-card-overlay">
              <span className="movie-card-play">
                <span>▶</span>
              </span>

              <span className="movie-card-view-text">
                View Details
              </span>
            </div>
          </Link>

          {/* Top Badges */}
          <div className="movie-card-top">

            <span
              className={`movie-type-badge ${
                isTV ? "movie-type-tv" : "movie-type-movie"
              }`}
            >
              {isTV ? "📺 TV" : "🎬 Movie"}
            </span>

            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`movie-wishlist-btn ${
                isWishlisted ? "is-wishlisted" : ""
              }`}
              aria-label={
                isWishlisted
                  ? `Remove ${title} from wishlist`
                  : `Add ${title} to wishlist`
              }
              title={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <span>{isWishlisted ? "♥" : "♡"}</span>
            </button>
          </div>

          {/* Rating */}
          <div className="movie-rating">
            <span className="movie-rating-star">★</span>
            <span>{rating}</span>
          </div>

          {/* Year */}
          <div className="movie-year">
            {year}
          </div>
        </div>

        {/* Card Content */}
        <div className="movie-card-content">

          <Link to={routePath} className="movie-card-title-link">
            <h5
              className="movie-card-title"
              title={title}
            >
              {title}
            </h5>
          </Link>

          <p className="movie-card-description">
            {movie.overview || "No description available for this title."}
          </p>

          {/* Bottom */}
          <div className="movie-card-bottom">

            <div className="movie-card-meta">
              <span>
                {isTV ? "Series" : "Movie"}
              </span>

              <span className="meta-dot">•</span>

              <span>
                {year}
              </span>
            </div>

            <Link
              to={routePath}
              className="movie-details-btn"
            >
              Details
              <span>→</span>
            </Link>

          </div>
        </div>
      </article>
    </div>
  );
}

