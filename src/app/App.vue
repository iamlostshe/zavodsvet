<script setup lang="ts">
import Footer from '@/features/Footer.vue'
import Header from '@/features/Header.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <RouterView />
  <Footer />
</template>
