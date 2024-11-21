import { useNuxtApp, useRoute } from '#app';

// Authentication

export const authenticate = async () => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const route = useRoute();
  const approved = route.query.approved === 'true';
  const requestToken = route.query.request_token;
  const baseUrl = useRuntimeConfig().public.baseURL;

  if (sessionId) {
    return true;
  } else if (approved && requestToken) {
    const sessionResponse = await $axios.post(`/authentication/session/new`, { request_token: requestToken });
    const newSessionId = sessionResponse.data.session_id;
    localStorage.setItem('session_id', newSessionId);
    return true;
  } else {
    const tokenResponse = await $axios.get(`/authentication/token/new`);
    const token = tokenResponse.data.request_token;
    const priorUrl = route.fullPath;
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${baseUrl + priorUrl}`;
    return false;
  } 
};

export const getAccountData = async () => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');

  if (sessionId) {
    const accountResponse = await $axios.get(`/account`, { session_id: sessionId });
    return accountResponse.data;
  };

  return null;
};

// Movies

export const getAllMovieData = async () => {
  const { $axios } = useNuxtApp();

  const genreResponse = await $axios.get(`/genre/movie/list`);
  const genres = genreResponse.data.genres;

  const moviesByGenre = await Promise.all(
    genres.map(async (genre) => {
      const movieResponse = await $axios.get(`/discover/movie`, { params: { with_genres: genre.id } });
      return {
        ...genre,
        movies: movieResponse.data.results,
        total_movies: movieResponse.data.total_results,
      };
    })
  );

  return moviesByGenre;
};

export const getMovieGenreData = async (params, page = 1) => {
  const { $axios } = useNuxtApp();

  const movieResponse = await $axios.get(`/discover/movie`, { params: { with_genres: params, page: page } });
  const genreResponse = await $axios.get(`/genre/movie/list`);

  return {
    movies: movieResponse.data.results,
    total_movies: movieResponse.data.total_results,
    genre_name: genreResponse.data.genres.find((genre) => genre.id === Number(params)).name,
  };
};

export const getSpecificMovieData = async (movieId) => {
  const { $axios } = useNuxtApp();

  const movieResponse = await $axios.get(`/movie/${movieId}`);
  const trailerResponse = await $axios.get(`/movie/${movieId}/videos`);
  const castResponse = await $axios.get(`/movie/${movieId}/casts`);
  const creditsResponse = await $axios.get(`/movie/${movieId}/credits`);

  return {
    movie: movieResponse.data,
    backdrop_image: movieResponse.data.backdrop_path,
    trailer: trailerResponse.data,
    cast: castResponse.data.cast,
    directors: creditsResponse.data.crew.filter((person) => person.job === "Director"),
  }
};

// Movies watchlist

export const addMovieToWatchlist = async (itemId) => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const account = await getAccountData();

  await $axios.post(`/account/${account.id}/watchlist`, { session_id: sessionId, media_id: itemId, media_type: 'movie', watchlist: true });
};

export const removeMovieFromWatchlist = async (itemId) => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const account = await getAccountData();

  return await $axios.post(`/account/${account.id}/watchlist`, { session_id: sessionId, media_id: itemId, media_type: 'movie', watchlist: false, });
};

export const getMovieWatchlist = async () => {
  const { $axios } = useNuxtApp();
  const account = await getAccountData();
  return await $axios.get(`/account/${account.id}/watchlist/movies`);
};

// Series

export const getAllSeriesData = async () => {
  const { $axios } = useNuxtApp();

  const genreResponse = await $axios.get(`/genre/tv/list`);
  const genres = genreResponse.data.genres;

  const seriesByGenre = await Promise.all(
    genres.map(async (genre) => {
      const seriesResponse = await $axios.get(`/discover/tv`, { params: { with_genres: genre.id } });
      return {
        ...genre,
        series: seriesResponse.data.results,
        total_series: seriesResponse.data.total_results,
      };
    })
  );

  return seriesByGenre;
};

export const getSeriesGenreData = async (params, page = 1) => {
  const { $axios } = useNuxtApp();

  const seriesResponse = await $axios.get(`/discover/tv`, { params: { with_genres: params, page: page } });
  const genreResponse = await $axios.get(`/genre/tv/list`);

  return {
    series: seriesResponse.data.results,
    total_series: seriesResponse.data.total_results,
    genre_name: genreResponse.data.genres.find((genre) => genre.id === Number(params)).name,
  };
};

export const getSpecificSeriesData = async (seriesId) => {
  const { $axios } = useNuxtApp();

  const seriesResponse = await $axios.get(`/tv/${seriesId}`);
  const trailerResponse = await $axios.get(`/tv/${seriesId}/videos`);
  const creditsResponse = await $axios.get(`/tv/${seriesId}/credits`);

  return {
    series: seriesResponse.data,
    backdrop_image: seriesResponse.data.backdrop_path,
    trailer: trailerResponse.data,
    cast: creditsResponse.data.cast,
    directors: creditsResponse.data.crew,
  }
};

// Series watchlist

export const addSeriesToWatchlist = async (itemId) => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const account = await getAccountData();

  await $axios.post(`/account/${account.id}/watchlist`, { session_id: sessionId, media_id: itemId, media_type: 'tv', watchlist: true });
};

export const removeSeriesFromWatchlist = async (itemId) => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const account = await getAccountData();

  return await $axios.post(`/account/${account.id}/watchlist`, { session_id: sessionId, media_id: itemId, media_type: 'tv', watchlist: false, });
};

export const getSeriesWatchlist = async () => {
  const { $axios } = useNuxtApp();
  const account = await getAccountData();
  return await $axios.get(`/account/${account.id}/watchlist/tv`);
};
