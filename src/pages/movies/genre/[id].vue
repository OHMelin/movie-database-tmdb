<template>
  <div class="wrapper">
    <h1 class="font-bold text-3xl">All movies with the {{ genreName.name }} genre</h1>
    <p>Total movies with this genre: {{ movieListTotal.total_results }}</p>
    <div v-for="movie in movieListData" :key="movie.id">
      <NuxtLink :to="'/movies/' + movie.id">{{ movie.title }}</NuxtLink>
    </div>
    <v-btn @click="nextPage()">Next</v-btn>
    <v-btn v-if="page > 1" @click=previousPage()>Previous</v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useRoute } from '#app';

const movieListData = ref([]);
const movieListTotal = ref(0);
const genreData = ref([])
const genreName = ref("None");
const page = ref(1);
const route = useRoute();
const { $axios } = useNuxtApp();

const nextPage = async () => {
  page.value = page.value + 1
  fetchMovieListData()
}

const previousPage = async () => {
  page.value = page.value - 1
  fetchMovieListData()
}

const fetchMovieListData = async () => {
  const genreId = route.params.id;
  if (!genreId) return;

  try {
    const response = await $axios.get(`/discover/movie`, {
      params: {
        with_genres: genreId,
        page: page.value,
      },
    });
    movieListTotal.value = response.data;
    movieListData.value = response.data.results;

    const response2 = await $axios.get(`/genre/movie/list`);
    genreData.value = response2.data.genres;
    genreName.value = genreData.value.find(genre => genre.id === Number(genreId));
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
};

onMounted(() => {
  fetchMovieListData();
});
</script>
