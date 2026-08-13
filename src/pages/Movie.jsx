import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getSimilarMovies,
  getMovieCredits,
  getMovieVideos,
  getMovieStreamUrl,
} from "../Service/api";
import { MovieCard } from "../components/MovieCard";
import { WishlistContext } from "../context/WishlistContext";

export function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const { wishlist = [], addToWishlist, removetowishlist } = useContext(WishlistContext);
const [selectedServer, setSelectedServer] = useState("vidsrc_xyz");
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Video Player Visibility
  const [isPlaying, setIsPlaying] = useState(false);

  // State for Language Switcher (Default: English)
  const [language, setLanguage] = useState("en-US");

  // Check if current movie is in wishlist
  const isWishlisted = wishlist.some((item) => item.id === movie?.id);

  const handleWishlistToggle = () => {
    if (!movie) return;
    if (isWishlisted) {
      removetowishlist(movie);
    } else {
      addToWishlist(movie);
    }
  };

  // Smooth scroll to Video Player when "Watch Movie" is clicked
  const handleWatchClick = () => {
    setIsPlaying(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    let isMounted = true;

    // Reset player state & scroll to top on movie ID or language change
    setIsPlaying(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch details, similar, credits, and videos concurrently with selected language
        const [detailsData, similarData, creditsData, videoData] = await Promise.all([
          getMovieDetails(id, language),
          getSimilarMovies(id, language),
          getMovieCredits(id, language),
          getMovieVideos(id, language),
        ]);

        if (isMounted) {
          if (detailsData) {
            setMovie(detailsData);
            setSimilarMovies(similarData || []);
            setCast(creditsData?.cast || []);

            // Find official YouTube Trailer
            const trailerVideo = videoData?.results?.find(
              (video) => video.type === "Trailer" && video.site === "YouTube"
            );
            setTrailer(trailerVideo || null);
          } else {
            setError("Movie details not found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch movie details. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [id, language]); // Dependency array updated with language

  // Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-warning" role="status" style={{ width: "3.5rem", height: "3.5rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !movie) {
    return (
      <div className="container py-5 text-center text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="alert alert-danger d-inline-block px-4 py-3 shadow-lg" role="alert">
          <h4 className="alert-heading fw-bold">Oops!</h4>
          <p className="mb-0">{error || "Something went wrong."}</p>
        </div>
        <div className="mt-3">
          <button className="btn btn-outline-warning fw-semibold px-4" onClick={() => navigate(-1)}>
            &larr; Go Back
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster+Available";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  return (
    <div className="bg-dark text-white min-vh-100 position-relative pb-5">
      {/* Dynamic Blurred Backdrop Banner */}
      {backdropUrl && (
        <div
          className="position-absolute w-100 top-0 start-0 opacity-25"
          style={{
            height: "500px",
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
          }}
        />
      )}

      {/* Main Details Container */}
      <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
        {/* Navigation Back Button & Language Switcher Dropdown */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-2 shadow-sm"
            onClick={() => navigate(-1)}
          >
            <span>&larr;</span> Back
          </button>

          {/* Language Selector Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small fw-bold d-none d-sm-inline">
              Language:
            </span>
            <select
              className="form-select form-select-sm bg-dark text-warning border-warning fw-semibold shadow-none"
              style={{ width: "auto", cursor: "pointer" }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Movie Language"
            >
              <option value="en-US">🌐 English</option>
              <option value="hi-IN">🇮🇳 Hindi (हिंदी)</option>
              <option value="es-ES">🇪🇸 Spanish (Español)</option>
              <option value="fr-FR">🇫🇷 French (Français)</option>
              <option value="de-DE">🇩🇪 German (Deutsch)</option>
              <option value="ja-JP">🇯🇵 Japanese (日本語)</option>
            </select>
          </div>
        </div>

        <div className="row g-4 align-items-center">
          {/* Poster Image */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <img
              src={posterUrl}
              alt={movie.title || "Movie Poster"}
              className="img-fluid rounded-3 shadow-lg border border-secondary border-opacity-25 w-100"
              style={{ maxHeight: "500px", objectFit: "cover", maxWidth: "350px" }}
            />
          </div>

          {/* Text Content */}
          <div className="col-12 col-md-8">
            <h1 className="fw-bold display-5 mb-2">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-secondary fs-5 fst-italic mb-3">
                "{movie.tagline}"
              </p>
            )}

            {/* Badges & Actions */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <span className="badge bg-warning text-dark fs-6 px-3 py-2 fw-semibold">
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
              </span>

              {movie.release_date && (
                <span className="text-light opacity-75">
                  📅 {new Date(movie.release_date).getFullYear()}
                </span>
              )}

              {movie.runtime > 0 && (
                <span className="text-light opacity-75">
                  ⏱️ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}

              {/* Watch Movie Button */}
              <button
                onClick={handleWatchClick}
                className="btn btn-warning btn-sm px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow"
              >
                ▶️ Watch Now
              </button>

              {/* Wishlist Toggle Button */}
              <button
                onClick={handleWishlistToggle}
                className={`btn btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                  isWishlisted ? "btn-danger" : "btn-outline-light"
                }`}
              >
                <span>{isWishlisted ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}</span>
              </button>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="badge bg-secondary bg-opacity-50 text-light border border-secondary border-opacity-50 px-3 py-2 rounded-pill"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-4">
              <h5 className="fw-bold text-warning mb-2">Overview</h5>
              <p className="lh-lg text-light opacity-90 fs-6">
                {movie.overview || "No description available for this movie in the selected language."}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="row g-3 pt-3 border-top border-secondary border-opacity-25 text-secondary fs-6">
              {movie.status && (
                <div className="col-6 col-sm-4">
                  <strong className="text-white d-block">Status</strong>
                  {movie.status}
                </div>
              )}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div className="col-6 col-sm-4">
                  <strong className="text-white d-block">Language</strong>
                  {movie.spoken_languages[0]?.english_name || "N/A"}
                </div>
              )}
              {movie.budget > 0 && (
                <div className="col-6 col-sm-4">
                  <strong className="text-white d-block">Budget</strong>
                  ${movie.budget.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Stream Player Section */}
    <div ref={playerRef} className="container py-4">
  {isPlaying ? (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 className="fw-bold border-start border-warning border-4 ps-3 mb-0">
          🍿 Streaming Movie
        </h3>

        {/* Server Switcher Buttons */}
       {/* const [selectedServer, setSelectedServer] = useState("vidsrc_xyz"); */}

// Server Switcher Buttons:
<div className="d-flex align-items-center gap-2 flex-wrap">
  <span className="small text-secondary fw-semibold">Server:</span>
  <button
    className={`btn btn-sm ${selectedServer === 'vidsrc_xyz' ? 'btn-warning' : 'btn-outline-light'}`}
    onClick={() => setSelectedServer('vidsrc_xyz')}
  >
    Server 1 (VidSrc)
  </button>
  <button
    className={`btn btn-sm ${selectedServer === 'vidlink' ? 'btn-warning' : 'btn-outline-light'}`}
    onClick={() => setSelectedServer('vidlink')}
  >
    Server 2 (VidLink)
  </button>
  <button
    className={`btn btn-sm ${selectedServer === 'vidsrc_pro' ? 'btn-warning' : 'btn-outline-light'}`}
    onClick={() => setSelectedServer('vidsrc_pro')}
  >
    Server 3 (Pro)
  </button>
  <button
    className={`btn btn-sm ${selectedServer === 'embed2' ? 'btn-warning' : 'btn-outline-light'}`}
    onClick={() => setSelectedServer('embed2')}
  >
    Server 4 (2Embed)
  </button>
</div>
      </div>

      {/* Clean Iframe (Without Sandbox) */}
      <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg bg-black border border-secondary border-opacity-25">
        <iframe
          src={getMovieStreamUrl(id, selectedServer)}
          title={movie.title || "Movie Stream Player"}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{ border: 0, width: "100%", height: "100%" }}
        ></iframe>
      </div>
    </div>
  ) : (
    <div className="text-center p-4 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
      <h5 className="text-light mb-3">Ready to watch this movie?</h5>
      <button
        onClick={handleWatchClick}
        className="btn btn-warning px-4 py-2 fw-bold"
      >
        ▶️ Start Playing
      </button>
    </div>
  )}
</div>

      {/* Official Trailer Section */}
      {trailer && (
        <div className="container py-4">
          <h3 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
            🎬 Official Trailer
          </h3>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg border border-secondary border-opacity-25">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} Trailer`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Cast Section */}
      {cast.length > 0 && (
        <div className="container py-4">
          <h3 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
            🎭 Top Cast
          </h3>
          <div className="row g-3">
            {cast.slice(0, 6).map((actor) => (
              <div key={actor.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div className="card bg-secondary bg-opacity-25 border-0 text-white h-100 rounded-3 overflow-hidden shadow-sm">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300?text=No+Photo"
                    }
                    alt={actor.name}
                    className="card-img-top object-fit-cover"
                    style={{ height: "220px" }}
                    loading="lazy"
                  />
                  <div className="card-body p-2 text-center">
                    <h6 className="fw-bold text-truncate mb-1">{actor.name}</h6>
                    <p className="text-warning small text-truncate mb-0">
                      {actor.character || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="container py-4">
          <h3 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
            📽️ Similar Movies
          </h3>
          <div className="row g-4">
            {similarMovies.slice(0, 8).map((simMovie) => (
              <MovieCard key={simMovie.id} movie={simMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}