<template>
  <div class="outer-wrapper">
    <v-parallax
      src="@/assets/series_hero.webp"
      width="100%"
      class="backdrop items-center h-[500px] bg-wexo"
    >
      <div class="gradient-overlay"></div>
      <div class="wrapper parallex-wrapper text-white text-center">
        <div>
          <h1 class="font-bold text-5xl">Find Your Next Series</h1>
          <v-btn color="slate" class="mt-5" to="/movies">Or movie..</v-btn>
        </div>
      </div>
    </v-parallax>
  </div>
  <div class="wrapper" v-if="loading">
    <div v-for="n in 5" :key="'skeleton-' + n">
      <v-skeleton-loader type="text"></v-skeleton-loader>
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
  </div>
  <div class="wrapper" v-if="!loading">
    <div v-for="genre in data" :key="genre.id">
      <h2 class="font-bold text-2xl mt-5 mb-2"><NuxtLink :to="'/series/genre/' + genre.id">{{ genre.name }} series - ({{ genre.total_series }} total)</NuxtLink></h2>
      <v-sheet>
        <v-slide-group mobile>
          <v-slide-group-item
            v-for="series in genre.series"
            :key="series.id"
          >
            <NuxtLink :to="'/series/' + series.id" class="m-2 w-[200px]">
              <v-card
                color="wexo"
                height="300"
                width="200"
                :style="{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w200${series.poster_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }"
              >
              </v-card>
              <p class="whitespace-nowrap text-ellipsis overflow-hidden text-sm mt-1">{{ series.name }}</p>
            </NuxtLink>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllSeriesData } from '@/services/tmdb.service.js'

const data = ref([]);
const loading = ref(true);

onMounted(async() => {
  data.value = await getAllSeriesData();
  loading.value = false;
});
</script>

<style scoped>
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75));
}

.parallex-wrapper {
  margin: auto;
  position: relative;
}
</style>
