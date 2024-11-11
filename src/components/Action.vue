<template>
  <component
    class="bg-green-600 rounded px-2 py-1 text-white"
    :is="to ? NuxtLink: 'button'"
    :to="to"
  >
    {{ buttonText }}
  </component>
</template>

<script setup>
import { NuxtLink } from '#components';

const props = defineProps({
  buttonText: {
    type: String,
    default: 'Click me',
  },
  to: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>

</style>
