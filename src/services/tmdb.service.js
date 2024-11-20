import { useNuxtApp, useRoute } from '#app';

export const authenticate = async () => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const route = useRoute();
  const approved = route.query.approved === 'true';
  const requestToken = route.query.request_token;
  const baseUrl = useRuntimeConfig().public.baseURL;

  if (sessionId) {
    return true
  } else if (approved && requestToken) {
    const sessionResponse = await $axios.post(`/authentication/session/new`, { request_token: requestToken });
    const newSessionId = sessionResponse.data.session_id;
    localStorage.setItem('session_id', newSessionId);
    return true
  } else {
    const tokenResponse = await $axios.get(`/authentication/token/new`);
    const token = tokenResponse.data.request_token;
    const priorUrl = route.fullPath
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${baseUrl + priorUrl}`;
    return false
  } 
}

export const getAccountData = async () => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');

  if (sessionId) {
    const accountResponse = await $axios.get(`/account`, { session_id: sessionId });
    return accountResponse.data
  }
  return null
}

export const addToWatchList = async (itemId) => {
  const { $axios } = useNuxtApp();
  const sessionId = localStorage.getItem('session_id');
  const account = await getAccountData();

  await $axios.post(`/account/${account.id}/watchlist`, { session_id: sessionId, media_id: itemId, watchlist: true });
}