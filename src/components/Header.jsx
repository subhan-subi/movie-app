import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export function Header() {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query.trim()}`);
      setQuery("");
      setIsMenuOpen(false);
    }
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky-top border-bottom border-secondary border-opacity-25" style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(15, 23, 42, 0.9)" }}>
      <nav className="navbar navbar-expand-lg navbar-dark py-3">
        <div className="container">
          {/* Logo */}
          <Link
            className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2 text-warning"
            to="/"
            onClick={closeMenu}
          >
            <span>🎬</span> <span>Movie<span className="text-white">Hub</span></span>
          </Link>

          {/* Mobile Button */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto mb-3 mb-lg-0 fw-semibold">
              <li className="nav-item">
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "text-warning fw-bold border-bottom border-warning border-2" : "text-light"}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/wishlist"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "text-warning fw-bold border-bottom border-warning border-2" : "text-light"}`
                  }
                >
                  ❤️ Wishlist
                </NavLink>
              </li>
            </ul>

            {/* Search Input */}
            <form className="d-flex position-relative" onSubmit={handleSearch}>
              <input
                className="form-control bg-dark text-white border-secondary rounded-pill px-4 pe-5"
                type="search"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ minWidth: "240px" }}
              />
              <button
                className="btn btn-warning rounded-circle position-absolute end-0 top-0 m-1 p-0 d-flex align-items-center justify-content-center"
                style={{ width: "30px", height: "30px" }}
                type="submit"
              >
                🔍
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}