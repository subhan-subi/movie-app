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

// 1. Trending Movies
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

// 2. Popular Movies
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

// 3. Top Rated Movies
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

// 4. Now Playing Movies
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

// 5. Upcoming Movies
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

// 6. Search Movies Only
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

// 7. Multi Search (Movies + TV Shows)
export async function searchMulti(
query,
language = "en-US",
page = 1
) {
if (!query?.trim()) return [];

try {
const data = await fetchFromTMDB(
`/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=${language}&page=${page}`
);


// People ko exclude karna
return (data.results || []).filter(
  (item) =>
    item.media_type === "movie" ||
    item.media_type === "tv"
);


} catch (error) {
console.error("Error in multi search:", error);
return [];
}
}

// ==========================================
// MOVIE DETAILS APIs
// ==========================================

// 8. Movie Details
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

// 9. Similar Movies
export async function getSimilarMovies(
id,
language = "en-US",
page = 1
) {
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

// 10. Movie Credits / Cast
export async function getMovieCredits(id, language = "en-US") {
try {
return await fetchFromTMDB(
`/movie/${id}/credits?api_key=${API_KEY}&language=${language}`
);
} catch (error) {
console.error("Error fetching movie credits:", error);


return {
  cast: [],
  crew: [],
};


}
}

// 11. Movie Videos / Trailers
export async function getMovieVideos(id, language = "en-US") {
try {
return await fetchFromTMDB(
`/movie/${id}/videos?api_key=${API_KEY}&language=${language}`
);
} catch (error) {
console.error("Error fetching movie videos:", error);


return {
  results: [],
};


}
}

// ==========================================
// GENRES APIs
// ==========================================

// 12. Movie Genres
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

// 13. Movies By Genre
export async function getMoviesByGenre(
genreId,
language = "en-US",
page = 1
) {
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

export function getMovieStreamUrl(
id,
server = "vidsrc_xyz"
) {
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

// ==========================================
// TV SHOW APIs
// ==========================================

// 14. Popular TV Shows
export async function getPopularTVShows(
language = "en-US",
page = 1
) {
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

// 15. Trending TV Shows
export async function getTrendingTVShows(
language = "en-US",
page = 1
) {
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

// 16. Top Rated TV Shows
export async function getTopRatedTVShows(
language = "en-US",
page = 1
) {
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

// 17. On The Air TV Shows
export async function getOnTheAirTVShows(
language = "en-US",
page = 1
) {
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

// 18. TV Show Details
export async function getTVShowDetails(
id,
language = "en-US"
) {
try {
return await fetchFromTMDB(
`/tv/${id}?api_key=${API_KEY}&language=${language}`
);
} catch (error) {
console.error("Error fetching TV show details:", error);
return null;
}
}

// 19. TV Season Details / Episodes
export async function getTVSeasonDetails(
id,
seasonNumber,
language = "en-US"
) {
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
server = "vidsrc_xyz"
) {
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

// ==========================================
// BACKWARD COMPATIBILITY
// ==========================================

export const fetchMovies = getPopularMovies;
