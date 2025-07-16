<template>
  <div>
    <div class="BredTitleWRP">
      <h1>Компания</h1>
      <div class="TitlePageTxtWRP">
        <p class="TitlePageTxt">
          Сюгинский стекольный завод был основан в 1835 году купцом 1-й гильдии Ф.Г.Черновым,
          нынешнее же название АО «СВЕТ» было учреждено в 2002 году и быстро стало маркой качества
          на рынке стеклянной тары. Компания постоянно осваивает новые технологии, что позволяет
          удовлетворить желания любых клиентов. Гибко настроенные производственные процессы дают
          возможность выпускать продукцию самой сложной геометрии и оттенков цвета любыми объёмами,
          а слаженный высококвалифицированный коллектив, решая самые сложные задачи, всегда является
          гарантом высокого качества.
        </p>
      </div>
      <div>
        <UniversalCarousel
          :slides="prideCompanySlides"
          :autoplay="true"
          :autoplay-interval="4000"
          :show-arrows="true"
          :show-indicators="false"
          container-class="PrideCompany"
          arrows-class="slick-arrow"
        >
          <template #slide-content="{ slide, isActive }">
            <div class="PrideCompany__chislo" :class="{ 'PrideCompany__chislo--active': isActive }">
              <AnimatedCounter :value="slide.number" :is-active="isActive" :duration="800" />
            </div>
            <div
              class="PrideCompany__txt"
              :class="{ 'PrideCompany__txt--active': isActive }"
              v-html="slide.text"
            ></div>
          </template>
        </UniversalCarousel>
      </div>
    </div>
    <div class="wrapper wrapper_borderBottom">
      <div class="wrapper__grid wrapper__grid_2 AboutC1835">
        <div class="item_1">
          <span class="yearFoundation" ref="yearFoundationRef">
            <AnimatedCounter
              :value="1835"
              :is-active="yearFoundationVisible"
              :duration="800"
            /> </span
          ><span class="yearFoundationText">год основания<br />завода</span>
        </div>
        <div class="item item">
          <h4 class="h4">
            <a href="/document/company/book.pdf">Эта книга</a>, написанная в 2016 году одним из
            генеральных директоров АО "СВЕТ", познакомит Вас с историей возникновения стекольного
            завода и города вокруг него.
          </h4>
        </div>
      </div>
    </div>
    <div class="br br_75"></div>
    <div class="wrapper wrapper__grid wrapper__grid_2 AboutCompanyIntro">
      <div class="item item_3">
        <p>
          Сегодня «СВЕТ» - один из крупнейших производителей стеклянной упаковки в Российской
          Федерации
        </p>
      </div>
      <div class="item item_4">
        <div class="percent" ref="percent5Ref">
          <AnimatedCounter :value="5" :is-active="percent5Visible" :duration="800" />%
        </div>
        <p>доля рынка в Российской Федерации</p>
        <div class="percent" ref="percent30Ref">
          <AnimatedCounter :value="30" :is-active="percent30Visible" :duration="800" />%
        </div>
        <p>доля в сегменте премиум класса</p>
        <div class="percent" ref="percent750Ref">
          <AnimatedCounter :value="750" :is-active="percent750Visible" :duration="800" />+ млн
        </div>
        <p style="margin-bottom: 19px">
          единиц продукции в год позволяют выпускать производственные мощности предприятия
        </p>
      </div>
    </div>

    <div class="wrapper wrapper_bgup wrapperICONs">
      <div class="packaging">
        <div class="packaging__item">
          <img
            src="/icons/ico-company-1.svg"
            alt="Упаковка сложныхгеометрических форм"
            class="packaging__img"
          />
          Упаковка сложных<br />геометрических форм
        </div>
        <div class="packaging__item">
          <img
            src="/icons/ico-company-2.svg"
            alt="Вместимостьот 0,05 до 2 литров"
            class="packaging__img"
          />
          Вместимость<br />от 5 мл до 3 литров
        </div>
        <div class="packaging__item">
          <img src="/icons/ico-company-3.svg" alt="Партииот 15 000 штук" class="packaging__img" />
          Партии<br />от 15 000 штук
        </div>
      </div>

      <div class="complexShape">
        <div class="complexShape__item">
          <p class="complexShape__txtTop">
            Одним из главных преимуществ завода является возможность выпускать стеклянную упаковку
            сложных геометрических форм, вместимостью от 5 мл до 3 литров как промышленными
            партиями, так и небольшими партиями от 15 000 штук.
          </p>
          <p class="complexShape__txt">
            Обеспечивают эти возможности пять стекловаренных печей, выпускающих продукцию из
            супер-белого (UltraFlint), бесцветного, коричневого и даже чёрного стекла, оснащенные
            современными высокотехнологичными стеклоформующими машинами с различным назначением и
            широкими возможностями.<br /><br />
            В производстве стекла АО "СВЕТ" использует новейшие технологии, одна из них -
            окрашивание стекла в массе на выходе из печи в канале питателя. Эта технология даёт
            возможность окрашивать стекло практически в любые цвета, менять цвет окраски в течение
            нескольких часов и выпускать продукцию небольшими партиями.
          </p>
        </div>

        <div class="complexShape__item complexShape__item_slick">
          <UniversalCarousel
            :slides="complexShapeSlides"
            :autoplay="true"
            :autoplay-interval="3000"
            :show-arrows="true"
            :show-indicators="false"
            container-class="complexShapeSlider"
            arrows-class="slick-arrow"
          >
            <template #slide-content="{ slide }">
              <img :src="slide.image" :alt="slide.alt" class="complexShapeSlider__img" />
            </template>
          </UniversalCarousel>
        </div>
      </div>

      <div class="wrapper__grid wrapper__grid_2 wrapper__grid_gap70">
        <div class="item">
          На предприятии успешно внедрены интегрированные системы менеджмента качества ГОСТ Р ИСО
          9001-2015 (ISO 9001:2015), экологического менеджмента ГОСТ Р ИСО 14001-2016 (ISO
          14001:2015), системы безопасности пищевой продукции ГОСТ Р ИСО 22000-2019 (ISO
          22000:2018).
        </div>
        <div class="item">
          Долгосрочные и взаимовыгодные партнерские отношения с крупнейшими потребителями в России и
          других странах, широкий ассортиментный ряд высококачественной продукции, устойчивое
          финансовое состояние служит залогом дальнейшего развития завода.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UniversalCarousel from '../components/UniversalCarousel.vue'
