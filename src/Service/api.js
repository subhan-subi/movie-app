const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";



// 1. Trending Movies
export async function getTrendingMovies(language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

// 2. Popular Movies
export async function getPopularMovies(language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// 3. Top Rated Movies
export async function getTopRatedMovies(language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
}

// 4. Search Movies
export async function searchMovies(query, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

// 5. Movie Details
export async function getMovieDetails(id, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${language}`
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// 6. Similar Movies
export async function getSimilarMovies(id, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
}

// 7. Movie Credits (Cast)
export async function getMovieCredits(id, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=${language}`
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return { cast: [] };
  }
}

// 8. Movie Videos / Trailers
export async function getMovieVideos(id, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=${language}`
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return { results: [] };
  }
}

// 9. Genres List
export async function getGenres(language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`
    );
    const data = await res.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// 10. Movies by Genre
export async function getMoviesByGenre(genreId, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
}

// 11. Stream Player Embed URL Helper
export function getMovieStreamUrl(id, server = "vidsrc_xyz") {
  switch (server) {
    case "vidsrc_xyz":
      return `https://vidsrc.xyz/embed/movie/${id}`;
    case "vidlink":
      return `https://vidlink.pro/movie/${id}`;
    case "vidsrc_pro":
      return `https://vidsrc.pro/embed/movie/${id}`;
    case "embed2":
      return `https://www.2embed.cc/embed/${id}`;
    default:
      return `https://vidsrc.xyz/embed/movie/${id}`;
  }
}

// ==================== TV SHOWS ENDPOINTS ====================

// 12. Popular TV Shows
export async function getPopularTVShows(language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=${language}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    return [];
  }
}

// 13. TV Show Details
export async function getTVShowDetails(id, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${language}`
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

// 14. TV Show Season Details (Episodes list pane ke liye)
export async function getTVSeasonDetails(id, seasonNumber, language = "en-US") {
  try {
    const res = await fetch(
      `${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=${language}`
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching season details:", error);
    return null;
  }
}

// 15. TV Show Embed Player Helper
export function getTVStreamUrl(id, season = 1, episode = 1, server = "vidsrc_xyz") {
  switch (server) {
    case "vidsrc_xyz":
      return `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
    case "vidlink":
      return `https://vidlink.pro/tv/${id}/${season}/${episode}`;
    case "vidsrc_pro":
      return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
    case "embed2":
      return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
    default:
      return `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
  }
}


// Multi Search for Movies and TV Shows combined
export async function searchMulti(query) {
  if (!query) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
    );
    const data = await res.json();
    // Exclude actors/people profiles, only keep movies and tv shows
    return (data.results || []).filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
  } catch (error) {
    console.error("Error in multi search:", error);
    return [];
  }
}
// Backward compatibility (Agar aapke purane components mein fetchMovies use ho raha ho)
export const fetchMovies = getPopularMovies;


