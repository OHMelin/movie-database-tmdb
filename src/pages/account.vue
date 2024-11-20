<template>
  <div class="wrapper" v-if="account">
    <h1 class="font-bold text-3xl mb-5">{{ account.username }}'s profile</h1>
    <h2 class="font-bold text-2xl mt-5">Movie watchlist</h2>
    <v-sheet>
      <v-slide-group mobile>
        <v-slide-group-item
          v-for="item in movieWatchList.data.results"
          :key="item.id"
        >
          <div class="flex flex-col m-2">
            <NuxtLink :to="'/movies/' + item.id" class="w-[200px]">
              <v-card
                color="wexo"
                height="300"
                width="200"
                :style="{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w200${item.poster_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }"
              >
              </v-card>
              <p class="whitespace-nowrap text-ellipsis overflow-hidden text-sm mt-1">{{ item.title }}</p>
            </NuxtLink>
            <v-btn color="red" class="w-full" @click="handleRemoveFromWatchlist(item.id)">Remove</v-btn>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <h2 class="font-bold text-2xl mt-5">Series watchlist</h2>
    <p v-for="item in seriesWatchList.data.results" :key="item.id">{{ item.title }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authenticate, getAccountData, getMovieWatchlist, getSeriesWatchlist, removeFromWatchlist } from '@/services/tmdb.service';

const movieWatchList = ref({ data: { results: [] } });
const seriesWatchList = ref({ data: { results: [] } });
const account = ref();

const handleRemoveFromWatchlist = async (itemId) => {
  await removeFromWatchlist(itemId)
  await fetchWatchlists();
}

const fetchAccountData = async () => {
  account.value = await getAccountData();
  if (!account.value) {
    await authenticate();
    account.value = await getAccountData();
  }
};

const fetchWatchlists = async () => {
  movieWatchList.value = await getMovieWatchlist();
  seriesWatchList.value = await getSeriesWatchlist();
};

onMounted(async () => {
  await fetchAccountData();
  if (account.value) {
    await fetchWatchlists();
  }
});
</script>
