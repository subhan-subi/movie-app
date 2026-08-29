import React, { useEffect, useState } from "react";
import { getPopularTVShows, getGenres } from "../Service/api";
import { MovieCard } from "../components/MovieCard";
import { MovieSkeleton } from "../components/MovieSkeleton";
import "./Movies.css";

export function TVShows() {
const [shows, setShows] = useState([]);
const [genres, setGenres] = useState([]);
const [selectedGenre, setSelectedGenre] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadTVShows() {
try {
setLoading(true);


    const [showsData, genreData] = await Promise.all([
      getPopularTVShows(),
      getGenres(),
    ]);

    const formattedShows = (showsData || []).map((show) => ({
      ...show,
      title: show.name,
      release_date: show.first_air_date,
      media_type: "tv",
      isTV: true,
    }));

    setShows(formattedShows);
    setGenres(genreData || []);
  } catch (error) {
    console.error("Failed to load TV shows:", error);
  } finally {
    setLoading(false);
  }
}

loadTVShows();


}, []);

const filteredShows =
selectedGenre === null
? shows
: shows.filter((show) =>
show.genre_ids?.includes(selectedGenre)
);

if (loading) {
return ( <main className="tv-page"> <section className="tv-hero"> <div className="container"> <div className="tv-loading-heading"> <span className="movies-kicker">
📺 TV COLLECTION </span>


          <h1>
            Discover Amazing
            <span> TV Shows</span>
          </h1>

          <p>
            Loading your next binge-worthy experience...
          </p>
        </div>
      </div>
    </section>

    <section className="tv-grid-section">
      <div className="container">
        <div className="row g-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <MovieSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  </main>
);


}

return ( <main className="tv-page">
{/* ================= HERO ================= */} <section className="tv-hero"> <div className="tv-hero-glow tv-glow-one"></div> <div className="tv-hero-glow tv-glow-two"></div>


    <div className="container position-relative">
      <div className="tv-hero-content">
        <span className="movies-kicker">
          <span>📺</span>
          TV COLLECTION
        </span>

        <h1>
          Binge Your Next
          <span> Favorite Series</span>
        </h1>

        <p>
          Discover addictive stories, unforgettable characters and
          popular TV series from around the world.
        </p>

        <div className="movies-hero-stats">
          <div className="hero-stat">
            <strong>{shows.length}+</strong>
            <span>Shows</span>
          </div>

          <div className="hero-stat">
            <strong>{genres.length}</strong>
            <span>Genres</span>
          </div>

          <div className="hero-stat">
            <strong>24/7</strong>
            <span>Entertainment</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ================= GENRES ================= */}
  <section className="tv-genre-section">
    <div className="container">
      <div className="movies-section-header">
        <div>
          <span className="movies-kicker small-kicker">
            EXPLORE SERIES
          </span>

          <h2>Browse by Genre</h2>

          <p>
            Choose a genre and find your next favorite series.
          </p>
        </div>

        <div className="movies-header-icon">📺</div>
      </div>

      <div className="genre-list">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`genre-btn ${
            selectedGenre === null ? "active" : ""
          }`}
        >
          All Shows
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() =>
              setSelectedGenre(
                selectedGenre === genre.id
                  ? null
                  : genre.id
              )
            }
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

  {/* ================= TV SHOWS ================= */}
  <section className="tv-grid-section">
    <div className="container">
      <div className="movies-result-header">
        <div>
          <span className="movies-kicker small-kicker">
            {selectedGenre
              ? "FILTERED COLLECTION"
              : "POPULAR NOW"}
          </span>

          <h2>
            {selectedGenre
              ? genres.find(
                  (genre) => genre.id === selectedGenre
                )?.name
              : "Popular TV Shows"}
          </h2>

          <p>
            {selectedGenre
              ? "Discover series from your selected genre."
              : "The most popular shows everyone is watching right now."}
          </p>
        </div>

        <div className="movie-count-badge">
          <strong>{filteredShows.length}</strong>
          <span>Shows</span>
        </div>
      </div>

      {filteredShows.length > 0 ? (
        <div className="row g-4">
          {filteredShows.slice(0, 16).map((show) => (
            <MovieCard
              key={show.id}
              movie={show}
            />
          ))}
        </div>
      ) : (
        <div className="premium-empty-state">
          <div className="empty-icon">📺</div>

          <h3>No Shows Found</h3>

          <p>
            We couldn't find any shows in this genre. Try another one.
          </p>

          <button
            onClick={() => setSelectedGenre(null)}
            className="empty-reset-btn"
          >
            Explore All Shows
          </button>
        </div>
      )}
    </div>
  </section>
</main>


);
}
