import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTVShowDetails,
  getTVSeasonDetails,
  getTVStreamUrl,
} from "../Service/api";

export function TVShowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState("vidsrc_xyz");
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch TV Show Main Details
  useEffect(() => {
    async function fetchShowData() {
      setLoading(true);
      const data = await getTVShowDetails(id);
      setShow(data);
      setLoading(false);
    }
    fetchShowData();
  }, [id]);

  // Fetch Season Data when Selected Season Changes
  useEffect(() => {
    async function fetchSeason() {
      if (!id) return;
      setLoadingEpisodes(true);
      const data = await getTVSeasonDetails(id, selectedSeason);
      setSeasonData(data);
      setSelectedEpisode(1); // Reset to Episode 1 on season change
      setLoadingEpisodes(false);
    }
    fetchSeason();
  }, [id, selectedSeason]);

  const handlePlayEpisode = (epNumber) => {
    setSelectedEpisode(epNumber);
    setIsPlaying(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading TV Show...</span>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center text-white min-vh-100">
        <p>TV Show details not found.</p>
        <button className="btn btn-warning" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="bg-dark text-white min-vh-100 pb-5">
      <div className="container py-4">
        <button className="btn btn-sm btn-outline-light rounded-pill mb-4 px-3" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        {/* Header Info */}
        <div className="row g-4 mb-5 align-items-center">
          <div className="col-12 col-md-4 text-center text-md-start">
            <img
              src={posterUrl}
              alt={show.name}
              className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
              style={{ maxHeight: "420px", objectFit: "cover" }}
            />
          </div>

          <div className="col-12 col-md-8">
            <span className="badge bg-danger text-white mb-2 px-3 py-2 fw-bold">📺 TV SERIES</span>
            <h1 className="fw-bold display-5 mb-2">{show.name}</h1>
            <p className="text-warning mb-3">
              ⭐ {show.vote_average?.toFixed(1)} / 10 | 📅 {show.first_air_date?.split("-")[0]} | 🎬 {show.number_of_seasons} Seasons
            </p>
            <p className="lh-lg text-light opacity-90 mb-4">{show.overview}</p>

            {/* Season Selector Dropdown */}
            <div className="d-flex align-items-center gap-3 bg-secondary bg-opacity-25 p-3 rounded-4 border border-secondary border-opacity-25" style={{ maxWidth: "400px" }}>
              <label className="fw-bold text-warning text-nowrap">Select Season:</label>
              <select
                className="form-select bg-dark text-white border-warning fw-semibold"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
              >
                {Array.from({ length: show.number_of_seasons || 1 }, (_, i) => i + 1).map((sNum) => (
                  <option key={sNum} value={sNum}>
                    Season {sNum}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div ref={playerRef} className="mb-5">
          {isPlaying ? (
            <div>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h4 className="fw-bold border-start border-warning border-4 ps-3 mb-0">
                  ▶️ Season {selectedSeason} - Episode {selectedEpisode}
                </h4>

                {/* Server Selector */}
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-secondary">Server:</span>
                  {["vidsrc_xyz", "vidlink", "vidsrc_pro"].map((srv) => (
                    <button
                      key={srv}
                      className={`btn btn-sm rounded-pill ${selectedServer === srv ? "btn-warning fw-bold" : "btn-outline-light"}`}
                      onClick={() => setSelectedServer(srv)}
                    >
                      {srv.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg bg-black border border-secondary border-opacity-25">
                <iframe
                  src={getTVStreamUrl(id, selectedSeason, selectedEpisode, selectedServer)}
                  title={`${show.name} S${selectedSeason}E${selectedEpisode}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0 }}
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25">
              <h5 className="text-light mb-2">Select an episode below to start watching!</h5>
            </div>
          )}
        </div>

        {/* Episodes Grid List */}
        <div>
          <h4 className="fw-bold mb-4 border-start border-warning border-4 ps-3">
            📑 Episodes (Season {selectedSeason})
          </h4>

          {loadingEpisodes ? (
            <div className="text-center text-muted py-4">Loading episodes...</div>
          ) : seasonData?.episodes?.length > 0 ? (
            <div className="row g-3">
              {seasonData.episodes.map((ep) => (
                <div key={ep.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className={`card h-100 bg-dark text-white border-secondary border-opacity-25 rounded-4 p-3 d-flex flex-row align-items-center gap-3 cursor-pointer shadow-sm hover-bg-secondary ${
                      selectedEpisode === ep.episode_number && isPlaying ? "border-warning border-2" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePlayEpisode(ep.episode_number)}
                  >
                    <div className="badge bg-warning text-dark fs-6 px-3 py-2 fw-bold rounded-3">
                      E{ep.episode_number}
                    </div>
                    <div className="text-truncate">
                      <h6 className="fw-bold mb-1 text-truncate">{ep.name}</h6>
                      <small className="text-secondary d-block">
                        ⭐ {ep.vote_average?.toFixed(1) || "N/A"} | {ep.runtime ? `${ep.runtime}m` : "TV"}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary">No episodes found for this season.</div>
          )}
        </div>
      </div>
    </div>
  );
}