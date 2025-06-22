<!-- TODO: Применить tailwindcss для оптимизации стилей -->
<!-- TODO: Портировать js код из blob/main.ts -->
<!-- TODO: Здесь задний фон используется дальше для main блока, перенести это в main -->

<template>
  <header id="header" class="h-16 md:h-32">
    <div class="headerWRP">
      <!-- FIXME: Надо портировать код из blob/main.ts (jq) -->
      <div class="TopPanel">
        <div>
          <a href="/" id="Logo"><img alt="zavodsvet.ru" src="/images/svet_logo.png" /></a>
        </div>

        <!-- Главное меню -->
        <!-- FIXME: Надо портировать код из blob/main.ts (jq) -->
        <div id="Menu">
          <a class="Menu__item first" href="/">Главная</a>
          <a href="https://rusglass.net/katalog/" class="Menu__item">Каталог</a>
          <a class="Menu__item" href="/company/">Компания</a>
          <a class="Menu__item" href="/kontakty/">Контакты</a>
          <a class="Menu__item" href="/document/">Документы</a>
        </div>

        <!-- Номер телефона -->
        <!-- TODO: Выносим в отдельный компонент -->
        <div class="TopPanel__item_tel">
          <span itemprop="telephone">
            <a class="LinkTelefon" href="tel:+73413933050">+7 341 393 30 50</a></span
          >
        </div>

        <!-- Бургер, когда сжимается сайт -->
        <div class="burgerWRP">
          <!-- FIXME: Надо портировать код из blob/main.ts (jq) -->
          <div class="burger"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="css" scoped>
#header {
  /* border: 5px solid pink; */
  width: 100%;
  position: relative;
  background: url(/images/fon.jpg) 0 0 no-repeat;
  background-size: 100% 634px;
  margin-bottom: 97px;
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  #header {
    height: auto;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  #header {
    height: 664px;
  }
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  #header {
    transition: all 0.5s;
    height: auto;
  }

  #header.showHeader {
    transition: all 0.5s;
  }
}

/*Общая главная панель меню сверху*/
.headerWRP {
  max-width: 1312px;
  padding: 15px 0 0 0;
  margin: 0 auto;
  color: #ffffff;
}

@media only screen and (min-width: 1175px) and (max-width: 1365px) {
  .headerWRP {
    max-width: auto;
    padding: 32px 32px 0 32px;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .headerWRP {
    max-width: auto;
    padding: 32px 32px 0 32px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .headerWRP {
    max-width: auto;
    padding: 32px 32px 0 32px;
  }
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .headerWRP {
    max-width: auto;
    padding: 0 32px 0 32px;
  }
}

/*Главная панель меню*/
.TopPanel {
  height: 54px;
  line-height: 80px;
  width: 100%;
  max-width: 1312px;
  margin: 0 auto;
  display: grid;
  grid-template-columns:
    minmax(190px, 224px) minmax(35%, 674px) minmax(160px, 310px)
    minmax(50px, 78px) minmax(25px, 25px);
  grid-column-gap: 0;
  transition: all 0.5s;
}

@media only screen and (min-width: 1175px) and (max-width: 1365px) {
  .TopPanel {
    grid-template-columns:
      minmax(190px, 204px) minmax(35%, 654px) minmax(160px, 300px)
      minmax(50px, 68px) minmax(25px, 25px);
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .TopPanel {
    grid-template-columns:
      minmax(190px, 204px) minmax(35%, 620px) minmax(160px, 238px)
      minmax(50px, 68px) minmax(25px, 25px);
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .TopPanel {
    grid-template-columns:
      minmax(190px, 204px) 1fr minmax(160px, 238px) minmax(50px, 68px)
      minmax(40px, 50px) minmax(25px, 25px);
  }
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .TopPanel {
    grid-template-columns:
      minmax(180px, 204px) 1fr 1fr minmax(60px, 1fr)
      minmax(40px, 50px) minmax(25px, 25px);
    padding-top: 6px;
  }
}

.TopPanel__item_tel {
  width: 140px;
  height: 54px;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .TopPanel__item_tel {
    font-size: 0;
    display: none;
  }
}

.TopPanel .LinkTelefon {
  text-decoration: none;
  color: #ffffff;
}

#Menu {
  transition: all 0.5s;
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  #Menu {
    background-color: #ffffff;
    width: calc(100% - 20vw);
    padding: 40px 10vw;
    position: absolute;
    z-index: -1;
    top: -100vh;
    left: 0;
    transition: all 0.7s;
  }
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  #Menu {
    background-color: #ffffff;
    width: calc(100% - 30vw);
    padding: 27px 20vw 55px 10vw;
    position: absolute;
    z-index: -1;
    top: -100vh;
    left: 0;
    transition: all 0.7s;
  }
}

#Menu.active {
  top: 0;
  z-index: 99;
  transition: all 0.5s;
}

