<template>
  <div class="wrapper">
    <div v-if="movieData">
      <h1>{{ movieData.title }}</h1>
      <p>{{ movieData.overview }}</p>
      <img :src="`https://image.tmdb.org/t/p/w200${movieData.poster_path}`" :alt="movieData.title + ' movie poster'" />
    </div>
    <div v-else>
      <p>Loading movie details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useRoute } from '#app';

const movieData = ref(null);
const route = useRoute();
const { $axios } = useNuxtApp();

const fetchMovieData = async () => {
  const movieId = route.params.id;
  if (!movieId) return;

  try {
    const response = await $axios.get(`/movie/${movieId}`);
    movieData.value = response.data;
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
};

onMounted(() => {
  fetchMovieData();
});
</script>