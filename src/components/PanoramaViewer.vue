<template>
  <div class="panorama-viewer">
    <div v-if="props.imageUrl" :id="viewerId" class="panorama-canvas"></div>
    <div v-else class="panorama-placeholder">Выберите панораму для просмотра</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { nanoid } from 'nanoid'

// Типизация pannellum для TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
interface Pannellum {
  viewer: (id: string, config: any) => any
}
declare global {
  interface Window {
    pannellum?: Pannellum
  }
}

const props = defineProps<{ imageUrl: string }>()
const viewerId = `pannellum_${nanoid()}`
let viewerInstance: any = null

function loadPannellum(cb: () => void) {
  if (window.pannellum) return cb()
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
  script.onload = cb
  document.head.appendChild(script)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
  document.head.appendChild(link)
}

function showPanorama(url: string) {
  if (!window.pannellum || !url) return
  // Очищаем контейнер перед инициализацией
  const container = document.getElementById(viewerId)
  if (container) container.innerHTML = ''
  // Не вызываем destroy, просто пересоздаем viewer
  viewerInstance = window.pannellum.viewer(viewerId, {
    type: 'equirectangular',
    panorama: url,
    autoLoad: true,
    showZoomCtrl: true,
    showFullscreenCtrl: true,
    compass: false,
    hotSpots: [],
  })
}

onMounted(() => {
  if (props.imageUrl) loadPannellum(() => showPanorama(props.imageUrl))
})

watch(
  () => props.imageUrl,
  (url) => {
    if (window.pannellum && url) showPanorama(url)
  },
)

onBeforeUnmount(() => {
  // Очищаем контейнер при размонтировании
  const container = document.getElementById(viewerId)
  if (container) container.innerHTML = ''
  viewerInstance = null
})
</script>

<style scoped>
.panorama-viewer {
  width: 100%;
  min-height: 400px;
  margin: 0 auto 32px auto;
}
.panorama-canvas {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  background: #222;
}
.panorama-placeholder {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  background: #222;
  border-radius: 12px;
  font-size: 20px;
}
</style>
