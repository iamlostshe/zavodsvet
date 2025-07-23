<template>
  <div class="tour-page">
    <h1>Экскурсия по заводу</h1>
    <div class="panorama-switcher">
      <button
        v-for="(p, idx) in panoramas"
        :key="p.file"
        :class="['panorama-btn', { active: idx === currentIdx }]"
        @click="selectPanorama(idx)"
      >
        {{ p.label }}
      </button>
    </div>
    <PanoramaViewer :image-url="currentPanoramaUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PanoramaViewer from '@/components/PanoramaViewer.vue'

const panoramas = [
  { file: 'PANO_20250723_030927.jpg', label: 'Музей 1' },
  { file: 'PANO_20250723_031503.jpg', label: 'Музей 2' },
  { file: 'PANO_20250712_185003.jpg', label: 'Здание Администрации' },
  { file: 'PANO_20250723_004904.jpg', label: 'Вход (памятник)' },
  { file: 'PANO_20250712_191349.jpg', label: 'Проходная' },
  { file: 'PANO_20250723_004125.jpg', label: 'Цех № 4' },
  { file: 'PANO_20250723_004625.jpg', label: 'Ремонтно-механический цех' },
  { file: 'PANO_20250723_010125.jpg', label: 'Зона погрузки 1' },
  { file: 'PANO_20250723_011104.jpg', label: 'Зона погрузки 2' },
  { file: 'PANO_20250723_011538.jpg', label: 'Зона погрузки 3' },
  { file: 'PANO_20250723_011822.jpg', label: 'Цех № 5' },
  { file: 'PANO_20250723_012101.jpg', label: 'Зона погрузки 4' },
  { file: 'PANO_20250723_014124.jpg', label: 'Тяжелые 1' },
  { file: 'PANO_20250723_015108.jpg', label: 'Тяжелые 2' },
  { file: 'PANO_20250723_022713.jpg', label: 'Тяжелые 3' },
]
const currentIdx = ref(0)
const currentPanoramaUrl = computed(() => `/images/panoram/${panoramas[currentIdx.value].file}`)

function selectPanorama(idx: number) {
  currentIdx.value = idx
}
</script>

<style scoped>
.tour-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 16px;
}
.panorama-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.panorama-btn {
  background: #db2a4a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.panorama-btn.active,
.panorama-btn:hover {
  background: #a81e36;
}
</style>