import AnimatedCounter from '../components/AnimatedCounter.vue'
import { ref, onMounted, nextTick } from 'vue'

interface PrideCompanySlide {
  id: number
  className: string
  number: string
  text: string
}

interface ComplexShapeSlide {
  id: number
  image: string
  alt: string
}

const prideCompanySlides: PrideCompanySlide[] = [
  {
    id: 1,
    className: 'PrideCompany__item_1',
    number: '500',
    text: 'Наименований<br />продукции',
  },
  {
    id: 2,
    className: 'PrideCompany__item_2',
    number: '185',
    text: 'ЛЕТ ИСТОРИИ',
  },
  {
    id: 3,
    className: 'PrideCompany__item_3',
    number: '750',
    text: 'МИЛЛИОНОВ ЕДИНИЦ<br />ПРОДУКЦИИ',
  },
  {
    id: 4,
    className: 'PrideCompany__item_4',
    number: '100',
    text: 'НОВЫХ ВИДОВ<br />ИЗДЕЛИЙ В ГОД',
  },
  {
    id: 5,
    className: 'PrideCompany__item_5',
    number: '10',
    text: 'СТРАН ПОТРЕБИТЕЛЕЙ<br />ПРОДУКЦИИ',
  },
  {
    id: 6,
    className: 'PrideCompany__item_6',
    number: '200',
    text: 'ПОТРЕБИТЕЛЕЙ<br />ПРОДУКЦИИ',
  },
]

const complexShapeSlides: ComplexShapeSlide[] = [
  {
    id: 1,
    image: '/images/slides/company/slide_2/fin_1.jpg',
    alt: 'Производство стеклянной упаковки - фото 1',
  },
  {
    id: 2,
    image: '/images/slides/company/slide_2/fin_2.jpg',
    alt: 'Производство стеклянной упаковки - фото 2',
  },
  {
    id: 3,
    image: '/images/slides/company/slide_2/fin_3.jpg',
    alt: 'Производство стеклянной упаковки - фото 3',
  },
  {
    id: 4,
    image: '/images/slides/company/slide_2/fin_4.jpg',
    alt: 'Производство стеклянной упаковки - фото 4',
  },
]

// Refs для элементов
const yearFoundationRef = ref<HTMLElement>()
const percent5Ref = ref<HTMLElement>()
const percent30Ref = ref<HTMLElement>()
const percent750Ref = ref<HTMLElement>()

// Состояние для анимации цифр
const yearFoundationVisible = ref(false)
const percent5Visible = ref(false)
const percent30Visible = ref(false)
const percent750Visible = ref(false)

