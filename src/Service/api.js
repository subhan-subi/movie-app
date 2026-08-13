const API_KEY = import.meta.env.VITE_API_KEY;
const baseUrl = "https://api.themoviedb.org/3";

// Popular Movies
export async function fetchMovies(language = "en-US") {
  const response = await fetch(
    `${baseUrl}/movie/popular?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data.results;
}

// Search Movies
export async function searchMovies(query, language = "en-US") {
  const response = await fetch(
    `${baseUrl}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&language=${language}`
  );
  const data = await response.json();
  return data.results;
}

// Movie Details
export async function getMovieDetails(id, language = "en-US") {
  const response = await fetch(
    `${baseUrl}/movie/${id}?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data;
}

// Similar Movies
export async function getSimilarMovies(id, language = "en-US") {
  const response = await fetch(
    `${baseUrl}/movie/${id}/similar?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data.results;
}

// Movie Credits (Cast)
export async function getMovieCredits(id, language = "en-US") {
  const response = await fetch(
    `${baseUrl}/movie/${id}/credits?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data;
}

// Movie Videos / Trailers
export async function getMovieVideos(id, language = "en-US") {
  const response = await fetch(
    `${baseUrl}/movie/${id}/videos?api_key=${API_KEY}&language=${language}`
  );
  const data = await response.json();
  return data;
}
// Stream Player Embed URL Helper
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