<template>
  <div class="wrapper" v-if="loading">
    <v-skeleton-loader v-for="n in 5" :key="'skeleton-' + n" type="card"></v-skeleton-loader>
  </div>
  <div class="wrapper" v-if="!loading">
    <h1 class="font-bold text-2xl mt-5 mb-2">{{ data.genre_name }} movies - ({{ data.total_movies }} total)</h1>
    <div class="flex flex-wrap justify-center">
      <NuxtLink v-for="movie in data.movies" :key="movie.id" :to="'/movies/' + movie.id" class="m-2 w-[200px]">
        <v-card
          color="main"
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
import { getMovieGenreData } from '@/services/tmdb.service.js'

const data = ref({})
const page = ref(1);
const loading = ref(true);

const route = useRoute();
const router = useRouter();

watch(page, (newPage) => {
  const fetchData = async () => {
    loading.value = true;
    router.replace({ query: { ...route.query, page: newPage } });
    data.value = await getMovieGenreData(route.params.id, newPage);
    window.scrollTo(0, 0);
    loading.value = false;
  };

  fetchData();
});

onMounted(async() => {
  const queryPage = Number(route.query.page) || 1;
  page.value = queryPage;
  data.value = await getMovieGenreData(route.params.id, route.query.page);
  loading.value = false;
});
</script>
