<template>
  <div class="wrapper">
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
            <v-btn color="red" class="w-full" @click="removeFromWatchlist(item.id)">Remove</v-btn>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <h2 class="font-bold text-2xl mt-5">Series watchlist</h2>
    <p v-for="item in seriesWatchList.data.results" :key="item.id">{{ item.title }}</p>
  </div>
</template>

<script setup>
import { getAccountData, getMovieWatchlist, getSeriesWatchlist, removeFromWatchlist } from '@/services/tmdb.service';

const account = await getAccountData();
const movieWatchList = await getMovieWatchlist();
const seriesWatchList = await getSeriesWatchlist();
</script>
