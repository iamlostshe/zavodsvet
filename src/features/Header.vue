<template>
  <header id="header" class="header">
    <div class="header__container">
      <!-- Логотип -->
      <div class="header__logo">
        <a href="/" class="logo">
          <img src="/images/svet_logo.png" alt="zavodsvet.ru" class="logo__image" />
        </a>
      </div>

      <!-- Главное меню -->
      <nav class="header__nav" :class="{ 'header__nav--active': isMenuOpen }">
        <a class="nav__item" href="/" @click="closeMenu">Главная</a>
        <a class="nav__item" href="https://rusglass.net/katalog/" @click="closeMenu">Каталог</a>
        <a class="nav__item" href="/company/" @click="closeMenu">Компания</a>
        <a class="nav__item" href="/contact/" @click="closeMenu">Контакты</a>
        <a class="nav__item" href="/document/" @click="closeMenu">Документы</a>
      </nav>

      <!-- Номер телефона -->
      <div class="header__phone">
        <a class="phone__link" href="tel:+73413933050">+7 341 393 30 50</a>
      </div>

      <!-- Бургер меню -->
      <button
        class="header__burger"
        :class="{ 'header__burger--active': isMenuOpen }"
        @click="toggleMenu"
        aria-label="Открыть меню"
      >
        <span class="burger__line"></span>
        <span class="burger__line"></span>
        <span class="burger__line"></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

// Закрытие меню при клике вне его
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.header__nav') && !target.closest('.header__burger')) {
    closeMenu()
  }
}

// Закрытие меню при изменении размера экрана
const handleResize = () => {
  if (window.innerWidth > 768) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.header {
  width: 100%;
  background: url(/images/fon.jpg) 0 0 no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 100;
}

.header__container {
  max-width: 1312px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* Логотип */
.header__logo {
  flex-shrink: 0;
}

.logo__image {
  height: 40px;
  width: auto;
  max-width: 200px;
}

/* Навигация */
.header__nav {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
  justify-content: center;
}

.nav__item {
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav__item:hover {
  color: #db2a4a;
  text-decoration: underline;
}

.nav__item.active {
  color: #db2a4a;
  text-decoration: underline;
}

/* Телефон */
.header__phone {
  flex-shrink: 0;
}

.phone__link {
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.phone__link:hover {
  color: #db2a4a;
}

/* Бургер меню */
.header__burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  z-index: 101;
}

.burger__line {
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  transform-origin: center;
}

.header__burger:hover .burger__line {
  background-color: #db2a4a;
}

.header__burger--active .burger__line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.header__burger--active .burger__line:nth-child(2) {
  opacity: 0;
}

.header__burger--active .burger__line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Медиа-запросы для планшетов */
@media (max-width: 1024px) {
  .header__container {
    padding: 12px 16px;
  }

  .header__nav {
    gap: 20px;
  }

  .nav__item {
    font-size: 14px;
  }

  .phone__link {
    font-size: 14px;
  }
}

/* Медиа-запросы для мобильных устройств */
@media (max-width: 768px) {
  .header__container {
    padding: 10px 16px;
  }

  .logo__image {
    height: 32px;
  }

  /* Скрываем навигацию и телефон на мобильных */
  .header__nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.98);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 80px 20px 20px;
    gap: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 100;
  }

  .header__nav--active {
    transform: translateX(0);
  }

  .nav__item {
    color: #1a2248;
    font-size: 18px;
    font-weight: 500;
    padding: 15px 0;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
  }

  .nav__item:last-child {
    border-bottom: none;
  }

  .nav__item:hover {
    color: #db2a4a;
    background-color: #f8f8f8;
    padding-left: 10px;
  }

  .header__phone {
    display: none;
  }

  .header__burger {
    display: flex;
  }
}

/* Медиа-запросы для очень маленьких экранов */
@media (max-width: 480px) {
  .header__container {
    padding: 8px 12px;
  }

  .logo__image {
    height: 28px;
  }

  .header__nav {
    padding: 70px 16px 16px;
  }

  .nav__item {
    font-size: 16px;
    padding: 12px 0;
  }

  .header__burger {
    width: 26px;
    height: 18px;
  }
}

/* Медиа-запросы для больших экранов */
@media (min-width: 1366px) {
  .header__container {
    padding: 20px 32px;
  }

  .logo__image {
    height: 48px;
  }

  .nav__item {
    font-size: 18px;
  }

  .phone__link {
    font-size: 18px;
  }
}
</style>
