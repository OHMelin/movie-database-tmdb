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
        <img
          class="rounded-sm w-[200px] h-[300px]"
          :src="`https://image.tmdb.org/t/p/w200${movieData.poster_path}`"
          :alt="movieData.title + ' movie poster'"
        />
      </div>
    </div>
  </div>
  <div v-if="movieData" class="wrapper">
    <h2 class="font-bold text-2xl">Trailer</h2>
    <div class="iframe-container">
      <iframe
        class="responsive-iframe rounded-md"
        v-if="trailer.results[0].key"
        :src="`https://www.youtube.com/embed/${trailer.results[0].key}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        height="100%"
      ></iframe>
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
              color="grey-lighten-1"
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
              color="grey-lighten-1"
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
const { $axios } = useNuxtApp();

const movieData = ref(null);
const backdropImage = ref(null);
const trailer = ref(null);
const cast = ref(null);
const directors = ref(null);

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
}
</style>
