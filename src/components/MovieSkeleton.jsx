import React from "react";

export function MovieSkeleton() {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 bg-dark border-secondary border-opacity-25 rounded-4 overflow-hidden shadow">
        {/* Poster Image Placeholder */}
        <div
          className="bg-secondary bg-opacity-25 placeholder-wave"
          style={{ height: "360px" }}
        ></div>

        {/* Content Placeholder */}
        <div className="card-body p-3">
          <h6 className="card-title placeholder-glow mb-2">
            <span className="placeholder col-8 bg-secondary rounded"></span>
          </h6>
          <p className="card-text placeholder-glow mb-3">
            <span className="placeholder col-12 bg-secondary rounded mb-1"></span>
            <span className="placeholder col-6 bg-secondary rounded"></span>
          </p>
          <div className="placeholder-glow">
            <span className="placeholder col-12 bg-warning rounded-pill py-2"></span>
          </div>
        </div>
      </div>
    </div>
  );
}