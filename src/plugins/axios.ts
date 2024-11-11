import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const apiKey = useRuntimeConfig().public.tmdbReadAccessToken;

  const axiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  nuxtApp.provide('axios', axiosInstance);
});
