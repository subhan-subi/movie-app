const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// ==========================================
// HELPER FUNCTION
// ==========================================

async function fetchFromTMDB(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);

    if (!res.ok) {
      throw new Error(`TMDB Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB API Error:", error);
    throw error;
  }
}

// ==========================================
// MOVIES APIs
// ==========================================

export async function getTrendingMovies(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/trending/movie/day?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

export async function getPopularMovies(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

export async function getTopRatedMovies(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
}

export async function getNowPlayingMovies(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/movie/now_playing?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return [];
  }
}

export async function getUpcomingMovies(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/movie/upcoming?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
}

// ==========================================
// SEARCH APIs
// ==========================================

export async function searchMovies(query, language = "en-US", page = 1) {
  if (!query?.trim()) return [];

  try {
    const data = await fetchFromTMDB(
      `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

export async function searchMulti(query, language = "en-US", page = 1) {
  if (!query?.trim()) return [];

  try {
    const data = await fetchFromTMDB(
      `/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=${language}&page=${page}`
    );

    return (data.results || []).filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
  } catch (error) {
    console.error("Error in multi search:", error);
    return [];
  }
}

// ==========================================
// MOVIE DETAILS APIs
// ==========================================

export async function getMovieDetails(id, language = "en-US") {
  try {
    return await fetchFromTMDB(
      `/movie/${id}?api_key=${API_KEY}&language=${language}`
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function getSimilarMovies(id, language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/movie/${id}/similar?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
}

export async function getMovieCredits(id, language = "en-US") {
  try {
    return await fetchFromTMDB(
      `/movie/${id}/credits?api_key=${API_KEY}&language=${language}`
    );
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function getMovieVideos(id, language = "en-US") {
  try {
    return await fetchFromTMDB(
      `/movie/${id}/videos?api_key=${API_KEY}&language=${language}`
    );
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return { results: [] };
  }
}

// Universal Trailer Fetcher (Movie & TV Fallback)
export async function getMediaTrailer(id, type = "movie") {
  try {
    const data = await fetchFromTMDB(
      `/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const trailer = (data.results || []).find(
      (video) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser")
    );
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error(`Error fetching ${type} trailer:`, error);
    return null;
  }
}

// ==========================================
// GENRES APIs
// ==========================================

export async function getGenres(language = "en-US") {
  try {
    const data = await fetchFromTMDB(
      `/genre/movie/list?api_key=${API_KEY}&language=${language}`
    );
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

export async function getMoviesByGenre(genreId, language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
}

// ==========================================
// MOVIE STREAMING URL
// ==========================================

export function getMovieStreamUrl(id, server = "vidlink", lang = "en-US") {
  const shortLang = lang.split("-")[0];

  switch (server) {
    case "vidlink":
      return `https://vidlink.pro/movie/${id}?primaryColor=f59e0b`;

    case "vidsrc_cc":
      return `https://vidsrc.cc/v2/embed/movie/${id}?lang=${shortLang}`;

    case "smashystream":
      return `https://embed.smashystream.com/playere.php?tmdb=${id}`;

    case "vidsrc_me":
      return `https://vidsrc.me/embed/movie?tmdb=${id}`;

    case "embed2":
      return `https://www.2embed.skin/embed/${id}`;

    default:
      return `https://vidlink.pro/movie/${id}`;
  }
}

// ==========================================
// TV SHOW APIs
// ==========================================

export async function getPopularTVShows(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/tv/popular?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    return [];
  }
}

export async function getTrendingTVShows(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/trending/tv/day?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching trending TV shows:", error);
    return [];
  }
}

export async function getTopRatedTVShows(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/tv/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching top rated TV shows:", error);
    return [];
  }
}

export async function getOnTheAirTVShows(language = "en-US", page = 1) {
  try {
    const data = await fetchFromTMDB(
      `/tv/on_the_air?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    return data.results || [];
  } catch (error) {
    console.error("Error fetching on-air TV shows:", error);
    return [];
  }
}

// ==========================================
// TV SHOW DETAILS
// ==========================================

export async function getTVShowDetails(id, language = "en-US") {
  try {
    return await fetchFromTMDB(
      `/tv/${id}?api_key=${API_KEY}&language=${language}`
    );
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

export async function getTVSeasonDetails(id, seasonNumber, language = "en-US") {
  try {
    return await fetchFromTMDB(
      `/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=${language}`
    );
  } catch (error) {
    console.error("Error fetching season details:", error);
    return null;
  }
}

// ==========================================
// TV STREAMING URL
// ==========================================

export function getTVStreamUrl(
  id,
  season = 1,
  episode = 1,
  server = "vidlink",
  lang = "en-US"
) {
  const shortLang = lang.split("-")[0];

  switch (server) {
    case "vidlink":
      return `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=f59e0b`;

    case "vidsrc_cc":
      return `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?lang=${shortLang}`;

    case "smashystream":
      return `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}`;

    case "vidsrc_me":
      return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;

    case "embed2":
      return `https://www.2embed.skin/embedtv/${id}&s=${season}&e=${episode}`;

    default:
      return `https://vidlink.pro/tv/${id}/${season}/${episode}`;
  }
}

// ==========================================
// BACKWARD COMPATIBILITY & ASIAN CONTENT
// ==========================================

export async function getKoreanContent() {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching Korean content:", error);
    return [];
  }
}

export async function getBollywoodMovies() {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching Bollywood movies:", error);
    return [];
  }
}

export async function getAnimeShows() {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching Anime shows:", error);
    return [];
  }
}

export const fetchMovies = getPopularMovies;