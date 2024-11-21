<template>
  <div class="outer-container">
    <div>
      <Header />
      <div class="slot-container">
        <slot />
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.slot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
