import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";

export function HeroSlider({ movies }) {
  const { wishlist = [], addToWishlist, removetowishlist } = useContext(WishlistContext);

  if (!movies || movies.length === 0) return null;

  const sliderMovies = movies.slice(0, 5); // Pehli 5 trending movies for slider

  return (
    <div id="heroCarousel" className="carousel slide carousel-fade mb-5" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {sliderMovies.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25">
        {sliderMovies.map((movie, index) => {
          const isWishlisted = wishlist.some((item) => item.id === movie.id);
          const backdrop = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

          return (
            <div
              key={movie.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              style={{
                height: "500px",
                backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 20%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.8) 100%), url(${backdrop})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="container h-100 d-flex align-items-center">
                <div className="col-12 col-md-8 col-lg-6 text-white p-4">
                  <span className="badge bg-warning text-dark fw-bold mb-2 px-3 py-2">
                    🔥 Trending #{index + 1}
                  </span>
                  <h1 className="fw-bold display-4 mb-2 text-truncate" title={movie.title}>
                    {movie.title}
                  </h1>
                  <p className="text-warning mb-2 fw-semibold">
                    ⭐ {movie.vote_average?.toFixed(1)} / 10 | 📅 {movie.release_date?.split("-")[0]}
                  </p>
                  <p className="line-clamp-2 text-light opacity-75 mb-4">
                    {movie.overview}
                  </p>

                  <div className="d-flex gap-3">
                    <Link
                      to={`/movie/${movie.id}`}
                      className="btn btn-warning px-4 py-2 fw-bold rounded-pill shadow"
                    >
                      ▶️ Watch Now
                    </Link>
                    <button
                      onClick={() =>
                        isWishlisted ? removetowishlist(movie) : addToWishlist(movie)
                      }
                      className={`btn px-4 py-2 fw-semibold rounded-pill ${
                        isWishlisted ? "btn-danger" : "btn-outline-light"
                      }`}
                    >
                      {isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
}