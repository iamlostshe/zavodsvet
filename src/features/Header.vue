<template>
  <header id="header" class="SPage">
    <div class="headerWRP">
      <div class="TopPanel">
        <!-- Логотип компании -->
        <div class="TopPanel__item TopPanel__item_logo">
          <a href="/" id="Logo"><img alt="zavodsvet.ru" src="/images/svet_logo.png" /></a>
        </div>

        <!-- Главное меню -->
        <div class="TopPanel__item TopPanel__item_menu">
          <div id="Menu">
            <a class="Menu__item first" href="/">Главная</a>
            <a href="https://rusglass.net/katalog/" class="Menu__item">Каталог</a>
            <a class="Menu__item" href="/company/">Компания</a>
            <a class="Menu__item" href="/kontakty/">Контакты</a>
            <a class="Menu__item" href="/document/">Документы</a>
          </div>
        </div>

        <!-- Номер телефона -->
        <div class="TopPanel__item TopPanel__item_tel">
          <span itemprop="telephone">
            <a class="LinkTelefon" href="tel:+73413933050">+7 341 393 30 50</a></span
          >
        </div>

        <!-- Бургер, когда сжимается сайт -->
        <div class="burgerWRP">
          <div class="burger"></div>
        </div>
      </div>
    </div>
  </header>
</template>
