<template>
  <div class="wrpBNRS">
    <UniversalCarousel
      :slides="mainPageSlides"
      :autoplay="true"
      :autoplay-interval="5000"
      :show-arrows="true"
      :show-indicators="true"
      container-class="slick-ManePage"
      arrows-class="slick-arrow"
    >
      <template #slide-content="{ slide, isActive }">
        <div class="slick-ManePage__itemLeft">
          <div class="slick-ManePage__title">
            <span class="fade-in-heading" :class="{ 'fade-in-heading--active': isActive }">
              {{ slide.title.part1 }}
            </span>
            <span class="fade-in-heading2" :class="{ 'fade-in-heading2--active': isActive }">
              {{ slide.title.part2 }}
            </span>
            <span class="fade-in-heading3" :class="{ 'fade-in-heading3--active': isActive }">
              {{ slide.title.part3 }}
            </span>
          </div>
          <div class="slick-ManePage__text">
            <div class="slick-ManePage__textRight" v-html="slide.text"></div>
          </div>
        </div>
      </template>
    </UniversalCarousel>
  </div>
</template>

<script setup lang="ts">
import UniversalCarousel from '../components/UniversalCarousel.vue'

interface MainPageSlide {
  id: number
  className: string
  title: {
    part1: string
    part2: string
    part3: string
  }
  text: string
}

const mainPageSlides: MainPageSlide[] = [
  {
    id: 1,
    className: 'slick-ManePage__item_1',
    title: {
      part1: 'Технологии',
      part2: 'рождают',
      part3: 'возможности',
    },
    text: 'Эксклюзивная стеклянная упаковка<br />сложной геометрии премиального качества,<br />вместимостью от 5 миллилитров до 3 литров',
  },
  {
    id: 2,
    className: 'slick-ManePage__item_2',
    title: {
      part1: 'Опыт и',
      part2: 'новые',
      part3: 'познания',
    },
    text: 'Осваиваем более сотни новых<br />ассортиментов в год',
  },
  {
    id: 3,
    className: 'slick-ManePage__item_3',
    title: {
      part1: 'Движение',
      part2: 'только',
      part3: 'вперед',
    },
    text: 'Применяем метод окрашивания стекломассы<br />в питателе',
  },
  {
    id: 4,
    className: 'slick-ManePage__item_4',
    title: {
      part1: 'Наша',
      part2: 'сила в',
      part3: 'мощностях',
    },
    text: 'Ежегодный выпуск более 750 млн единиц продукции<br />и это не предел!',
  },
  {
    id: 5,
    className: 'slick-ManePage__item_5',
    title: {
      part1: 'Исследования',
      part2: 'и точный',
      part3: 'расчёт',
    },
    text: 'Сертифицированные изделия для пищевой, медицинской, химической и парфюмерной промышленностей<br />любого состава стекла',
  },
  {
    id: 6,
    className: 'slick-ManePage__item_6',
    title: {
      part1: 'Слаженный',
      part2: 'коллектив',
      part3: 'работников',
    },
    text: 'Мы можем настроить любой технологический процесс и максимально автоматизировать его',
  },
  {
    id: 7,
    className: 'slick-ManePage__item_7',
    title: {
      part1: 'Широкая',
      part2: 'палитра',
      part3: 'цветов',
    },
    text: 'Цветовая гамма - полный спектр,<br />микс оттенков, любые сочетания',
  },
]
</script>

<style scoped>
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

/* Фоновые изображения для слайдов */
:deep(.slick-ManePage__item_1) {
  background-image: url(/images/slides/slide_1/1.jpg);
}

:deep(.slick-ManePage__item_2) {
  background-image: url(/images/slides/slide_2/fire.gif);
}

:deep(.slick-ManePage__item_3) {
  background-image: url(/images/slides/slide_3/mixer2.gif);
}

:deep(.slick-ManePage__item_4) {
  background-image: url(/images/slides/slide_4/kap.gif);
}

:deep(.slick-ManePage__item_5) {
  background-image: url(/images/slides/slide_5/Kaplya2.gif);
}

:deep(.slick-ManePage__item_6) {
  background-image: url(/images/slides/slide_6/loop.gif);
}

:deep(.slick-ManePage__item_7) {
  background-image: url(/images/slides/slide_7/palitra.gif);
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
</style>
