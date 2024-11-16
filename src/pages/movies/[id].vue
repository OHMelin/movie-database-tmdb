<template>
  <div class="outer-wrapper backdrop" :style="{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://image.tmdb.org/t/p/original${backdropImage})` }">
    <div class="wrapper text-white">
      <div v-if="movieData" class="flex gap-1">
        <div>
          <h1 class="font-bold text-3xl mb-4">{{ movieData.title }}</h1>
          <p>{{ movieData.overview }}</p>
        </div>
        <img :src="`https://image.tmdb.org/t/p/w200${movieData.poster_path}`" :alt="movieData.title + ' movie poster'" />
      </div>
    </div>
  </div>
  <div class="wrapper">
    <p>{{ movieData }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useRoute } from '#app';

const movieData = ref(null);
const backdropImage = ref(null);
const route = useRoute();
const { $axios } = useNuxtApp();

const fetchMovieData = async () => {
  const movieId = route.params.id;
  if (!movieId) return;

  try {
    const response = await $axios.get(`/movie/${movieId}`);
    movieData.value = response.data;
    backdropImage.value = movieData.value.backdrop_path;
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
};

onMounted(() => {
  fetchMovieData();
});
</script>

<style scoped>
.backdrop {
  background-position: center;
  background-size: cover;
}
</style>
