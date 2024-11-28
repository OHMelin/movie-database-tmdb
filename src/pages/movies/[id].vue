<template>
  <div class="outer-wrapper">
    <v-parallax
      :src="`https://image.tmdb.org/t/p/original${data.backdrop_image}`"
      width="100%"
      class="backdrop items-center h-[500px] bg-main"
    >
      <div class="gradient-overlay"></div>
      <div class="wrapper text-white" v-if="!loading">
        <div v-if="data" class="flex gap-5 justify-between" id="hero-container">
          <div>
            <h1 class="font-bold text-3xl mb-5">{{ data.movie.title }}</h1>
            <p>{{ data.movie.overview }}</p>
            <p class="mt-5 mb-2 text-lg">Release: {{ data.movie.release_date }}</p>
            <div class="flex gap-1 flex-wrap">
              <v-chip v-for="genre in data.movie.genres" :key="genre">{{ genre.name }}</v-chip>
            </div>
          </div>
          <div class="flex flex-col gap-3" id="poster-container">
            <div class="w-[200px] h-[300px] bg-main rounded-md">
              <img
                class="rounded-sm"
                :src="`https://image.tmdb.org/t/p/w200${data.movie.poster_path}`"
                :alt="data.title + ' movie poster'"
              />
            </div>
            <v-btn color="slate" class="w-[200px] mt-3" @click="addToWatchlist(data.movie.id)">Add to watchlist</v-btn>
          </div>
        </div>
      </div>
    </v-parallax>
  </div>
  <div v-if="data" class="wrapper">
    <h2 class="font-bold text-2xl mt-5" v-if="data.trailer?.results?.length">Trailer</h2>
    <div v-if="loading">
      <v-skeleton-loader type="card" height="375"></v-skeleton-loader>
    </div>
    <div v-if="data.trailer?.results?.length">
      <div class="iframe-container">
        <iframe
          class="responsive-iframe rounded-md"
          :src="`https://www.youtube.com/embed/${data.trailer?.results[0]?.key}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
          allowfullscreen
          height="100%"
        ></iframe>
      </div>
    </div>

    <h2 class="font-bold text-2xl mt-5">Actors</h2>
    <div v-if="loading">
      <v-skeleton-loader type="card" height="375"></v-skeleton-loader>
    </div>
    <v-sheet max-width="100%" v-if="!loading">
      <v-slide-group mobile>
        <v-slide-group-item
          v-for="actor in data.cast"
          :key="actor.id"
        >
          <div class="m-2 w-[200px]">
            <v-card
              color="main"
              height="300"
              width="200"
              :style="{
                backgroundImage: `url(https://image.tmdb.org/t/p/w200${actor.profile_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }"
            >
            </v-card>
            <p class="whitespace-nowrap text-ellipsis overflow-hidden text-sm mt-1">{{ actor.name }}</p>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>

    <h2 class="font-bold text-2xl mt-5">Directors</h2>
    <div v-if="loading">
      <v-skeleton-loader type="card" height="375"></v-skeleton-loader>
    </div>
    <v-sheet max-width="100%" v-if="!loading">
      <v-slide-group mobile>
        <v-slide-group-item
          v-for="director in data.directors"
          :key="director.id"
        >
          <div class="m-2 w-[200px]">
            <v-card
              color="main"
              height="300"
              width="200"
              :style="{
                backgroundImage: `url(https://image.tmdb.org/t/p/w200${director.profile_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }"
            >
            </v-card>
            <p class="whitespace-nowrap text-ellipsis overflow-hidden text-sm mt-1">{{ director.name }}</p>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.type" :timeout="3000">
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from '#app';
import { authenticate, addMovieToWatchlist, getSpecificMovieData } from '@/services/tmdb.service.js';

const route = useRoute();
const loading = ref(true);

const snackbar = ref({
  visible: false,
  message: '',
  type: '',
});

const data = ref({
  movie: [],
  backdrop_image: "",
  trailer: "",
  cast: [],
  directors: [],
})

const addToWatchlist = async (movieId) => {
  if (await authenticate()) {
    await addMovieToWatchlist(movieId)
    showSnackbar('Added to your watchlist', 'green');
  }
};

const showSnackbar = (message, type) => {
  snackbar.value.message = message;
  snackbar.value.type = type;
  snackbar.value.visible = true;
};

onMounted(async () => {
  data.value = await getSpecificMovieData(route.params.id);
  loading.value = false;
});
</script>

<style scoped>
.backdrop {
  background-position: center;
  background-size: cover;
}

.iframe-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75));
}

.wrapper {
  margin: auto;
  position: relative;
}

@media screen and (max-width: 640px) {
  #hero-container {
    flex-wrap: wrap;
  }

  #poster-container {
    width: 100%;
    align-items: center;
  }

  .backdrop {
    height: 100%;
  }
}
</style>
