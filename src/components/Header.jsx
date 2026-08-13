import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SearchResults } from "../pages/SearchResults";


export function Header() {

  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();


  function handleSearch(e) {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/search/${query}`);
      setQuery("");
      setIsMenuOpen(false);
    }
  }


  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (

    <header className="sticky-top shadow">

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">

        <div className="container">


          {/* Logo */}
          <Link
            className="navbar-brand fw-bold fs-3 text-warning"
            to="/"
            onClick={closeMenu}
          >
            🎬 Movie<span className="text-white">Hub</span>
          </Link>



          {/* Mobile Button */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >

            <span className="navbar-toggler-icon"></span>

          </button>




          {/* Menu */}
          <div
            className={`collapse navbar-collapse ${
              isMenuOpen ? "show" : ""
            }`}
          >



            {/* Navigation */}
            <ul className="navbar-nav mx-auto mb-3 mb-lg-0">


              <li className="nav-item">

                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({isActive}) =>
                    `nav-link px-3 ${
                      isActive 
                      ? "text-warning fw-bold" 
                      : ""
                    }`
                  }
                >
                  Home
                </NavLink>

              </li>



              <li className="nav-item">

                <NavLink
                  to="/movies"
                  onClick={closeMenu}
                  className={({isActive}) =>
                    `nav-link px-3 ${
                      isActive 
                      ? "text-warning fw-bold" 
                      : ""
                    }`
                  }
                >
                  Movies
                </NavLink>

              </li>




              <li className="nav-item">

                <NavLink
                  to="/trending"
                  onClick={closeMenu}
                  className={({isActive}) =>
                    `nav-link px-3 ${
                      isActive 
                      ? "text-warning fw-bold" 
                      : ""
                    }`
                  }
                >
                  🔥 Trending
                </NavLink>

              </li>




              <li className="nav-item">

                <NavLink
                  to="/Wishlist"
                  onClick={closeMenu}
                  className={({isActive}) =>
                    `nav-link px-3 ${
                      isActive 
                      ? "text-warning fw-bold" 
                      : ""
                    }`
                  }
                >
                  ❤️ Wishlist
                </NavLink>

              </li>


            </ul>




            {/* Search */}
            <form 
              className="d-flex"
              onSubmit={handleSearch}
            >

              <input

                className="form-control movie-search"

                type="search"

                placeholder="Search movies..."

                value={query}

                onChange={(e)=>setQuery(e.target.value)}

              />



              <button
                className="btn btn-warning ms-2 fw-bold"
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