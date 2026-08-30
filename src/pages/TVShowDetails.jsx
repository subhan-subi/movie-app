import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTVShowDetails,
  getTVSeasonDetails,
  getTVStreamUrl,
} from "../Service/api";
import "./TVShowDetails.css";

export function TVShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState("vidlink");

  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [language, setLanguage] = useState("en-US");

  const languages = [
    {
      value: "en-US",
      label: "English",
      flag: "🇺🇸",
    },
    {
      value: "hi-IN",
      label: "Hindi",
      flag: "🇮🇳",
    },
    {
      value: "es-ES",
      label: "Spanish",
      flag: "🇪🇸",
    },
    {
      value: "fr-FR",
      label: "French",
      flag: "🇫🇷",
    },
    {
      value: "de-DE",
      label: "German",
      flag: "🇩🇪",
    },
    {
      value: "ja-JP",
      label: "Japanese",
      flag: "🇯🇵",
    },
    {
      value: "ko-KR",
      label: "Korean",
      flag: "🇰🇷",
    },
  ];

  const servers = [
    {
      id: "vidlink",
      label: "Server 1",
      name: "VidLink (Fast)",
    },
    {
      id: "vidsrc_cc",
      label: "Server 2",
      name: "VidSrc CC",
    },
    {
      id: "smashystream",
      label: "Server 3",
      name: "SmashyStream",
    },
    {
      id: "vidsrc_me",
      label: "Server 4",
      name: "VidSrc Me",
    },
    {
      id: "embed2",
      label: "Server 5",
      name: "2Embed",
    },
  ];

  // ==========================================
  // FETCH SHOW DETAILS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    async function fetchShowData() {
      try {
        setLoading(true);

        const data = await getTVShowDetails(id, language);

        if (isMounted) {
          setShow(data);
        }
      } catch (error) {
        console.error("Failed to fetch TV show:", error);

        if (isMounted) {
          setShow(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchShowData();

    return () => {
      isMounted = false;
    };
  }, [id, language]);

  // ==========================================
  // FETCH SEASON / EPISODES
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    async function fetchSeason() {
      if (!id) return;

      try {
        setLoadingEpisodes(true);

        const data = await getTVSeasonDetails(
          id,
          selectedSeason,
          language
        );

        if (isMounted) {
          setSeasonData(data);
          setSelectedEpisode(1);
        }
      } catch (error) {
        console.error("Failed to fetch season:", error);

        if (isMounted) {
          setSeasonData(null);
        }
      } finally {
        if (isMounted) {
          setLoadingEpisodes(false);
        }
      }
    }

    fetchSeason();

    return () => {
      isMounted = false;
    };
  }, [id, selectedSeason, language]);

  // ==========================================
  // LANGUAGE CHANGE
  // ==========================================

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setIsPlaying(false);
    setSelectedEpisode(1);
  };

  // ==========================================
  // SEASON CHANGE
  // ==========================================

  const handleSeasonChange = (event) => {
    setSelectedSeason(Number(event.target.value));
    setIsPlaying(false);
    setSelectedEpisode(1);
  };

  // ==========================================
  // PLAY EPISODE
  // ==========================================

  const handlePlayEpisode = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
    setIsPlaying(true);

    setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ==========================================
  // SERVER CHANGE
  // ==========================================

  const handleServerChange = (server) => {
    setSelectedServer(server);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="tv-details-page">
        <div className="tv-details-loader">
          <div className="tv-loader-spinner"></div>
          <h5>Loading Series...</h5>
          <p>Preparing show details and episodes</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (!show) {
    return (
      <main className="tv-details-page">
        <div className="tv-error-state">
          <div className="tv-error-icon">📺</div>
          <h2>TV Show Not Found</h2>
          <p>We couldn't find the series you're looking for.</p>
          <button
            className="tv-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : null;

  const selectedLanguage = languages.find(
    (item) => item.value === language
  );

  const selectedEpisodeData = seasonData?.episodes?.find(
    (episode) => episode.episode_number === selectedEpisode
  );

  return (
    <main className="tv-details-page">
      {/* ==========================================
          BACKDROP
      ========================================== */}
      {backdropUrl && (
        <div
          className="tv-details-backdrop"
          style={{
            backgroundImage: `url(${backdropUrl})`,
          }}
        />
      )}

      <div className="tv-details-overlay"></div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}
      <div className="container tv-details-container">
        {/* TOP BAR */}
        <div className="tv-topbar">
          <button
            className="tv-back-btn"
            onClick={() => navigate(-1)}
          >
            <span>←</span>
            Back
          </button>

          <div className="language-control">
            <span className="language-label">🌐 Language</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="language-select"
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ==========================================
            HERO SECTION
        ========================================== */}
        <section className="tv-hero">
          <div className="tv-poster-wrapper">
            <img
              src={posterUrl}
              alt={show.name}
              className="tv-main-poster"
            />
            <div className="poster-badge">📺 TV SERIES</div>
          </div>

          <div className="tv-info">
            <div className="tv-kicker">
              <span>TV SERIES</span>
              <span className="kicker-dot">•</span>
              <span>{show.status || "Series"}</span>
            </div>

            <h1 className="tv-title">{show.name}</h1>

            {show.tagline && (
              <p className="tv-tagline">"{show.tagline}"</p>
            )}

            {/* META */}
            <div className="tv-meta">
              <div className="tv-rating">
                <span>⭐</span>
                <strong>
                  {show.vote_average
                    ? show.vote_average.toFixed(1)
                    : "N/A"}
                </strong>
                <small>/ 10</small>
              </div>

              {show.first_air_date && (
                <div className="tv-meta-item">
                  📅
                  <span>
                    {new Date(show.first_air_date).getFullYear()}
                  </span>
                </div>
              )}

              <div className="tv-meta-item">
                🎬
                <span>
                  {show.number_of_seasons || 0} Seasons
                </span>
              </div>

              <div className="tv-meta-item">
                🎞️
                <span>
                  {show.number_of_episodes || 0} Episodes
                </span>
              </div>
            </div>

            {/* GENRES */}
            {show.genres?.length > 0 && (
              <div className="tv-genres">
                {show.genres.map((genre) => (
                  <span key={genre.id} className="tv-genre">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* OVERVIEW */}
            <div className="tv-overview">
              <h3>About the Series</h3>
              <p>
                {show.overview ||
                  "No description available for this series."}
              </p>
            </div>

            {/* QUICK INFO */}
            <div className="tv-quick-info">
              <div>
                <span>Original Language</span>
                <strong>
                  {show.original_language?.toUpperCase() || "N/A"}
                </strong>
              </div>

              <div>
                <span>First Air Date</span>
                <strong>{show.first_air_date || "N/A"}</strong>
              </div>

              <div>
                <span>Last Air Date</span>
                <strong>{show.last_air_date || "N/A"}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            WATCH SECTION
        ========================================== */}
        <section ref={playerRef} className="tv-player-section">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">NOW WATCHING</span>
              <h2>
                {isPlaying
                  ? `${show.name} — S${selectedSeason} E${selectedEpisode}`
                  : "Choose an Episode"}
              </h2>
            </div>

            {isPlaying && (
              <div className="playing-badge">
                <span></span>
                LIVE PLAYER
              </div>
            )}
          </div>

          {isPlaying ? (
            <div className="player-wrapper">
              <div className="player-topbar">
                <div className="current-episode">
                  <div className="episode-number">
                    E{selectedEpisode}
                  </div>
                  <div>
                    <strong>
                      {selectedEpisodeData?.name ||
                        `Episode ${selectedEpisode}`}
                    </strong>
                    <small>Season {selectedSeason}</small>
                  </div>
                </div>

                <div className="server-selector">
                  <span>Server</span>
                  <div className="server-buttons">
                    {servers.map((server) => (
                      <button
                        key={server.id}
                        onClick={() =>
                          handleServerChange(server.id)
                        }
                        className={
                          selectedServer === server.id
                            ? "server-btn active"
                            : "server-btn"
                        }
                      >
                        {server.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="video-container">
                <iframe
                  src={getTVStreamUrl(
                    id,
                    selectedSeason,
                    selectedEpisode,
                    selectedServer
                  )}
                  title={`${show.name} Season ${selectedSeason} Episode ${selectedEpisode}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="player-language-note">
                🌐 Selected language:{" "}
                <strong>{selectedLanguage?.label}</strong>
                <span>
                  Language availability depends on the streaming
                  server.
                </span>
              </div>
            </div>
          ) : (
            <div className="player-placeholder">
              <div className="player-placeholder-icon">▶</div>
              <h3>Ready to Watch?</h3>
              <p>Select an episode below and start streaming.</p>
            </div>
          )}
        </section>

        {/* ==========================================
            SEASON SELECTOR
        ========================================== */}
        <section className="season-section">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">SERIES GUIDE</span>
              <h2>Browse Seasons</h2>
            </div>

            <div className="season-select-wrapper">
              <span>Season</span>
              <select
                value={selectedSeason}
                onChange={handleSeasonChange}
                className="season-select"
              >
                {Array.from(
                  {
                    length: show.number_of_seasons || 1,
                  },
                  (_, index) => index + 1
                ).map((seasonNumber) => (
                  <option key={seasonNumber} value={seasonNumber}>
                    Season {seasonNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEASON INFO */}
          {seasonData && (
            <div className="season-summary">
              <div className="season-summary-icon">🎬</div>
              <div>
                <h4>Season {selectedSeason}</h4>
                <p>
                  {seasonData.episodes?.length || 0} episodes available
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ==========================================
            EPISODES
        ========================================== */}
        <section className="episodes-section">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">EPISODES</span>
              <h2>Season {selectedSeason}</h2>
            </div>

            {seasonData?.episodes?.length > 0 && (
              <span className="episode-count">
                {seasonData.episodes.length} Episodes
              </span>
            )}
          </div>

          {loadingEpisodes ? (
            <div className="episodes-loading">
              <div className="tv-loader-spinner small"></div>
              <p>Loading episodes...</p>
            </div>
          ) : seasonData?.episodes?.length > 0 ? (
            <div className="episodes-grid">
              {seasonData.episodes.map((episode) => {
                const isSelected =
                  selectedEpisode === episode.episode_number &&
                  isPlaying;

                return (
                  <article
                    key={episode.id}
                    className={
                      isSelected
                        ? "episode-card selected"
                        : "episode-card"
                    }
                    onClick={() =>
                      handlePlayEpisode(episode.episode_number)
                    }
                  >
                    <div className="episode-thumbnail">
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                          alt={episode.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="episode-no-image">🎬</div>
                      )}
                      <div className="episode-play">▶</div>
                      <span className="episode-number-badge">
                        E{episode.episode_number}
                      </span>
                    </div>

                    <div className="episode-content">
                      <h3>
                        {episode.name ||
                          `Episode ${episode.episode_number}`}
                      </h3>

                      <div className="episode-meta">
                        <span>
                          ⭐{" "}
                          {episode.vote_average
                            ? episode.vote_average.toFixed(1)
                            : "N/A"}
                        </span>
                        {episode.runtime && (
                          <span>⏱️ {episode.runtime}m</span>
                        )}
                        {episode.air_date && (
                          <span>📅 {episode.air_date}</span>
                        )}
                      </div>

                      {episode.overview && <p>{episode.overview}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-episodes">
              <div>📺</div>
              <h3>No Episodes Found</h3>
              <p>Episodes are not available for this season.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}