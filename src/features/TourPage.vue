<template>
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
    <div class="br br_75"></div>
    <h2 class="gallery-title">Фотографии внутри завода</h2>
    <FactoryGallery :images="factoryImages" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PanoramaViewer from '@/components/PanoramaViewer.vue'
import FactoryGallery from '@/components/FactoryGallery.vue'

const panoramas = [
  { file: '1.jpg', label: 'Музей 1' },
  { file: '2.jpg', label: 'Музей 2' },
  { file: '3.jpg', label: 'Здание Администрации' },
  { file: '4.jpg', label: 'Аллея' },
  { file: '5.jpg', label: 'Вход (памятник)' },
  { file: '6.jpg', label: 'Проходная' },
  { file: '7.jpg', label: 'Ремонтно-механический цех' },
  { file: '8.jpg', label: 'Цех 4' },
  { file: '9.jpg', label: 'Цех 5' },
  { file: '10.jpg', label: 'Цех 7' },
  { file: '11.jpg', label: 'Зона погрузки 1' },
  { file: '12.jpg', label: 'Зона погрузки 2' },
  { file: '13.jpg', label: 'Зона погрузки 3' },
  { file: '14.jpg', label: 'Зона погрузки 4' },
]
const currentIdx = ref(0)
const currentPanoramaUrl = computed(() => `/images/panoram/${panoramas[currentIdx.value].file}`)

function selectPanorama(idx: number) {
  currentIdx.value = idx
}

// Список фотографий цехов из public/images/factory
const factoryImages = [
  '/images/factory/IMG_3729.JPG',
  '/images/factory/IMG_3730.JPG',
  '/images/factory/IMG_3732.JPG',
  '/images/factory/IMG_3733.JPG',
  '/images/factory/IMG_3734.JPG',
  '/images/factory/IMG_3735.JPG',
  '/images/factory/IMG_3736.JPG',
  '/images/factory/IMG_3737.JPG',
  '/images/factory/IMG_3740.JPG',
  '/images/factory/IMG_3744.JPG',
  '/images/factory/IMG_3746.JPG',
  '/images/factory/IMG_3747.JPG',
  '/images/factory/IMG_3748.JPG',
  '/images/factory/IMG_3751.JPG',
  '/images/factory/IMG_3752.JPG',
  '/images/factory/IMG_3753.JPG',
]
</script>

<style scoped>
.gallery-title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a2248;
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
