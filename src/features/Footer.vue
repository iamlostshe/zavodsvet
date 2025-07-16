<template>
  <footer>
    <div class="footer_wrapper">
      <div>© 2025 АО "СВЕТ".</div>
      <div>Разработчик 1: Ларионов Анатолий Дмитриевич.</div>
      <div>Разработчик 2: <a href="https://t.me/iamlostshe">iamlostshe.</a></div>
      <div>Дизайнер: Поляков Александр Петрович.</div>
    </div>
  </footer>
</template>

<style>
footer {
  width: 100%;
  line-height: 30px;
  font-size: 14px;
  background-color: #1a2248;
  color: rgb(224, 224, 224);
}

.footer_wrapper {
  padding-top: 1%;
  display: grid;
  grid-template-rows: 0.1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 100%;
  max-width: 1312px;
  margin: 0 auto;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .footer_wrapper {
    display: block !important;
  }
}
</style>
