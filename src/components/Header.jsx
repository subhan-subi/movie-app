import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { searchMulti } from "../Service/api";
import "./Header.css";

export function Header() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  // LIVE SEARCH
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchMulti(query.trim());
        setSuggestions(results ? results.slice(0, 6) : []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // CLOSE SEARCH DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // SEARCH SUBMIT
  const handleSearch = (event) => {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    navigate(`/search/${encodeURIComponent(cleanQuery)}`);
    setQuery("");
    setShowDropdown(false);
  };

  // SEARCH RESULT CLICK
  const handleSuggestionClick = (item) => {
    const isTV =
      item.media_type === "tv" || Boolean(item.first_air_date);

    const route = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
    navigate(route);
    setQuery("");
    setShowDropdown(false);
  };

  const navLinkClass = ({ isActive }) =>
    `header-nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="movie-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container d-flex align-items-center justify-content-between">
          {/* BRAND LOGO */}
          <Link to="/" className="movie-logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">
              Cine<span>Verse</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS (Hidden on Mobile/Tablet via d-none d-lg-flex) */}
          <div className="header-links d-none d-lg-flex align-items-center">
            <NavLink to="/" end className={navLinkClass}>
              <span>⌂</span>
              Home
            </NavLink>

            <NavLink to="/movies" className={navLinkClass}>
              <span>🎬</span>
              Movies
            </NavLink>

            <NavLink to="/tv" className={navLinkClass}>
              <span>📺</span>
              TV Shows
            </NavLink>

            <NavLink to="/wishlist" className={navLinkClass}>
              <span>♡</span>
              Wishlist
            </NavLink>
          </div>

          {/* SEARCH BAR (Visible everywhere) */}
          <div className="header-search-wrapper" ref={searchRef}>
            <form className="header-search" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => {
                  if (query.trim()) setShowDropdown(true);
                }}
                placeholder="Search movies & shows..."
                aria-label="Search movies and TV shows"
              />

              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setQuery("");
                    setShowDropdown(false);
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              <button
                type="submit"
                className="search-submit"
                aria-label="Search"
              >
                →
              </button>
            </form>

            {/* SEARCH DROPDOWN */}
            {showDropdown && (
              <div className="search-dropdown">
                {isSearching ? (
                  <div className="search-status">
                    <span className="search-spinner"></span>
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="search-dropdown-header">
                      <span>Search Results</span>
                      <small>{suggestions.length}</small>
                    </div>

                    <div className="search-results">
                      {suggestions.map((item) => {
                        const isTV =
                          item.media_type === "tv" ||
                          Boolean(item.first_air_date);

                        const title =
                          item.title || item.name || "Untitled";

                        const year = (
                          item.release_date ||
                          item.first_air_date ||
                          ""
                        ).split("-")[0];

                        const poster = item.poster_path
                          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                          : null;

                        return (
                          <button
                            key={`${item.media_type}-${item.id}`}
                            type="button"
                            className="search-result-item"
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <div className="search-result-poster">
                              {poster ? (
                                <img
                                  src={poster}
                                  alt={title}
                                  loading="lazy"
                                />
                              ) : (
                                <span>🎬</span>
                              )}
                            </div>

                            <div className="search-result-info">
                              <strong>{title}</strong>
                              <div className="search-result-meta">
                                <span>
                                  {isTV ? "📺 TV Series" : "🎬 Movie"}
                                </span>
                                <span>•</span>
                                <span>
                                  ⭐{" "}
                                  {item.vote_average
                                    ? item.vote_average.toFixed(1)
                                    : "N/A"}
                                </span>
                                {year && (
                                  <>
                                    <span>•</span>
                                    <span>{year}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <span className="result-arrow">→</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="view-all-search"
                      onClick={handleSearch}
                    >
                      View all results →
                    </button>
                  </>
                ) : (
                  <div className="search-empty">
                    <div>🔎</div>
                    <strong>No results found</strong>
                    <span>
                      Try searching for another movie or show.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}