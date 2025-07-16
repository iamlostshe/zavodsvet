<template>
  <div class="carousel-container">
    <div class="carousel" ref="carouselRef">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
          :class="[
            `slick-ManePage__item_${index + 1}`,
            { 'carousel-slide--active': currentIndex === index },
          ]"
        >
          <div class="slick-ManePage__itemLeft">
            <div class="slick-ManePage__title">
              <span
                class="fade-in-heading"
                :class="{ 'fade-in-heading--active': currentIndex === index }"
              >
                {{ slide.title.part1 }}
              </span>
              <span
                class="fade-in-heading2"
                :class="{ 'fade-in-heading2--active': currentIndex === index }"
              >
                {{ slide.title.part2 }}
              </span>
              <span
                class="fade-in-heading3"
                :class="{ 'fade-in-heading3--active': currentIndex === index }"
              >
                {{ slide.title.part3 }}
              </span>
            </div>
            <div class="slick-ManePage__text">
              <div class="slick-ManePage__textRight" v-html="slide.text"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Навигационные стрелки -->
    <button
      class="carousel-arrow carousel-arrow--prev slick-prev"
      @click="prevSlide"
      :disabled="currentIndex === 0"
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
      class="carousel-arrow carousel-arrow--next slick-next"
      @click="nextSlide"
      :disabled="currentIndex === slides.length - 1"
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
    <div class="carousel-indicators">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Slide {
  title: {
    part1: string
    part2: string
    part3: string
  }
  text: string
}

const props = defineProps<{
  autoplay?: boolean
  autoplayInterval?: number
}>()

const carouselRef = ref<HTMLElement>()
const currentIndex = ref(0)
const autoplayTimer = ref<number | null>(null)

const slides: Slide[] = [
  {
    title: {
      part1: 'Технологии',
      part2: 'рождают',
      part3: 'возможности',
    },
    text: 'Эксклюзивная стеклянная упаковка<br />сложной геометрии премиального качества,<br />вместимостью от 5 миллилитров до 3 литров',
  },
  {
    title: {
      part1: 'Опыт и',
      part2: 'новые',
      part3: 'познания',
    },
    text: 'Осваиваем более сотни новых<br />ассортиментов в год',
  },
  {
    title: {
      part1: 'Движение',
      part2: 'только',
      part3: 'вперед',
    },
    text: 'Применяем метод окрашивания стекломассы<br />в питателе',
  },
  {
    title: {
      part1: 'Наша',
      part2: 'сила в',
      part3: 'мощностях',
    },
    text: 'Ежегодный выпуск более 750 млн единиц продукции<br />и это не предел!',
  },
  {
    title: {
      part1: 'Исследования',
      part2: 'и точный',
      part3: 'расчёт',
    },
    text: 'Сертифицированные изделия для пищевой, медицинской, химической и парфюмерной промышленностей<br />любого состава стекла',
  },
  {
    title: {
      part1: 'Слаженный',
      part2: 'коллектив',
      part3: 'работников',
    },
    text: 'Мы можем настроить любой технологический процесс и максимально автоматизировать его',
  },
  {
    title: {
      part1: 'Широкая',
      part2: 'палитра',
      part3: 'цветов',
    },
    text: 'Цветовая гамма - полный спектр,<br />микс оттенков, любые сочетания',
  },
]

const nextSlide = () => {
  if (currentIndex.value < slides.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  resetAutoplay()
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = slides.length - 1
  }
  resetAutoplay()
}

const goToSlide = (index: number) => {
  currentIndex.value = index
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
      goToSlide(slides.length - 1)
      break
  }
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

/* Фоновые изображения для слайдов */
.slick-ManePage__item_1 {
  background-image: url(/images/slides/slide_1/1.jpg);
}

.slick-ManePage__item_2 {
  background-image: url(/images/slides/slide_2/fire.gif);
}

.slick-ManePage__item_3 {
  background-image: url(/images/slides/slide_3/mixer2.gif);
}

.slick-ManePage__item_4 {
  background-image: url(/images/slides/slide_4/kap.gif);
}

.slick-ManePage__item_5 {
  background-image: url(/images/slides/slide_5/Kaplya2.gif);
}

.slick-ManePage__item_6 {
  background-image: url(/images/slides/slide_6/loop.gif);
}

.slick-ManePage__item_7 {
  background-image: url(/images/slides/slide_7/palitra.gif);
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

.carousel-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.carousel-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Анимации для текста */
.fade-in-heading,
.fade-in-heading2,
.fade-in-heading3 {
  display: block;
  opacity: 0;
  transform: translate(0px, -90px);
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.fade-in-heading--active {
  opacity: 1;
  transform: translateX(0px) translateY(0px);
  transition-delay: 0s;
}

.fade-in-heading2--active {
  opacity: 1;
  transform: translateX(0px) translateY(0px);
  transition-delay: 0.2s;
}

.fade-in-heading3--active {
  opacity: 1;
  transform: translateX(0px) translateY(0px);
  transition-delay: 0.5s;
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

/* Стили для текста слайдов */
.slick-ManePage__itemLeft {
  width: 74%;
  position: relative;
  z-index: 9;
}

.slick-ManePage__title {
  text-shadow:
    1px 1px 2px white,
    -1px 1px 2px white,
    1px -1px 2px white,
    -1px -1px 2px white;
  font-weight: 600;
  font-size: 72px;
  line-height: 80px;
  padding: 0 0 0 20px;
  height: 284px;
}

.slick-ManePage__text {
  height: 115px;
}

.slick-ManePage__textRight {
  text-shadow:
    1px 1px 2px white,
    -1px 1px 2px white,
    1px -1px 2px white,
    -1px -1px 2px white;
  font-size: 24px;
  padding: 0 0 0 20px;
}

/* Адаптивность для текста */
@media only screen and (min-width: 319px) and (max-width: 640px) {
  .slick-ManePage__title {
    font-size: 36px;
    line-height: 43px;
    padding: 0 0 0 20px;
    height: 90px;
  }

  .slick-ManePage__textRight {
    display: none !important;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .slick-ManePage__title {
    font-size: 45px;
    line-height: 58px;
    padding: 0 0 0 20px;
    height: 199px;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .slick-ManePage__title {
    font-size: 60px;
    line-height: 67px;
    padding: 0 0 0 20px;
    height: 227px;
  }

  .slick-ManePage__text {
    height: 115px;
  }

  .slick-ManePage__textRight {
    line-height: 24px;
    padding: 0 0 0 20px;
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