.Menu__item {
  position: relative;
  cursor: pointer;
  color: #ffffff;
  display: inline-block;
  width: 18%;
  transition: all 0.5s;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
}

.Menu__item:hover {
  text-decoration: underline;
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .Menu__item {
    width: 22%;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .Menu__item {
    color: #1a2248;
    width: 49%;
    text-align: center;
    display: inline-block;
    line-height: 20px;
    margin: 10px 0;
  }
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .Menu__item {
    color: #1a2248;
    width: 100px;
    text-align: center;
    display: inline-block;
    line-height: 20px;
    margin: 20px;
    font-size: 20px;
  }
}

.Menu__item.active {
  text-decoration: underline;
  color: #db2a4a;
}

.burgerWRP {
  height: 54px;
  line-height: 80px;
  margin-left: 60px;
}

@media only screen and (min-width: 319px) and (max-width: 369px) {
  .burgerWRP {
    display: inline-block;
    margin-left: 20px;
  }
}

@media only screen and (min-width: 370px) and (max-width: 419px) {
  .burgerWRP {
    display: inline-block;
    margin-left: 120px;
  }
}

@media only screen and (min-width: 420px) and (max-width: 519px) {
  .burgerWRP {
    display: inline-block;
    margin-left: 180px;
  }
}

@media only screen and (min-width: 519px) and (max-width: 526px) {
  .burgerWRP {
    display: inline-block;
    margin-left: 275px;
  }
}

@media only screen and (min-width: 526px) and (max-width: 619px) {
  .burgerWRP {
    display: inline-block;
    margin-left: 295px;
  }
}

.burger {
  display: none;
  width: 24px;
  height: 14px;
  border-top: 1px solid #ffffff;
  cursor: pointer;
  -webkit-transform: translateY(6px);
  transform: translateY(6px);
  transition: all 0.3s;
}

.burger:before {
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  background-color: #ffffff;
  margin: 4px 0;
  transition: all 0.4s;
}

.burger:after {
  display: block;
  content: '';
  width: 50%;
  height: 1px;
  background-color: #ffffff;
  transition: all 0.5s;
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .burger {
    display: inline-block;
  }
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .burger {
    display: inline-block;
  }
}

.burger:hover {
  position: relative;
  z-index: 101;
  border-top: 1px solid #db2a4a;
  transition: all 0.5s;
}

.burger:hover:before {
  background-color: #db2a4a;
  transition: all 0.5s;
}

.burger:hover:after {
  background-color: #db2a4a;
  transition: all 0.5s;
}

.burger.active {
  position: relative;
  z-index: 101;
  border-top: 0px solid transparent;
  transition: all 0.5s;
}

.burger.active:before {
  display: block;
  content: '';
  width: 24px;
  height: 1px;
  background-color: #db2a4a;
  margin: 4px 0;
  -webkit-transform: rotate(45deg) translateY(4px) translateX(3px);
  transform: rotate(45deg) translateY(4px) translateX(3px);
  transition: all 0.6s;
}

.burger.active:after {
  display: block;
  content: '';
  width: 24px;
  height: 1px;
  background-color: #db2a4a;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  transition: all 0.5s;
}
</style>
