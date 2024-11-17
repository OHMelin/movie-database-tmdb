<template>
  <div class="wrapper">
    <h1 class="font-bold text-2xl mt-5 mb-2">{{ genreName.name }} movies - ({{ movieListTotal.total_results }} total)</h1>
    <div class="flex flex-wrap justify-center">
      <NuxtLink v-for="movie in movieListData" :key="movie.id" :to="'/movies/' + movie.id" class="m-2 w-[200px]">
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
    </div>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="500"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';

const movieListData = ref([]);
const movieListTotal = ref(0);
const genreData = ref([]);
const genreName = ref("None");
const page = ref(1);

const route = useRoute();
const router = useRouter();
const { $axios } = useNuxtApp();

watch(page, (newPage) => {
  router.replace({ query: { ...route.query, page: newPage } });
  fetchMovieListData();
  window.scrollTo(0, 0);
});

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
    genreName.value = genreData.value.find((genre) => genre.id === Number(genreId));
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
};

onMounted(() => {
  const queryPage = Number(route.query.page) || 1;
  page.value = queryPage;
  fetchMovieListData();
});
</script>
