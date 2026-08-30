import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieStreamUrl,
  getMovieVideos,
  getSimilarMovies,
} from "../Service/api";
import { MovieCard } from "../components/MovieCard";
import { WishlistContext } from "../context/WishlistContext";
import "./Movie.css";

export function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const {
    wishlist = [],
    addToWishlist,
    removetowishlist,
  } = useContext(WishlistContext);

  const [selectedServer, setSelectedServer] = useState("vidsrc_xyz");
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const isWishlisted = wishlist.some((item) => item.id === movie?.id);

  const handleWishlistToggle = () => {
    if (!movie) return;

    if (isWishlisted) {
      removetowishlist(movie);
    } else {
      addToWishlist(movie);
    }
  };

  const handleWatchClick = () => {
    setIsPlaying(true);

    setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  useEffect(() => {
    let isMounted = true;

    setIsPlaying(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);

        const [detailsData, similarData, creditsData, videoData] =
          await Promise.all([
            getMovieDetails(id, language),
            getSimilarMovies(id, language),
            getMovieCredits(id, language),
            getMovieVideos(id, language),
          ]);

        if (!isMounted) return;

        if (!detailsData) {
          setError("Movie details not found.");
          return;
        }

        setMovie(detailsData);
        setSimilarMovies(similarData || []);
        setCast(creditsData?.cast || []);

        const trailerVideo = videoData?.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        setTrailer(trailerVideo || null);
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch movie details. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [id, language]);

  if (loading) {
    return (
      <main className="movie-details-page movie-details-loading">
        <div className="loading-content">
          <div className="movie-loading-spinner"></div>
          <h4>Loading Movie</h4>
          <p>Preparing your cinematic experience...</p>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="movie-details-page movie-error-page">
        <div className="movie-error-box">
          <div className="movie-error-icon">🎬</div>
          <h2>Oops! Movie Not Found</h2>
          <p>{error || "Something went wrong while loading this movie."}</p>
          <button className="movie-back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster+Available";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";

  return (
    <main className="movie-details-page">
      {backdropUrl && (
        <div
          className="movie-backdrop"
          style={{
            backgroundImage: `url(${backdropUrl})`,
          }}
        ></div>
      )}

      <div className="movie-backdrop-overlay"></div>

      <div className="container position-relative movie-details-container">
        {/* TOP BAR */}
        <div className="movie-topbar">
          <button className="movie-back-btn" onClick={() => navigate(-1)}>
            <span>←</span>
            <span>Back</span>
          </button>

          <div className="movie-language-control">
            <span className="language-label">🌐 Language</span>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="movie-language-select"
            >
              <option value="en-US">🇺🇸 English</option>
              <option value="hi-IN">🇮🇳 Hindi</option>
              <option value="es-ES">🇪🇸 Spanish</option>
              <option value="fr-FR">🇫🇷 French</option>
              <option value="de-DE">🇩🇪 German</option>
              <option value="ja-JP">🇯🇵 Japanese</option>
            </select>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="movie-hero">
          <div className="row g-5 align-items-center">
            {/* POSTER */}
            <div className="col-12 col-lg-4">
              <div className="movie-poster-wrapper">
                <img
                  src={posterUrl}
                  alt={movie.title || "Movie Poster"}
                  className="movie-main-poster"
                />

                <div className="poster-rating">
                  ⭐{" "}
                  {movie.vote_average
                    ? movie.vote_average.toFixed(1)
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* MOVIE INFORMATION */}
            <div className="col-12 col-lg-8">
              <div className="movie-info">
                <span className="movie-content-badge">🎬 MOVIE</span>

                <h1 className="movie-main-title">{movie.title}</h1>

                {movie.tagline && (
                  <p className="movie-tagline">“{movie.tagline}”</p>
                )}

                {/* META */}
                <div className="movie-meta">
                  <span>
                    ⭐{" "}
                    {movie.vote_average
                      ? movie.vote_average.toFixed(1)
                      : "N/A"}
                    /10
                  </span>

                  <span className="meta-dot">•</span>

                  <span>📅 {releaseYear}</span>

                  <span className="meta-dot">•</span>

                  <span>⏱️ {runtime}</span>
                </div>

                {/* GENRES */}
                {movie.genres?.length > 0 && (
                  <div className="movie-genres">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="movie-genre-pill">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* OVERVIEW */}
                <div className="movie-overview">
                  <h3>About This Movie</h3>

                  <p>
                    {movie.overview ||
                      "No description available for this movie."}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="movie-actions">
                  <button
                    className="movie-watch-btn"
                    onClick={handleWatchClick}
                  >
                    <span>▶</span>
                    Watch Now
                  </button>

                  <button
                    className={`movie-wishlist-btn ${
                      isWishlisted ? "wishlisted" : ""
                    }`}
                    onClick={handleWishlistToggle}
                  >
                    <span>{isWishlisted ? "❤️" : "🤍"}</span>
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </button>

                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noreferrer"
                      className="movie-trailer-btn"
                    >
                      <span>▶</span>
                      Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STREAMING PLAYER */}
        <section ref={playerRef} className="movie-player-section">
          <div className="movie-section-heading">
            <div>
              <span className="movie-section-kicker">WATCH NOW</span>

              <h2>Streaming Player</h2>
            </div>

            <span className="movie-section-icon">🍿</span>
          </div>

          {isPlaying ? (
            <div className="movie-player-wrapper">
              {/* PLAYER HEADER */}
              <div className="movie-player-header">
                <div>
                  <h4>▶ Now Playing</h4>

                  <p>{movie.title}</p>
                </div>

                <button
                  className="player-close-btn"
                  onClick={() => setIsPlaying(false)}
                >
                  ✕
                </button>
              </div>

              {/* SERVER BUTTONS */}
              <div className="movie-server-bar">
                <span className="server-label">Servers</span>

                {[
                  {
                    id: "vidsrc_xyz",
                    label: "Server 1",
                  },
                  {
                    id: "vidlink",
                    label: "Server 2",
                  },
                  {
                    id: "vidsrc_pro",
                    label: "Server 3",
                  },
                  {
                    id: "embed2",
                    label: "Server 4",
                  },
                ].map((server) => (
                  <button
                    key={server.id}
                    onClick={() => setSelectedServer(server.id)}
                    className={`movie-server-btn ${
                      selectedServer === server.id ? "active" : ""
                    }`}
                  >
                    {server.label}
                  </button>
                ))}
              </div>

              {/* IFRAME */}
              <div className="movie-video-container">
                <iframe
                  src={getMovieStreamUrl(id, selectedServer)}
                  title={movie.title || "Movie Streaming Player"}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="movie-video-frame"
                ></iframe>
              </div>

              <div className="movie-player-note">
                <span>ℹ️</span>

                <p>
                  If the current server is not working, try another server
                  above.
                </p>
              </div>
            </div>
          ) : (
            <div className="movie-player-placeholder">
              <div className="player-placeholder-icon">▶</div>

              <h3>Ready to Watch?</h3>

              <p>Start streaming {movie.title} now.</p>

              <button
                className="movie-watch-btn"
                onClick={handleWatchClick}
              >
                ▶ Start Watching
              </button>
            </div>
          )}
        </section>

        {/* CAST */}
        {cast.length > 0 && (
          <section className="movie-cast-section">
            <div className="movie-section-heading">
              <div>
                <span className="movie-section-kicker">CAST & CREW</span>

                <h2>Top Cast</h2>
              </div>

              <span className="movie-section-icon">🎭</span>
            </div>

            <div className="row g-4">
              {cast.slice(0, 8).map((actor) => (
                <div
                  key={actor.id}
                  className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2"
                >
                  <div className="movie-cast-card">
                    <div className="movie-cast-image-wrapper">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                            : "https://via.placeholder.com/300x450?text=No+Photo"
                        }
                        alt={actor.name}
                        className="movie-cast-image"
                        loading="lazy"
                      />
                    </div>

                    <div className="movie-cast-content">
                      <h5>{actor.name}</h5>

                      <p>{actor.character || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SIMILAR MOVIES */}
        {similarMovies.length > 0 && (
          <section className="movie-similar-section">
            <div className="movie-section-heading">
              <div>
                <span className="movie-section-kicker">YOU MAY ALSO LIKE</span>

                <h2>Similar Movies</h2>
              </div>

              <span className="movie-section-icon">🎞️</span>
            </div>

            <div className="row g-4">
              {similarMovies.slice(0, 8).map((simMovie) => (
                <MovieCard
                  key={simMovie.id}
                  movie={{
                    ...simMovie,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}