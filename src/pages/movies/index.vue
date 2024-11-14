<template>
  <div class="wrapper">
    <div class="flex justify-center">
      <h1 class="font-bold text-3xl">Find Tonights Movie</h1>
    </div>
    <div v-for="genre in genreListData" :key="genre.id">
      <p>{{ genre.name }} - (<NuxtLink :to="'/movies/genre/' + genre.id">{{ genre.totalMovies }} movies in this genre</NuxtLink>)</p>
      <div v-for="movie in genre.movies" :key="movie.id">
        <nuxtLink :to="'/movies/' + movie.id">{{ movie.title }}</nuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const genreListData = ref([]);
const { $axios } = useNuxtApp();

const fetchGenreListData = async () => {
  try {
    const response = await $axios.get(`/genre/movie/list`);
    const genres = response.data.genres;
    genreListData.value = await Promise.all(genres.map(async (genre) => {
      const movieResponse = await $axios.get(`/discover/movie`, {
        params: {
          with_genres: genre.id,
        },
      });
      genre.movies = movieResponse.data.results;
      genre.totalMovies = movieResponse.data.total_results;
      return genre;
    }));
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
};

onMounted(() => {
  fetchGenreListData();
});
</script>
