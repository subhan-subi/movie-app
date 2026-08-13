import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { MovieCard } from "../components/MovieCard";

export function Wishlist() {
  const { wishlist = [] } = useContext(WishlistContext);

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="fw-bold m-0 d-flex align-items-center gap-2">
          <span>❤️ My Wishlist</span>
          {wishlist.length > 0 && (
            <span className="badge bg-danger rounded-pill fs-6 fs-md-5">
              {wishlist.length}
            </span>
          )}
        </h2>
      </div>

      {/* Conditional Rendering: Empty State vs Movies Grid */}
      {wishlist.length === 0 ? (
        <div className="text-center py-5 my-4">
          <div className="display-1 text-muted mb-3">🎬</div>
          <h3 className="fw-bold text-secondary">Your wishlist is empty</h3>
          <p className="text-muted mb-4">
            Explore our collection and add your favorite movies here!
          </p>
          <Link to="/" className="btn btn-primary btn-lg fw-semibold px-4">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}