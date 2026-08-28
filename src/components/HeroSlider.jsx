
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import "./HeroSlider.css";

export function HeroSlider({ movies }) {
  const {
    wishlist = [],
    addToWishlist,
    removetowishlist,
  } = useContext(WishlistContext);

  if (!movies || movies.length === 0) {
    return null;
  }

  const sliderMovies = movies.slice(0, 5);

  return (
    <section className="hero-slider-section">
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="6000"
      >
        {/* ================================================
            INDICATORS
        ================================================= */}

        <div className="hero-indicators carousel-indicators">
          {sliderMovies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span></span>
            </button>
          ))}
        </div>

        {/* ================================================
            SLIDES
        ================================================= */}

        <div className="carousel-inner">
          {sliderMovies.map((movie, index) => {
            const isTV =
              movie.media_type === "tv" ||
              movie.isTV ||
              !!movie.first_air_date;

            const title =
              movie.title ||
              movie.name ||
              "Untitled";

            const releaseDate =
              movie.release_date ||
              movie.first_air_date;

            const year = releaseDate
              ? releaseDate.split("-")[0]
              : "N/A";

            const rating = movie.vote_average
              ? movie.vote_average.toFixed(1)
              : "N/A";

            const backdrop = movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : movie.poster_path
                ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
                : "";

            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster";

            const routePath = isTV
              ? `/tv/${movie.id}`
              : `/movie/${movie.id}`;

            const isWishlisted = wishlist.some(
              (item) => item.id === movie.id
            );

            const handleWishlist = () => {
              if (isWishlisted) {
                removetowishlist(movie);
              } else {
                addToWishlist(movie);
              }
            };

            return (
              <div
                key={movie.id}
                className={`carousel-item ${
                  index === 0 ? "active" : ""
                }`}
              >
                {/* Background */}
                <div
                  className="hero-slide-background"
                  style={{
                    backgroundImage: backdrop
                      ? `url(${backdrop})`
                      : "none",
                  }}
                />

                {/* Cinematic overlays */}
                <div className="hero-overlay" />
                <div className="hero-overlay-bottom" />

                {/* ==========================================
                    CONTENT
                =========================================== */}

                <div className="container hero-container">
                  <div className="row align-items-center h-100">

                    {/* Main Content */}

                    <div className="col-12 col-lg-7 col-xl-6">
                      <div className="hero-content">

                        {/* Label */}

                        <div className="hero-label">
                          <span className="hero-label-dot"></span>

                          {isTV
                            ? "Trending TV Series"
                            : "Trending Movie"}

                          <span className="hero-rank">
                            #{index + 1}
                          </span>
                        </div>

                        {/* Title */}

                        <h1 className="hero-title">
                          {title}
                        </h1>

                        {/* Meta */}

                        <div className="hero-meta">

                          <span className="hero-rating">
                            <span>★</span>
                            {rating}
                          </span>

                          <span className="hero-meta-divider">
                            •
                          </span>

                          <span>{year}</span>

                          <span className="hero-meta-divider">
                            •
                          </span>

                          <span>
                            {isTV
                              ? "TV Series"
                              : "Movie"}
                          </span>

                        </div>

                        {/* Overview */}

                        <p className="hero-overview">
                          {movie.overview ||
                            "Discover this title and explore more details."}
                        </p>

                        {/* Buttons */}

                        <div className="hero-actions">

                          <Link
                            to={routePath}
                            className="hero-watch-btn"
                          >
                            <span className="hero-play-icon">
                              ▶
                            </span>

                            Watch Now
                          </Link>

                          <button
                            type="button"
                            onClick={handleWishlist}
                            className={`hero-wishlist-btn ${
                              isWishlisted
                                ? "is-wishlisted"
                                : ""
                            }`}
                          >
                            <span>
                              {isWishlisted
                                ? "♥"
                                : "♡"}
                            </span>

                            {isWishlisted
                              ? "In Wishlist"
                              : "Add to Wishlist"}
                          </button>

                        </div>

                        {/* Extra info */}

                        <div className="hero-discover">
                          <span className="hero-discover-line"></span>
                          <span>
                            Explore more details
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* ========================================
                        POSTER
                    ========================================= */}

                    <div className="col-lg-5 col-xl-4 offset-xl-1 d-none d-lg-flex justify-content-end">
                      <div className="hero-poster-wrapper">

                        <div className="hero-poster-glow"></div>

                        <img
                          src={poster}
                          alt={title}
                          className="hero-poster"
                        />

                        <div className="hero-poster-rating">
                          <span>★</span>
                          {rating}
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================
            PREVIOUS BUTTON
        ================================================= */}

        <button
          className="hero-control hero-control-prev carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
          aria-label="Previous slide"
        >
          <span className="hero-arrow">
            ‹
          </span>
        </button>

        {/* ================================================
            NEXT BUTTON
        ================================================= */}

        <button
          className="hero-control hero-control-next carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
          aria-label="Next slide"
        >
          <span className="hero-arrow">
            ›
          </span>
        </button>

      </div>
    </section>
  );
}

