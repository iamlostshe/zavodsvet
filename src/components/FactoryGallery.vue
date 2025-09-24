<template>
  <div class="factory-gallery">
    <ul class="masonry">
      <li v-for="(url, idx) in images" :key="idx" class="masonry__item">
        <img :src="url" :alt="`Фотография завода ${idx + 1}`" loading="lazy" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  images: string[]
}

defineProps<Props>()
</script>

<style scoped>
.factory-gallery {
  margin-top: 32px;
}

/* Masonry (Pinterest-like) using CSS columns */
.masonry {
  column-gap: 16px;
  /* desktop default */
  columns: 4 280px;
}

@media (max-width: 1200px) {
  .masonry {
    columns: 3 260px;
  }
}

@media (max-width: 900px) {
  .masonry {
    columns: 2 240px;
  }
}

@media (max-width: 560px) {
  .masonry {
    columns: 1 100%;
  }
}

.masonry__item {
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  margin-bottom: 16px;
}

.masonry__item img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  background: #f7f7f7;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.masonry__item img:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Accent border using brand color */
.masonry__item img {
  border: 2px solid rgba(219, 42, 74, 0.08);
}

.masonry__item img:hover {
  border-color: rgba(219, 42, 74, 0.25);
}
</style>

