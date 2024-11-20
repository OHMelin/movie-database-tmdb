<template>
  <div class="outer-wrapper">
    <div class="wrapper">
      <div>
        <h1 class="font-bold text-5xl">Find Tonight's Movie</h1>
        <v-btn color="slate" class="mt-5" to="/series">Or series..</v-btn>
      </div>
    </div>
  </div>
  <div class="wrapper" v-if="loading">
    <div v-for="n in 5" :key="'skeleton-' + n">
      <v-skeleton-loader type="text"></v-skeleton-loader>
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
  </div>
  <div class="wrapper" v-if="!loading">
    <div v-for="genre in genreListData" :key="genre.id">
      <h2 class="font-bold text-2xl mt-5 mb-2"><NuxtLink :to="'/movies/genre/' + genre.id">{{ genre.name }} movies - ({{ genre.totalMovies }} total)</NuxtLink></h2>
      <v-sheet>
        <v-slide-group mobile>
          <v-slide-group-item
            v-for="movie in genre.movies"
            :key="movie.id"
          >
            <NuxtLink :to="'/movies/' + movie.id" class="m-2 w-[200px]">
              <v-card
                color="wexo"
                height="300"
                width="200"
                :style="{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w200${movie.poster_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }"
              >
              </v-card>
              <p class="whitespace-nowrap text-ellipsis overflow-hidden text-sm mt-1">{{ movie.title }}</p>
            </NuxtLink>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const genreListData = ref([]);
const { $axios } = useNuxtApp();
const loading = ref(true);

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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGenreListData();
});
</script>

<style scoped>
.outer-wrapper {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
    url('../../assets/test.webp');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;
  padding: 5rem;
}
</style>
