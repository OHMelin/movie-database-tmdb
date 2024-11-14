<template>
  <div class="wrapper">
    <h1 class="font-bold text-3xl">All movies with the X genre</h1>
    <div v-for="movie in movieListData" :key="movie.id">
      <NuxtLink :to="'/movies/' + movie.id">{{ movie.title }}</NuxtLink>
    </div>
    <p>{{ page }}</p>
    <v-btn @click="nextPage()">Next</v-btn>
    <v-btn v-if="page > 1" @click=previousPage()>Previous</v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useRoute } from '#app';

const movieListData = ref([]);
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
  console.log(page.value)
  const genreId = route.params.id;
  if (!genreId) return;

  try {
    const response = await $axios.get(`/discover/movie`, {
      params: {
        with_genres: genreId,
        page: page.value,
      },
    });
    movieListData.value = response.data.results;
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
};

onMounted(() => {
  fetchMovieListData();
});
</script>
