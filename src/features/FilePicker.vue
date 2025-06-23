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
  <img src="/images/pdf_ico.png" width="25" height="25" alt="pdf" />
  <a :href="filename" target="_blank">{{ title }}</a>
</template>
