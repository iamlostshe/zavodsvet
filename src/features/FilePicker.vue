<script lang="ts">
export default {
  props: {
    filename: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <a class="file_picker_wrapper" :href="filename" target="_blank">
    <img src="/images/pdf_ico.png" width="25" height="25" alt="pdf" />
    {{ title }}
  </a>
</template>

<style>
img {
  object-fit: contain;
}
.file_picker_wrapper {
  display: flex;
  gap: 0.5rem;
  padding: 10px;
}
</style>
