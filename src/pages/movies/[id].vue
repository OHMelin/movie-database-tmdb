<template>
  <div
    class="outer-wrapper backdrop"
    :style="{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
      url(https://image.tmdb.org/t/p/original${backdropImage})` }"
    >
    <div class="wrapper text-white">
      <div v-if="movieData" class="flex gap-5" id="hero-container">
        <div>
          <h1 class="font-bold text-3xl mb-5">{{ movieData.title }}</h1>
          <p>{{ movieData.overview }}</p>
          <p class="mt-5 mb-2 text-lg">Release: {{ movieData.release_date }}</p>
          <div class="flex gap-1 flex-wrap">
            <v-chip v-for="genre in movieData.genres" :key="genre">{{ genre.name }}</v-chip>
          </div>
        </div>
        <div class="flex flex-col gap-3" id="poster-container">
          <div class="w-[200px] h-[300px]">
            <img
              class="rounded-sm"
              :src="`https://image.tmdb.org/t/p/w200${movieData.poster_path}`"
              :alt="movieData.title + ' movie poster'"
            />
            <v-btn color="slate" class="w-full mt-3" @click="addMovieToWatchlist(movieData.id)">Add to watchlist</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="movieData" class="wrapper">
    <div v-if="trailer?.results?.length">
      <h2 class="font-bold text-2xl mt-5">Trailer</h2>
      <div class="iframe-container">
        <iframe
          class="responsive-iframe rounded-md"
          :src="`https://www.youtube.com/embed/${trailer?.results[0]?.key}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
          allowfullscreen
          height="100%"
        ></iframe>
      </div>
    </div>

    <h2 class="font-bold text-2xl mt-5">Actors</h2>
    <v-sheet max-width="100%">
      <v-slide-group mobile>
        <v-slide-group-item
          v-for="actor in cast"
          :key="actor.id"
        >
          <div class="m-2 w-[200px]">
            <v-card
              color="wexo"
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
    <v-sheet max-width="100%">
      <v-slide-group mobile>
        <v-slide-group-item
          v-for="director in directors"
          :key="director.id"
        >
          <div class="m-2 w-[200px]">
            <v-card
              color="wexo"
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useRoute } from '#app';

const route = useRoute();
const approved = route.query.approved === 'true';
const requestToken = route.query.request_token;

const { $axios } = useNuxtApp();

const movieData = ref(null);
const backdropImage = ref(null);
const trailer = ref(null);
const cast = ref(null);
const directors = ref(null);

const addMovieToWatchlist = async (movieId) => {
  const sessionId = localStorage.getItem('session_id');

  if (sessionId) {
    console.log("ADDED TO WATCHLIST")
  } else if (approved && requestToken) {
    const sessionResponse = await $axios.post(`/authentication/session/new`, { request_token: requestToken });
    const newSessionId = sessionResponse.data.session_id;
    localStorage.setItem('session_id', newSessionId);
  } else {
    const tokenResponse = await $axios.get(`/authentication/token/new`);
    const token = tokenResponse.data.request_token;
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:3000/movies/${movieId}`;
  }
};

const fetchMovieData = async () => {
  const movieId = route.params.id;
  if (!movieId) return;

  try {
    const movieResponse = await $axios.get(`/movie/${movieId}`);
    movieData.value = movieResponse.data;
    backdropImage.value = movieData.value.backdrop_path;

    const trailerResponse = await $axios.get(`/movie/${movieId}/videos`);
    trailer.value = trailerResponse.data;

    const castResponse = await $axios.get(`/movie/${movieId}/casts`);
    cast.value = castResponse.data.cast;

    const creditsResponse = await $axios.get(`/movie/${movieId}/credits`);
    directors.value = creditsResponse.data.crew.filter(person => person.job === "Director");
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

@media screen and (max-width: 640px) {
  #hero-container {
    flex-wrap: wrap;
  }

  #poster-container {
    width: 100%;
    align-items: center;
  }
}
</style>
