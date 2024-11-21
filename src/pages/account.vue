<template>
  <div class="wrapper" v-if="account">
    <h1 class="font-bold text-3xl mb-5">{{ account.username }}'s profile</h1>
    <h2 class="font-bold text-2xl mt-5">Movie watchlist</h2>
    <div v-if="loading">
      <v-skeleton-loader type="card" height="375"></v-skeleton-loader>
    </div>
    <v-sheet v-if="!loading">
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
            <v-btn color="red" class="w-full" @click="handleRemoveFromWatchlistDialog(item.id, 'movie')">Remove</v-btn>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
    <h2 class="font-bold text-2xl mt-5">Series watchlist</h2>
    <div v-if="loading">
      <v-skeleton-loader type="card" height="375"></v-skeleton-loader>
    </div>
    <v-sheet v-if="!loading">
      <v-slide-group mobile>
        <v-slide-group-item
          v-for="item in seriesWatchList.data.results"
          :key="item.id"
        >
          <div class="flex flex-col m-2">
            <NuxtLink :to="'/series/' + item.id" class="w-[200px]">
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
              <p class="whitespace-nowrap text-ellipsis overflow-hidden text-sm mt-1">{{ item.name }}</p>
            </NuxtLink>
            <v-btn color="red" class="w-full" @click="handleRemoveFromWatchlistDialog(item.id, 'tv')">Remove</v-btn>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
  <v-dialog v-model="dialog" width="400">
    <v-card
      title="Confirm delete"
      prepend-icon="mdi-delete"
      text="Are you sure you want to delete this movie from your watchlist?"
    >
      <template v-slot:actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn color="red" @click="handleRemoveFromWatchlist(itemRef, contentType)">Confirm delete</v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.visible" :color="snackbar.type" :timeout="3000">
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authenticate, getAccountData, getMovieWatchlist, getSeriesWatchlist, removeMovieFromWatchlist, removeSeriesFromWatchlist } from '@/services/tmdb.service';

const movieWatchList = ref({ data: { results: [] } });
const seriesWatchList = ref({ data: { results: [] } });
const account = ref();
const loading = ref(true);

const dialog = ref(false);
const itemRef = ref();
const contentType = ref();

const snackbar = ref({
  visible: false,
  message: '',
  type: '',
});

const handleRemoveFromWatchlistDialog = async (itemId, type) => {
  dialog.value = true;
  itemRef.value = itemId;
  contentType.value = type;
}

const handleRemoveFromWatchlist = async (itemId, contentType) => {
  dialog.value = false;
  showSnackbar('Removed from your watchlist', 'red');

  if (contentType === 'movie') {
    await removeMovieFromWatchlist(itemId);
  } else if (contentType === 'tv') {
    await removeSeriesFromWatchlist(itemId);
  }

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
  loading.value = false;
};

const showSnackbar = (message, type) => {
  snackbar.value.message = message;
  snackbar.value.type = type;
  snackbar.value.visible = true;
};

onMounted(async () => {
  await fetchAccountData();
  if (account.value) {
    await fetchWatchlists();
  }
});
</script>