// Функция для проверки видимости элемента
const checkElementVisibility = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('data-animate-id')
          switch (targetId) {
            case 'yearFoundation':
              yearFoundationVisible.value = true
              break
            case 'percent5':
              percent5Visible.value = true
              break
            case 'percent30':
              percent30Visible.value = true
              break
            case 'percent750':
              percent750Visible.value = true
              break
          }
        }
      })
    },
    { threshold: 0.3 },
  )

  // Наблюдаем за элементами через refs
  if (yearFoundationRef.value) {
    yearFoundationRef.value.setAttribute('data-animate-id', 'yearFoundation')
    observer.observe(yearFoundationRef.value)
  }
  if (percent5Ref.value) {
    percent5Ref.value.setAttribute('data-animate-id', 'percent5')
    observer.observe(percent5Ref.value)
  }
  if (percent30Ref.value) {
    percent30Ref.value.setAttribute('data-animate-id', 'percent30')
    observer.observe(percent30Ref.value)
  }
  if (percent750Ref.value) {
    percent750Ref.value.setAttribute('data-animate-id', 'percent750')
    observer.observe(percent750Ref.value)
  }
}

onMounted(async () => {
  await nextTick()
  // Небольшая задержка для корректной инициализации DOM
  setTimeout(checkElementVisibility, 100)
})
</script>

<style scoped>
/* Стили для PrideCompany */
:deep(.PrideCompany) {
  width: 100%;
  max-width: 1312px;
  height: 500px;
  margin: 0 auto;
  position: relative;
}

:deep(.PrideCompany .carousel-arrow) {
  position: absolute;
  z-index: 1;
  top: auto;
  bottom: 40px;
}

:deep(.PrideCompany .carousel-arrow--next) {
  left: 104px;
}

:deep(.PrideCompany .carousel-arrow--prev) {
  left: 40px;
}

@media only screen and (min-width: 319px) and (max-width: 747px) {
  :deep(.PrideCompany .carousel-arrow--prev) {
    left: 27px;
  }
}

/* Стили для слайдов PrideCompany */
:deep(.PrideCompany__item_1) {
  background-image: url(/images/slides/company/slide_1/pridecompany_mp_1.jpg);
  background-size: 100% 100%;
  transition: all 0.3s;
}

:deep(.PrideCompany__item_2) {
  background-image: url(/images/slides/company/slide_1/pridecompany_mp_2.jpg);
  background-size: 100% 100%;
  transition: all 0.3s;
}

:deep(.PrideCompany__item_3) {
  background-image: url(/images/slides/company/slide_1/pridecompany_mp_3.jpg);
  background-size: 100% 100%;
  transition: all 0.3s;
}

:deep(.PrideCompany__item_4) {
  background-image: url(/images/slides/company/slide_1/pridecompany_mp_4.jpg);
  background-size: 100% 100%;
  transition: all 0.3s;
}

:deep(.PrideCompany__item_5) {
  background-image: url(/images/slides/company/slide_1/pridecompany_mp_5.jpg);
  background-size: 100% 100%;
  transition: all 0.3s;
}

:deep(.PrideCompany__item_6) {
  background-image: url(/images/slides/company/slide_1/pridecompany_mp_6.jpg);
  background-size: 100% 100%;
  transition: all 0.3s;
}

:deep(.carousel-slide) {
  background-position: center 0;
  background-repeat: no-repeat;
  color: #ffffff;
  font-weight: 600;
  overflow: hidden;
  border-radius: 12px;
}

:deep(.carousel-slide:before) {
  content: '';
  display: block;
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background-color: #db2a4a;
}

@media only screen and (min-width: 319px) and (max-width: 747px) {
  :deep(.carousel-slide:before) {
    width: 100%;
    height: 20%;
  }
}

