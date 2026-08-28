
import React, { useEffect, useState } from "react";
import { getPopularTVShows, getGenres } from "../Service/api";
import { MovieCard } from "../components/MovieCard";
import { MovieSkeleton } from "../components/MovieSkeleton";

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
    return (
      <main className="tv-page">
        <div className="container py-5">
          <div className="page-heading mb-5">
            <span className="section-kicker">TV COLLECTION</span>
            <h1>Discover TV Shows</h1>
            <p>
              Explore popular series, addictive stories and unforgettable
              characters.
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
    <main className="tv-page">
      {/* ================= PAGE HERO ================= */}
      <section className="tv-heading-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-kicker">📺 TV COLLECTION</span>

            <h1>
              Binge Your Next
              <span> Favorite Series</span>
            </h1>

            <p>
              Discover popular TV shows, explore different genres and find
              your next binge-worthy series.
            </p>

            <div className="heading-stats">
              <div>
                <strong>{shows.length}+</strong>
                <span>Shows</span>
              </div>

              <div>
                <strong>{genres.length}</strong>
                <span>Genres</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Entertainment</span>
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
                  selectedGenre === genre.id ? null : genre.id
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
      </section>

      {/* ================= TV SHOWS ================= */}
      <section className="container py-4 pb-5">
        <div className="content-section-header">
          <div>
            <span className="section-kicker">
              {selectedGenre ? "FILTERED COLLECTION" : "POPULAR NOW"}
            </span>

            <h2>
              {selectedGenre
                ? "Shows You May Like"
                : "Popular TV Shows"}
            </h2>
          </div>

          <span className="section-icon">📺</span>
        </div>

        {filteredShows.length > 0 ? (
          <div className="row g-4">
            {filteredShows.slice(0, 16).map((show) => (
              <MovieCard key={show.id} movie={show} />
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <div>📺</div>
            <h3>No Shows Found</h3>
            <p>Try another genre.</p>
          </div>
        )}
      </section>
    </main>
  );
}

