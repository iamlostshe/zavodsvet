<template>
  <div class="ContactInformationPage">
    <div class="BredTitleWRP">
      <h1>Контактная информация</h1>
    </div>
    <div class="wrapper">
      <div class="main_content_wrapper">
        <!-- Фрагмент с картой -->
        <div class="company_map">
          <iframe
            class="iframe_company_map"
            src="https://api-maps.yandex.ru/frame/v1/-/mozhga/?from=mapframe&ll=52.232933%2C56.451264&mode=usermaps&source=mapframe&um=constructor%3Afe59bbdfd52d066f7d231aa96559a673cbb852214da9d84f51d5626de0e40373&utm_source=mapframe&z=15"
            height="350.59"
            loading="lazy"
          ></iframe>
        </div>

        <div class="Company Company_svet">
          <h3>АО «СВЕТ»</h3>
          <p>
            Российская Федерация, Удмуртская Республика,<br />
            427792, г. Можга,<br />
            Свердловский бульвар, 39
          </p>
          <div class="Company__contakts">
            <img width="38" height="38" src="/icons/clock.svg" alt="" />&ensp;&#32;ПН-ПТ:
            08:00-17:00, обед: 12:30-13:30<br />

            <a href="tel:+73413933060" class="LinkTelefon LinkContakt">+7(341-39) 3-30-50</a><br />
            <a href="mailto:steklo@zavodsvet.ru" class="LinkContakt">steklo@zavodsvet.ru</a><br />
            <a href="http://vk.com/zavodsvet" target="_blank" class="LinkContakt"
              >vk.com/zavodsvet</a
            >
            <a href="http://zavodsvet.ru" target="_blank" class="LinkContakt">zavodsvet.ru</a>
            <a href="http://свет.рф" target="_blank" class="LinkContakt">свет.рф</a>
          </div>
        </div>

        <div class="Company Company_svet">
          <h3>Приёмная</h3>
          <div class="Company__contakts">
            <a href="tel:+73413938135" class="LinkTelefon LinkContakt">+7(341-39) 3-81-35</a><br />
            <a href="fax:+73413933050" class="LinkTelefon LinkFAX">+7(341-39) 3-30-50</a><br />
            <a href="mailto:steklo@zavodsvet.ru" class="LinkContakt">steklo@zavodsvet.ru</a><br />
          </div>
        </div>

        <div class="Company Company_svet">
          <h3>Отдел кадров</h3>
          <div class="Company__contakts">
            <a href="tel:+73413938031" class="LinkTelefon LinkContakt">+7(341-39) 3-80-31</a><br />
            <a href="mailto:okmanager@zavodsvet.ru" class="LinkContakt">okmanager@zavodsvet.ru</a
            ><br />
          </div>
        </div>

        <div class="Company Company_svet">
          <h3>Специалист по связям с общественностью</h3>
          <div class="Company__contakts">
            <a href="tel:73413938080" class="LinkTelefon LinkContakt">+7(341-39) 3-80-80</a><br />
            <a href="mailto:uma@zavodsvet.ru" class="LinkContakt">uma@zavodsvet.ru</a><br />
          </div>
        </div>

        <div class="Company Company_svet">
          <h3>Бюро внешнеэкономической деятельности</h3>
          <div class="Company__contakts">
            <a href="tel:+73413938110" class="LinkTelefon LinkContakt">+7(341-39) 3-81-10</a><br />
            <a href="mailto:uovedspec@zavodsvet.ru" class="LinkContakt">uovedspec@zavodsvet.ru</a
            ><br />
          </div>
        </div>

        <div class="Company Company_svet">
          <h3>Отдел продаж</h3>
          <div class="Company__contakts">
            <a href="tel:+73413933061" class="LinkTelefon LinkContakt">+7(341-39) 3-30-61</a><br />
            <a href="tel:+73413933062" class="LinkTelefon LinkContakt">+7(341-39) 3-30-62</a><br />
            <a href="mailto:sav@zavodsvet.ru" class="LinkContakt">sav@zavodsvet.ru</a><br />
            <a href="mailto:opzam@zavodsvet.ru" class="LinkContakt">opzam@zavodsvet.ru</a><br />
          </div>
        </div>

        <div class="Company Company_svet">
          <h3>Отдел закупок</h3>
          <div class="Company__contakts">
            <a href="tel:+73413933066" class="LinkTelefon LinkContakt">+7(341-39) 3-30-66</a><br />
            <a href="tel:+73413938602" class="LinkTelefon LinkContakt">+7(341-39) 3-86-02</a><br />
            <a href="tel:+73413938141" class="LinkTelefon LinkContakt">+7(341-39) 3-81-41</a><br />
            <a href="mailto:export@zavodsvet.ru" class="LinkContakt">export@zavodsvet.ru</a><br />
            <a href="mailto:oz@zavodsvet.ru" class="LinkContakt">oz@zavodsvet.ru</a><br />
          </div>
        </div>
        <div class="Company Company_svet">
          <h3>Филиал АО "СВЕТ" в г. Москве</h3>
          <div class="Company__contakts">
            <a href="tel:+74959562133" class="LinkTelefon LinkContakt">+7(495) 956-21-33</a><br />
            <a href="mailto:info@rusglass.net" class="LinkContakt">info@rusglass.net</a><br />
            <a href="https://rusglass.net/" target="_blank" class="LinkContakt">rusglass.net</a>
          </div>
        </div>
      </div>
    </div>
    <div class="br br_100"></div>
  </div>
</template>

<style>
.iframe_company_map {
  width: 99%;
}

@media only screen and (min-width: 319px) and (max-width: 520px) {
  .iframe_company_map {
    width: auto;
  }
}
</style>
