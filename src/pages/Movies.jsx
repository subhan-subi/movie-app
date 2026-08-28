
import React, { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getGenres,
  getMoviesByGenre,
} from "../Service/api";

import { MovieCard } from "../components/MovieCard";
import { MovieSkeleton } from "../components/MovieSkeleton";

export function Movies() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);

        const [
          trendingData,
          popularData,
          topRatedData,
          genreData,
        ] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getGenres(),
        ]);

        setTrending(trendingData || []);
        setPopular(popularData || []);
        setTopRated(topRatedData || []);
        setGenres(genreData || []);
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const handleGenreClick = async (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      setGenreMovies([]);
      return;
    }

    setSelectedGenre(genreId);
    setGenreLoading(true);

    try {
      const movies = await getMoviesByGenre(genreId);
      setGenreMovies(movies || []);
    } catch (error) {
      console.error("Failed to load genre movies:", error);
      setGenreMovies([]);
    } finally {
      setGenreLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="movies-page">
        <div className="container py-5">
          <div className="page-heading mb-5">
            <span className="section-kicker">MOVIE COLLECTION</span>
            <h1>Discover Movies</h1>
            <p>
              Explore trending, popular and top-rated movies from around the
              world.
            </p>
          </div>

          <div className="row g-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="movies-page">
      {/* ================= PAGE HERO ================= */}
      <section className="movies-heading-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-kicker">🎬 MOVIE COLLECTION</span>

            <h1>
              Discover Your Next
              <span> Favorite Movie</span>
            </h1>

            <p>
              Browse thousands of movies, discover hidden gems and find
              something worth watching tonight.
            </p>

            <div className="heading-stats">
              <div>
                <strong>{popular.length}+</strong>
                <span>Popular</span>
              </div>

              <div>
                <strong>{topRated.length}+</strong>
                <span>Top Rated</span>
              </div>

              <div>
                <strong>{genres.length}</strong>
                <span>Genres</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GENRES ================= */}
      <section className="container py-4">
        <div className="content-section-header">
          <div>
            <span className="section-kicker">EXPLORE</span>
            <h2>Browse by Genre</h2>
          </div>
        </div>

        <div className="genre-list">
          <button
            onClick={() => {
              setSelectedGenre(null);
              setGenreMovies([]);
            }}
            className={`genre-btn ${
              selectedGenre === null ? "active" : ""
            }`}
          >
            All Movies
          </button>

          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`genre-btn ${
                selectedGenre === genre.id ? "active" : ""
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </section>

      {/* ================= FILTERED MOVIES ================= */}
      {selectedGenre !== null && (
        <section className="container py-4">
          <div className="content-section-header">
            <div>
              <span className="section-kicker">GENRE RESULTS</span>
              <h2>Movies You May Like</h2>
            </div>

            <button
              className="clear-filter-btn"
              onClick={() => {
                setSelectedGenre(null);
                setGenreMovies([]);
              }}
            >
              Clear Filter
            </button>
          </div>

          {genreLoading ? (
            <div className="row g-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <MovieSkeleton key={index} />
              ))}
            </div>
          ) : genreMovies.length > 0 ? (
            <div className="row g-4">
              {genreMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <div>🎬</div>
              <h3>No Movies Found</h3>
              <p>Try another genre.</p>
            </div>
          )}
        </section>
      )}

      {/* ================= NORMAL MOVIE SECTIONS ================= */}
      {selectedGenre === null && (
        <>
          {/* Trending */}
          <section className="container py-4">
            <div className="content-section-header">
              <div>
                <span className="section-kicker">HOT RIGHT NOW</span>
                <h2>Trending Movies</h2>
              </div>

              <span className="section-icon">🔥</span>
            </div>

            <div className="row g-4">
              {trending.slice(0, 8).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>

          {/* Popular */}
          <section className="container py-4">
            <div className="content-section-header">
              <div>
                <span className="section-kicker">MOST WATCHED</span>
                <h2>Popular Movies</h2>
              </div>

              <span className="section-icon">🍿</span>
            </div>

            <div className="row g-4">
              {popular.slice(0, 8).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>

          {/* Top Rated */}
          <section className="container py-4 pb-5">
            <div className="content-section-header">
              <div>
                <span className="section-kicker">HIGHEST RATED</span>
                <h2>Top Rated Movies</h2>
              </div>

              <span className="section-icon">⭐</span>
            </div>

            <div className="row g-4">
              {topRated.slice(0, 8).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    media_type: "movie",
                  }}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

