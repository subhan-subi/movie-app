import React, { useEffect, useState } from "react";
import {
getPopularMovies,
getNowPlayingMovies,
getTopRatedMovies,
getUpcomingMovies,
getGenres,
getMoviesByGenre,
} from "../Service/api";

import { MovieCard } from "../components/MovieCard";
import { MovieSkeleton } from "../components/MovieSkeleton";
import "./Movies.css";

export function Movies() {
const [activeCategory, setActiveCategory] = useState("popular");

const [movies, setMovies] = useState([]);
const [genres, setGenres] = useState([]);

const [selectedGenre, setSelectedGenre] = useState(null);

const [loading, setLoading] = useState(true);
const [genreLoading, setGenreLoading] = useState(false);

// ==============================
// Fetch Genres
// ==============================
useEffect(() => {
async function loadGenres() {
try {
const genreData = await getGenres();
setGenres(genreData || []);
} catch (error) {
console.error("Failed to load genres:", error);
}
}

loadGenres();


}, []);

// ==============================
// Fetch Movies By Category
// ==============================
useEffect(() => {
async function loadMovies() {
try {
setLoading(true);
setSelectedGenre(null);


    let data = [];

    switch (activeCategory) {
      case "popular":
        data = await getPopularMovies();
        break;

      case "now_playing":
        data = await getNowPlayingMovies();
        break;

      case "top_rated":
        data = await getTopRatedMovies();
        break;

      case "upcoming":
        data = await getUpcomingMovies();
        break;

      default:
        data = await getPopularMovies();
    }

    setMovies(data || []);
  } catch (error) {
    console.error("Failed to load movies:", error);
    setMovies([]);
  } finally {
    setLoading(false);
  }
}

loadMovies();


}, [activeCategory]);

// ==============================
// Genre Filter
// ==============================
const handleGenreClick = async (genreId) => {
if (genreId === null) {
setSelectedGenre(null);
return;
}


if (selectedGenre === genreId) {
  setSelectedGenre(null);
  return;
}

try {
  setSelectedGenre(genreId);
  setGenreLoading(true);

  const genreMovies = await getMoviesByGenre(genreId);

  setMovies(genreMovies || []);
} catch (error) {
  console.error("Failed to filter movies:", error);
} finally {
  setGenreLoading(false);
}


};

// ==============================
// Categories
// ==============================
const categories = [
{
id: "popular",
label: "Popular",
icon: "🔥",
},
{
id: "now_playing",
label: "Now Playing",
icon: "🎬",
},
{
id: "top_rated",
label: "Top Rated",
icon: "⭐",
},
{
id: "upcoming",
label: "Upcoming",
icon: "📅",
},
];

const activeTitle =
categories.find((category) => category.id === activeCategory)?.label ||
"Movies";


return ( <main className="movies-page">
{/* ================= HERO ================= */} <section className="movies-hero"> <div className="movies-hero-glow glow-one"></div> <div className="movies-hero-glow glow-two"></div>


    <div className="container position-relative">
      <div className="movies-hero-content">
        <span className="movies-kicker">
          <span>🎬</span>
          MOVIE COLLECTION
        </span>

        <h1>
          Discover Your Next
          <span> Favorite Movie</span>
        </h1>

        <p>
          Explore the latest blockbusters, timeless classics and
          highly-rated movies from around the world.
        </p>

        <div className="movies-hero-stats">
          <div className="hero-stat">
            <strong>{movies.length}+</strong>
            <span>Movies</span>
          </div>

          <div className="hero-stat">
            <strong>{genres.length}</strong>
            <span>Genres</span>
          </div>

          <div className="hero-stat">
            <strong>4K</strong>
            <span>Experience</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ================= CATEGORY SECTION ================= */}
  <section className="movies-filter-section">
    <div className="container">
      <div className="movies-section-header">
        <div>
          <span className="movies-kicker small-kicker">
            EXPLORE MOVIES
          </span>

          <h2>Choose Your Collection</h2>

          <p>
            Browse movies based on what you're in the mood for.
          </p>
        </div>

        <div className="movies-header-icon">🎞️</div>
      </div>

      <div className="movie-category-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`movie-category-btn ${
              activeCategory === category.id ? "active" : ""
            }`}
          >
            <span className="category-icon">
              {category.icon}
            </span>

            {category.label}
          </button>
        ))}
      </div>
    </div>
  </section>

  {/* ================= GENRES ================= */}
  <section className="movies-genre-section">
    <div className="container">
      <div className="movies-section-header genre-header">
        <div>
          <span className="movies-kicker small-kicker">
            FIND YOUR STYLE
          </span>

          <h2>Browse by Genre</h2>

          <p>
            Select your favorite genre and discover movies made for you.
          </p>
        </div>
      </div>

      <div className="genre-list">
        <button
          onClick={() => setSelectedGenre(null)}
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
    </div>
  </section>

  {/* ================= MOVIES GRID ================= */}
  <section className="movies-grid-section">
    <div className="container">
      <div className="movies-result-header">
        <div>
          <span className="movies-kicker small-kicker">
            {selectedGenre
              ? "FILTERED COLLECTION"
              : "NOW SHOWING"}
          </span>

          <h2>
            {selectedGenre
              ? genres.find(
                  (genre) => genre.id === selectedGenre
                )?.name
              : activeTitle}
          </h2>

          <p>
            {selectedGenre
              ? "Movies from your selected genre"
              : "Discover hand-picked movies for your next watch."}
          </p>
        </div>

        <div className="movie-count-badge">
          <strong>{movies.length}</strong>
          <span>Movies</span>
        </div>
      </div>

      {loading || genreLoading ? (
        <div className="row g-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <MovieSkeleton key={index} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="row g-4">
          {movies.map((movie) => (
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
        <div className="premium-empty-state">
          <div className="empty-icon">🎬</div>

          <h3>No Movies Found</h3>

          <p>
            We couldn't find anything here. Try another category or genre.
          </p>

          <button
            onClick={() => setSelectedGenre(null)}
            className="empty-reset-btn"
          >
            Explore All Movies
          </button>
        </div>
      )}
    </div>
  </section>
</main>


);
}
