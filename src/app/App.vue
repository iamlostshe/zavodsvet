<script setup lang="ts">
import Footer from '@/features/Footer.vue'
import Header from '@/features/Header.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <div class="standart-page">
    <RouterView />
  </div>
  <Footer />

</template>

<style>
  .standart-page {
    max-width: 1312px;
    margin: 0 auto;
    padding: 32px 16px;
  }
</style>
