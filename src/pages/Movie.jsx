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
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const isWishlisted = wishlist.some((item) => item.id === movie?.id);

  const handleWishlistToggle = () => {
    if (!movie) return;
    if (isWishlisted) removetowishlist(movie);
    else addToWishlist(movie);
  };

  const handleWatchClick = () => {
    setIsPlaying(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    let isMounted = true;
    setIsPlaying(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);

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

            const trailerVideo = videoData?.results?.find(
              (video) => video.type === "Trailer" && video.site === "YouTube"
            );
            setTrailer(trailerVideo || null);
          } else {
            setError("Movie details not found.");
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to fetch movie details. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAllData();
    return () => { isMounted = false; };
  }, [id, language]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="alert alert-danger px-4 py-3 shadow-lg" role="alert">
          <h4 className="alert-heading fw-bold">Oops!</h4>
          <p className="mb-0">{error || "Something went wrong."}</p>
        </div>
        <button className="btn btn-outline-warning fw-semibold px-4 mt-3" onClick={() => navigate(-1)}>
          &larr; Go Back
        </button>
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
      {backdropUrl && (
        <div
          className="position-absolute w-100 top-0 start-0 opacity-25"
          style={{
            height: "550px",
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
          }}
        />
      )}

      <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-sm btn-outline-light rounded-pill px-3 shadow-sm" onClick={() => navigate(-1)}>
            &larr; Back
          </button>

          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small fw-bold d-none d-sm-inline">Language:</span>
            <select
              className="form-select form-select-sm bg-dark text-warning border-warning fw-semibold rounded-pill"
              style={{ width: "auto", cursor: "pointer" }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
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
          <div className="col-12 col-md-4 text-center text-md-start">
            <img
              src={posterUrl}
              alt={movie.title || "Movie Poster"}
              className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25 w-100"
              style={{ maxHeight: "480px", objectFit: "cover", maxWidth: "340px" }}
            />
          </div>

          <div className="col-12 col-md-8">
            <h1 className="fw-bold display-5 mb-2">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-warning fs-5 fst-italic mb-3">"{movie.tagline}"</p>
            )}

            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <span className="badge bg-warning text-dark fs-6 px-3 py-2 fw-semibold rounded-pill">
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
              </span>
              {movie.release_date && <span className="text-light opacity-75">📅 {new Date(movie.release_date).getFullYear()}</span>}
              {movie.runtime > 0 && <span className="text-light opacity-75">⏱️ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}

              <button onClick={handleWatchClick} className="btn btn-warning btn-sm px-4 py-2 fw-bold rounded-pill shadow">
                ▶️ Watch Now
              </button>
              <button onClick={handleWishlistToggle} className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill ${isWishlisted ? "btn-danger" : "btn-outline-light"}`}>
                {isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
              </button>
            </div>

            {movie.genres?.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="badge bg-secondary bg-opacity-50 text-light border border-secondary border-opacity-50 px-3 py-2 rounded-pill">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-4">
              <h5 className="fw-bold text-warning mb-2">Overview</h5>
              <p className="lh-lg text-light opacity-90 fs-6">{movie.overview || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Streaming Player Section */}
      <div ref={playerRef} className="container py-4">
        {isPlaying ? (
          <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
              <h4 className="fw-bold border-start border-warning border-4 ps-3 mb-0">🍿 Streaming Player</h4>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="small text-secondary fw-semibold">Server:</span>
                {[
                  { id: "vidsrc_xyz", label: "Server 1 (VidSrc)" },
                  { id: "vidlink", label: "Server 2 (VidLink)" },
                  { id: "vidsrc_pro", label: "Server 3 (Pro)" },
                  { id: "embed2", label: "Server 4 (2Embed)" },
                ].map((srv) => (
                  <button
                    key={srv.id}
                    className={`btn btn-sm rounded-pill ${selectedServer === srv.id ? "btn-warning fw-bold" : "btn-outline-light"}`}
                    onClick={() => setSelectedServer(srv.id)}
                  >
                    {srv.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg bg-black border border-secondary border-opacity-25">
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
          <div className="text-center p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25">
            <h5 className="text-light mb-3">Ready to stream this movie?</h5>
            <button onClick={handleWatchClick} className="btn btn-warning px-4 py-2 fw-bold rounded-pill">
              ▶️ Start Playing
            </button>
          </div>
        )}
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="container py-4">
          <h4 className="fw-bold mb-4 border-start border-warning border-4 ps-3">🎭 Top Cast</h4>
          <div className="row g-3">
            {cast.slice(0, 6).map((actor) => (
              <div key={actor.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div className="card bg-secondary bg-opacity-25 border-0 text-white h-100 rounded-4 overflow-hidden shadow-sm">
                  <img
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/200x300?text=No+Photo"}
                    alt={actor.name}
                    className="card-img-top object-fit-cover"
                    style={{ height: "200px" }}
                    loading="lazy"
                  />
                  <div className="card-body p-2 text-center">
                    <h6 className="fw-bold text-truncate mb-1">{actor.name}</h6>
                    <p className="text-warning small text-truncate mb-0">{actor.character || "N/A"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container py-4">
          <h4 className="fw-bold mb-4 border-start border-warning border-4 ps-3">📽️ Similar Movies</h4>
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