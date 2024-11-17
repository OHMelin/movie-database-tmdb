<template>
  <v-toolbar class="bg-wexo">
    <div class="flex gap-3">
      <div class="m-auto ml-5">
        <NuxtLink to="/">
          <v-icon>mdi-filmstrip</v-icon>
          WMDB
        </NuxtLink>
        
      </div>
      <v-btn color="slate" variant="flat" to="/movies">Movies</v-btn>
      <v-btn color="slate" variant="flat" to="/series">Series</v-btn>
    </div>
    <v-toolbar-title></v-toolbar-title>
    
    <v-spacer></v-spacer>
    <v-btn icon="mdi-account" to="/account"></v-btn>
  </v-toolbar>
</template>