@media only screen and (min-width: 319px) and (max-width: 747px) {
  :deep(.carousel-slide:after) {
    content: '';
    width: 100%;
    position: absolute;
    display: block;
    background: linear-gradient(180deg, rgba(5, 10, 34, 0) 0%, #050a22 100%);
  }
}

/* Стили для текста */
.PrideCompany__chislo,
.PrideCompany__txt {
  padding-left: calc(50% + 60px);
  position: relative;
  z-index: 2;
}

.PrideCompany__chislo {
  font-size: 120px;
  line-height: 100px;
  margin: 198px 0 35px 0;
  opacity: 0.2;
  transition: all 2.5s;
}

.PrideCompany__chislo--active {
  opacity: 1;
}

.PrideCompany__chislo:after {
  content: '+';
  opacity: 0;
  transform: scale(0);
  transition: all 0.1s;
}

.PrideCompany__chislo--active:after {
  opacity: 1;
  transform: scale(1);
  transition: all 2.5s;
}

.PrideCompany__txt {
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding-left: calc(50% + 60px);
  opacity: 0.2;
  transition: all 2.5s;
}

.PrideCompany__txt--active {
  opacity: 1;
}

/* Адаптивность для PrideCompany */
@media only screen and (min-width: 319px) and (max-width: 471px) {
  .PrideCompany__chislo {
    margin: calc(30% - 30px) 0 27px 0;
    padding-left: calc(80% - 60px);
    font-size: 28px;
    line-height: calc(10% - 5px);
  }

  .PrideCompany__txt {
    font-size: 12px;
    line-height: calc(20px - 6px);
    padding-left: calc(80% - 60px);
  }
}

@media only screen and (min-width: 472px) and (max-width: 588px) {
  .PrideCompany__chislo {
    margin: 87px 0 27px 0;
    padding-left: calc(80% - 60px);
    font-size: 32px;
    line-height: 30%;
  }

  .PrideCompany__txt {
    font-size: 16px;
    line-height: 20px;
    padding-left: calc(80% - 60px);
  }
}

@media only screen and (min-width: 589px) and (max-width: 640px) {
  .PrideCompany__chislo {
    margin: 120px 0 27px 0;
    padding-left: calc(80% - 60px);
    font-size: 48px;
    line-height: 50%;
  }

  .PrideCompany__txt {
    font-size: 16px;
    line-height: 30px;
    padding-left: calc(80% - 60px);
  }
}

@media only screen and (min-width: 641px) and (max-width: 747px) {
  .PrideCompany__chislo {
    margin: 98px 0 27px 0;
    padding-left: calc(80% - 60px);
    font-size: 64px;
    line-height: 50%;
  }

  .PrideCompany__txt {
    font-size: 20px;
    line-height: 30px;
    padding-left: calc(80% - 60px);
  }
}

@media only screen and (min-width: 748px) and (max-width: 1065px) {
  .PrideCompany__chislo {
    margin: calc(98px + 50px) 0 27px 0;
    padding-left: calc(80% - 60px);
    font-size: calc(72px - 2px);
    line-height: calc(20% + 20px);
  }

  .PrideCompany__txt {
    font-size: 20px;
    line-height: 30px;
    padding-left: calc(80% - 60px);
  }
}

/* Анимации для активных слайдов */
:deep(.carousel-slide--active) {
  transition: all 2.1s;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  :deep(.carousel-slide--active) {
    background-size: cover !important;
  }
}

@media only screen and (min-width: 641px) and (max-width: 747px) {
  :deep(.carousel-slide--active) {
    background-size: cover !important;
  }
}

:deep(.carousel-slide--active.PrideCompany__item_1) {
  background-size: 100% 100%;
  transition: all 1.5s;
}

:deep(.carousel-slide--active.PrideCompany__item_2) {
  background-size: 110% 110%;
  transition: all 1.5s;
}

:deep(.carousel-slide--active.PrideCompany__item_3) {
  background-size: 100% 100%;
  transition: all 1.5s;
}

:deep(.carousel-slide--active.PrideCompany__item_4) {
  background-size: 110% 110%;
  transition: all 1.5s;
}

:deep(.carousel-slide--active.PrideCompany__item_5) {
  background-size: 100% 100%;
  transition: all 1.5s;
}

:deep(.carousel-slide--active.PrideCompany__item_6) {
  background-size: 110% 110%;
  transition: all 1.5s;
}

/* Стили для ComplexShapeSlider */
:deep(.complexShapeSlider) {
  width: 100%;
  max-width: 640px;
  height: auto;
  margin: 0 auto;
  position: relative;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  :deep(.complexShapeSlider) {
    margin-top: 40px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  :deep(.complexShapeSlider) {
    margin-top: 30px;
  }
}

:deep(.complexShapeSlider .carousel-arrow) {
  position: absolute;
  z-index: 1;
  top: auto;
  bottom: 40px;
}

:deep(.complexShapeSlider .carousel-arrow--next) {
  right: 40px;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  :deep(.complexShapeSlider .carousel-arrow--next) {
    right: 27px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 747px) {
  :deep(.complexShapeSlider .carousel-arrow--next) {
    right: 27px;
  }
}

:deep(.complexShapeSlider .carousel-arrow--prev) {
  right: 104px;
}

:deep(.complexShapeSlider__img) {
  width: 100%;
  max-width: 640px;
  height: auto;
  position: relative;
  z-index: 1;
  display: block;
  border-radius: 12px;
}

/* Стили для анимированного счетчика */
:deep(.PrideCompany__chislo .AnimatedCounter) {
  display: inline-block;
}
</style>
