<template>
  <div class="carousel-container" :class="containerClass">
    <div class="carousel" ref="carouselRef">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
          :class="[slide.className, { 'carousel-slide--active': currentIndex === index }]"
        >
          <!-- Слот для кастомного контента слайда -->
          <slot
            name="slide-content"
            :slide="slide"
            :index="index"
            :isActive="currentIndex === index"
          >
            <!-- Fallback контент -->
            <div v-if="slide.content" v-html="slide.content"></div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Навигационные стрелки -->
    <button
      v-if="showArrows"
      class="carousel-arrow carousel-arrow--prev"
      :class="arrowsClass"
      @click="prevSlide"
      aria-label="Предыдущий слайд"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <button
      v-if="showArrows"
      class="carousel-arrow carousel-arrow--next"
      :class="arrowsClass"
      @click="nextSlide"
      aria-label="Следующий слайд"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Индикаторы -->
    <div v-if="showIndicators" class="carousel-indicators" :class="indicatorsClass">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-indicator"
        :class="{ 'carousel-indicator--active': currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`Перейти к слайду ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Slide {
  id?: string | number
  className?: string
  content?: string
  [key: string]: any
}

interface CarouselConfig {
  height?: string
  maxWidth?: string
  margin?: string
  arrowsPosition?: 'top' | 'bottom'
  arrowsOffset?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  indicatorsPosition?: 'top' | 'bottom'
  indicatorsOffset?: string
}

const props = defineProps<{
  slides: Slide[]
  autoplay?: boolean
  autoplayInterval?: number
  showArrows?: boolean
  showIndicators?: boolean
  config?: CarouselConfig
  containerClass?: string
  arrowsClass?: string
  indicatorsClass?: string
}>()

const emit = defineEmits<{
  slideChange: [index: number]
  slideClick: [slide: Slide, index: number]
}>()

const carouselRef = ref<HTMLElement>()
const currentIndex = ref(0)
const autoplayTimer = ref<number | null>(null)

const nextSlide = () => {
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  emit('slideChange', currentIndex.value)
  resetAutoplay()
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.slides.length - 1
  }
  emit('slideChange', currentIndex.value)
  resetAutoplay()
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  emit('slideChange', currentIndex.value)
  resetAutoplay()
}

const startAutoplay = () => {
  if (props.autoplay && props.autoplayInterval) {
    autoplayTimer.value = window.setInterval(() => {
      nextSlide()
    }, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

const handleMouseEnter = () => {
  if (props.autoplay) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  if (props.autoplay) {
    startAutoplay()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      prevSlide()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextSlide()
      break
    case 'Home':
      event.preventDefault()
      goToSlide(0)
      break
    case 'End':
      event.preventDefault()
      goToSlide(props.slides.length - 1)
      break
  }
}

const handleSlideClick = (slide: Slide, index: number) => {
  emit('slideClick', slide, index)
}

onMounted(() => {
  if (carouselRef.value) {
    carouselRef.value.addEventListener('mouseenter', handleMouseEnter)
    carouselRef.value.addEventListener('mouseleave', handleMouseLeave)
    carouselRef.value.addEventListener('keydown', handleKeydown)
    carouselRef.value.setAttribute('tabindex', '0')
  }

  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()

  if (carouselRef.value) {
    carouselRef.value.removeEventListener('mouseenter', handleMouseEnter)
    carouselRef.value.removeEventListener('mouseleave', handleMouseLeave)
    carouselRef.value.removeEventListener('keydown', handleKeydown)
  }
})

// Экспортируем методы для внешнего использования
defineExpose({
  nextSlide,
  prevSlide,
  goToSlide,
  currentIndex: computed(() => currentIndex.value),
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1312px;
  margin: 20px auto 0 auto;
  height: 729px;
  overflow: hidden;
}

.carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  background-position: -130px bottom;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #92285a;
  transition: all 1s;
}

.carousel-slide--active {
  z-index: 2;
}

/* Стрелки навигации */
.carousel-arrow {
  position: absolute;
  top: 24px;
  z-index: 10;
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #92285a;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-arrow:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.carousel-arrow--prev {
  right: 104px;
}

.carousel-arrow--next {
  right: 40px;
}

/* Индикаторы */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.carousel-indicator {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.carousel-indicator--active {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}

/* Адаптивность */
@media only screen and (min-width: 319px) and (max-width: 640px) {
  .carousel-container {
    margin: 15px auto 0 auto;
    height: 490px;
  }

  .carousel-arrow {
    top: 183px;
    width: 40px;
    height: 40px;
  }

  .carousel-arrow--prev {
    right: 80px;
  }

  .carousel-arrow--next {
    right: 30px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .carousel-arrow {
    top: 244px;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .carousel-container {
    height: 504px;
  }

  .carousel-arrow {
    top: 29px;
  }
}

/* Фокус для доступности */
.carousel:focus {
  outline: 2px solid #92285a;
  outline-offset: 2px;
}

.carousel-arrow:focus,
.carousel-indicator:focus {
  outline: 2px solid #92285a;
  outline-offset: 2px;
}
</style>
