import React from "react";
import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export function BottomNav() {
  return (
    <nav className="bottom-nav d-lg-none">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">⌂</span>
        <span className="bottom-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/movies"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">🎬</span>
        <span className="bottom-nav-label">Movies</span>
      </NavLink>

      <NavLink
        to="/tv"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">📺</span>
        <span className="bottom-nav-label">TV Series</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <span className="bottom-nav-icon">♡</span>
        <span className="bottom-nav-label">Wishlist</span>
      </NavLink>
    </nav>
  );
}