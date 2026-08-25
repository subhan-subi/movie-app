import React, { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getGenres,
  getMoviesByGenre,
  getPopularTVShows,
} from "../Service/api";
import { MovieCard } from "../components/MovieCard";
import { HeroSlider } from "../components/HeroSlider";
import { MovieSkeleton } from "../components/MovieSkeleton";

export function Home() {
  const [contentType, setContentType] = useState("movie"); // 'movie' or 'tv'
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data whenever contentType changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setSelectedGenre(null); // Reset active genre on mode change

      try {
        if (contentType === "movie") {
          const [trendData, popData, topData, genreList] = await Promise.all([
            getTrendingMovies(),
            getPopularMovies(),
            getTopRatedMovies(),
            getGenres(),
          ]);
          setTrending(trendData);
          setPopular(popData);
          setTopRated(topData);
          setGenres(genreList);
        } else {
          // TV Shows Data
          const [tvShows, genreList] = await Promise.all([
            getPopularTVShows(),
            getGenres(), // Note: TMDB provides TV genres, fallback works smoothly
          ]);
          // Standardize TV Show keys for compatibility with MovieCard
          const formattedTV = tvShows.map((show) => ({
            ...show,
            title: show.name, // TV shows use 'name' instead of 'title'
            release_date: show.first_air_date,
            isTV: true,
          }));

          setTrending(formattedTV);
          setPopular(formattedTV);
          setTopRated(formattedTV.slice().reverse()); // Mock top-rated list for TV
          setGenres(genreList);
        }
      } catch (err) {
        console.error("Failed to load home content", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [contentType]);

  // Handle Genre Filter Click
  const handleGenreClick = async (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      setGenreMovies([]);
      return;
    }
    setSelectedGenre(genreId);
    setLoading(true);

    if (contentType === "movie") {
      const movies = await getMoviesByGenre(genreId);
      setGenreMovies(movies);
    } else {
      // Filter local TV list if movie genre endpoint used
      const filtered = popular.filter((item) =>
        item.genre_ids?.includes(genreId)
      );
      setGenreMovies(filtered);
    }
    setLoading(false);
  };

  return (
    <div className="bg-dark text-white min-vh-100 pb-5">
      <div className="container py-3">
        
        {/* ================= Mode Toggle Switch ================= */}
        <div className="d-flex justify-content-center mb-4">
          <div
            className="p-1 rounded-pill bg-secondary bg-opacity-25 border border-secondary border-opacity-50 d-inline-flex gap-1"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <button
              className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${
                contentType === "movie"
                  ? "btn-warning text-dark shadow"
                  : "btn-link text-light text-decoration-none opacity-75"
              }`}
              onClick={() => setContentType("movie")}
            >
              🎬 Movies
            </button>
            <button
              className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${
                contentType === "tv"
                  ? "btn-danger text-white shadow"
                  : "btn-link text-light text-decoration-none opacity-75"
              }`}
              onClick={() => setContentType("tv")}
            >
              📺 TV Shows
            </button>
          </div>
        </div>

        {/* ================= Hero Slider ================= */}
        {!loading && trending.length > 0 && <HeroSlider movies={trending} />}

        {/* ================= Categories / Genre Pills ================= */}
        <div className="mb-5">
          <h5 className="fw-bold text-warning mb-3">
            🏷️ Browse {contentType === "movie" ? "Movie" : "TV"} Categories
          </h5>
          <div className="d-flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => handleGenreClick(null)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                selectedGenre === null
                  ? "btn-warning"
                  : "btn-outline-secondary text-light"
              }`}
            >
              All {contentType === "movie" ? "Movies" : "Shows"}
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                  selectedGenre === genre.id
                    ? "btn-warning"
                    : "btn-outline-secondary text-light"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= Content Grid / Skeleton Loaders ================= */}
        {loading ? (
          <div className="row g-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieSkeleton key={i} />
            ))}
          </div>
        ) : selectedGenre ? (
          /* Filtered View */
          <section className="mb-5">
            <h3 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
              Filtered Results
            </h3>
            <div className="row g-4">
              {genreMovies.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={{
                    ...item,
                    title: item.title || item.name,
                    media_type: contentType,
                  }}
                />
              ))}
            </div>
          </section>
        ) : (
          /* Main Sections */
          <>
            {/* Section 1: Popular */}
            <section className="mb-5">
              <h3 className="fw-bold border-start border-warning border-4 ps-3 mb-4">
                🔥 Popular {contentType === "movie" ? "Movies" : "TV Shows"}
              </h3>
              <div className="row g-4">
                {popular.slice(0, 8).map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={{
                      ...item,
                      title: item.title || item.name,
                      media_type: contentType,
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Section 2: Top Rated */}
            <section className="mb-5">
              <h3 className="fw-bold border-start border-warning border-4 ps-3 mb-4">
                ⭐ Top Rated {contentType === "movie" ? "Movies" : "TV Shows"}
              </h3>
              <div className="row g-4">
                {topRated.slice(0, 8).map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={{
                      ...item,
                      title: item.title || item.name,
                      media_type: contentType,
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}