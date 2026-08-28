import { Routes, Route } from "react-router-dom";

import "./App.css";

import { MainLayout } from "./components/Layout";

import { Home } from "./pages/home";
import { Movies } from "../src/pages/Movies";
import { TVShows } from "./pages/TVShows";
import { SearchResults } from "./pages/SearchResults";
import { Movie } from "./pages/Movie";
import { TVShowDetails } from "./pages/TVShowDetails";
import { Wishlist } from "./pages/Wishlist";

function App() {
  return (
    <Routes>

      <Route element={<MainLayout />}>

        {/* ===============================
            HOME
        =============================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ===============================
            MOVIES
        =============================== */}

        <Route
          path="/movies"
          element={<Movies />}
        />

        {/* ===============================
            TV SHOWS
        =============================== */}

        <Route
          path="/tv"
          element={<TVShows />}
        />

        {/* ===============================
            SEARCH
        =============================== */}

        <Route
          path="/search/:query"
          element={<SearchResults />}
        />

        {/* ===============================
            MOVIE DETAILS
        =============================== */}

        <Route
          path="/movie/:id"
          element={<Movie />}
        />

        {/* ===============================
            TV SHOW DETAILS
        =============================== */}

        <Route
          path="/tv/:id"
          element={<TVShowDetails />}
        />

        {/* ===============================
            WISHLIST
        =============================== */}

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

      </Route>

    </Routes>
  );
}

export default App;