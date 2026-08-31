import React, { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getGenres,
  getMoviesByGenre,
  getPopularTVShows,
  getKoreanContent,
  getBollywoodMovies,
  getAnimeShows,
} from "../Service/api";

import { MovieCard } from "../components/MovieCard";
import { HeroSlider } from "../components/HeroSlider";
import { MovieSkeleton } from "../components/MovieSkeleton";
import "./HomeSliders.css";

export function Home() {
  const [contentType, setContentType] = useState("movie");

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);

  // Category Sliders State
  const [korean, setKorean] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [anime, setAnime] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);

  // ==========================================
  // LOAD HOME DATA
  // ==========================================

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setSelectedGenre(null);
        setGenreMovies([]);

        if (contentType === "movie") {
          const [
            trendingData,
            popularData,
            topRatedData,
            genreData,
            koreanData,
            bollywoodData,
            animeData,
          ] = await Promise.all([
            getTrendingMovies(),
            getPopularMovies(),
            getTopRatedMovies(),
            getGenres(),
            getKoreanContent(),
            getBollywoodMovies(),
            getAnimeShows(),
          ]);

          if (!mounted) return;

          setTrending(trendingData || []);
          setPopular(popularData || []);
          setTopRated(topRatedData || []);
          setGenres(genreData || []);
          setKorean(koreanData || []);
          setBollywood(bollywoodData || []);
          setAnime(animeData || []);
        } else {
          const [tvData, genreData, koreanData, animeData] = await Promise.all([
            getPopularTVShows(),
            getGenres(),
            getKoreanContent(),
            getAnimeShows(),
          ]);

          if (!mounted) return;

          const formattedTV = (tvData || []).map((show) => ({
            ...show,
            title: show.name,
            release_date: show.first_air_date,
            media_type: "tv",
            isTV: true,
          }));

          setTrending(formattedTV);
          setPopular(formattedTV);

          setTopRated(
            [...formattedTV].sort(
              (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
            )
          );

          setGenres(genreData || []);
          setKorean(koreanData || []);
          setBollywood([]);
          setAnime(animeData || []);
        }
      } catch (error) {
        console.error("Failed to load home content:", error);

        if (mounted) {
          setTrending([]);
          setPopular([]);
          setTopRated([]);
          setGenres([]);
          setKorean([]);
          setBollywood([]);
          setAnime([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [contentType]);

  // ==========================================
  // GENRE FILTER
  // ==========================================

  const handleGenreClick = async (genreId) => {
    if (!genreId || selectedGenre === genreId) {
      setSelectedGenre(null);
      setGenreMovies([]);
      return;
    }

    try {
      setSelectedGenre(genreId);
      setGenreLoading(true);

      if (contentType === "movie") {
        const results = await getMoviesByGenre(genreId);
        setGenreMovies(
          (results || []).map((movie) => ({
            ...movie,
            media_type: "movie",
          }))
        );
      } else {
        const filtered = popular.filter((show) =>
          show.genre_ids?.includes(genreId)
        );
        setGenreMovies(filtered);
      }
    } catch (error) {
      console.error("Genre filter error:", error);
      setGenreMovies([]);
    } finally {
      setGenreLoading(false);
    }
  };

  // ==========================================
  // HELPER
  // ==========================================

  const prepareMovie = (item, typeOverride = null) => ({
    ...item,
    title: item.title || item.name,
    media_type:
      typeOverride || item.media_type || (contentType === "tv" ? "tv" : "movie"),
    isTV: contentType === "tv" || item.first_air_date ? true : false,
  });

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="home-page bg-dark text-white min-vh-100">
        <div className="container-fluid px-0">
          <div
            className="home-hero-loading"
            style={{
              height: "520px",
              background:
                "linear-gradient(90deg, #111827, #1f2937, #111827)",
            }}
          />
        </div>

        <div className="container py-5">
          <div className="mb-4">
            <div className="placeholder-glow">
              <span className="placeholder col-3 bg-secondary rounded"></span>
            </div>
          </div>

          <div className="row g-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="home-page bg-dark text-white min-vh-100 pb-5">

      {/* FULL WIDTH HERO */}
      {!loading && trending.length > 0 && (
        <section className="home-hero-section">
          <HeroSlider movies={trending.map((item) => prepareMovie(item))} />
        </section>
      )}

      {/* MAIN CONTENT */}
      <main className="container">

        {/* GENRES */}
        {genres.length > 0 && (
          <section className="genres-section py-4">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">EXPLORE</span>
                <h2 className="section-title">Browse by Genre</h2>
              </div>

              {selectedGenre && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning rounded-pill px-3"
                  onClick={() => handleGenreClick(null)}
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="genre-list">
              <button
                type="button"
                className={`genre-btn ${
                  selectedGenre === null ? "active" : ""
                }`}
                onClick={() => handleGenreClick(null)}
              >
                All
              </button>

              {genres.map((genre) => (
                <button
                  type="button"
                  key={genre.id}
                  className={`genre-btn ${
                    selectedGenre === genre.id ? "active" : ""
                  }`}
                  onClick={() => handleGenreClick(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* FILTERED RESULTS OR NORMAL SECTIONS */}
        {selectedGenre !== null ? (
          <section className="movie-section py-4">
            <div className="section-heading-row mb-4">
              <div>
                <span className="section-kicker">FILTERED COLLECTION</span>
                <h2 className="section-title">
                  {contentType === "movie" ? "Movies" : "TV Shows"}
                </h2>
              </div>
              <span className="result-count">
                {genreMovies.length} results
              </span>
            </div>

            {genreLoading ? (
              <div className="row g-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))}
              </div>
            ) : genreMovies.length > 0 ? (
              <div className="row g-4">
                {genreMovies.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={prepareMovie(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">🎬</div>
                <h4>No results found</h4>
                <p>Try another genre.</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* POPULAR SECTION */}
            {popular.length > 0 && (
              <section className="movie-section py-4">
                <div className="section-heading-row mb-4">
                  <div>
                    <span className="section-kicker">DON'T MISS</span>
                    <h2 className="section-title">
                      Popular {contentType === "movie" ? "Movies" : "TV Shows"}
                    </h2>
                  </div>
                  <span className="section-icon">🔥</span>
                </div>

                <div className="row g-4">
                  {popular.slice(0, 8).map((item) => (
                    <MovieCard
                      key={item.id}
                      movie={prepareMovie(item)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* KOREAN DRAMAS & MOVIES SLIDER */}
            {korean.length > 0 && (
              <section className="category-slider-section py-3">
                <div className="section-heading-row mb-3">
                  <div>
                    <span className="section-kicker">TRENDING ASIAN</span>
                    <h2 className="section-title text-warning">
                      🇰🇷 Korean Dramas & Movies
                    </h2>
                  </div>
                </div>

                <div className="horizontal-scroll-container">
                  {korean.map((item) => (
                    <div className="slider-card-wrapper" key={item.id}>
                      <MovieCard movie={prepareMovie(item, "tv")} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ANIME COLLECTION SLIDER */}
            {anime.length > 0 && (
              <section className="category-slider-section py-3">
                <div className="section-heading-row mb-3">
                  <div>
                    <span className="section-kicker">JAPANESE ANIMATION</span>
                    <h2 className="section-title text-warning">
                      ⚡ Popular Anime Shows
                    </h2>
                  </div>
                </div>

                <div className="horizontal-scroll-container">
                  {anime.map((item) => (
                    <div className="slider-card-wrapper" key={item.id}>
                      <MovieCard movie={prepareMovie(item, "tv")} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* BOLLYWOOD HITS SLIDER (Visible on Movie View) */}
            {bollywood.length > 0 && (
              <section className="category-slider-section py-3">
                <div className="section-heading-row mb-3">
                  <div>
                    <span className="section-kicker">INDIAN CINEMA</span>
                    <h2 className="section-title text-warning">
                      🍿 Bollywood Hits
                    </h2>
                  </div>
                </div>

                <div className="horizontal-scroll-container">
                  {bollywood.map((item) => (
                    <div className="slider-card-wrapper" key={item.id}>
                      <MovieCard movie={prepareMovie(item, "movie")} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TOP RATED SECTION */}
            {topRated.length > 0 && (
              <section className="movie-section py-4">
                <div className="section-heading-row mb-4">
                  <div>
                    <span className="section-kicker">HIGHEST RATED</span>
                    <h2 className="section-title">
                      Top Rated {contentType === "movie" ? "Movies" : "TV Shows"}
                    </h2>
                  </div>
                  <span className="section-icon">⭐</span>
                </div>

                <div className="row g-4">
                  {topRated.slice(0, 8).map((item) => (
                    <MovieCard
                      key={item.id}
                      movie={prepareMovie(item)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}