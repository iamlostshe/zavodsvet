<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'VideoComponent',
  setup() {
    const handleClick = () => {
      const videoContainer = document.createElement('div')
      videoContainer.className = 'video-overlay'
      videoContainer.innerHTML = `
        <iframe
          class="vkvideo"
          src="https://vkvideo.ru/video_ext.php?oid=-231634632&id=456239017&hd=4&hash=1836e4d0aeeef4a0&autoplay=1"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          frameborder="0" allowfullscreen>
        </iframe>
      `

      // Клик по оверлею
      videoContainer.addEventListener('click', (event) => {
        // Проверяем, кликнули ли именно по overlay, а не по iframe
        if (event.target === videoContainer) {
          videoContainer.remove()
        }
      })

      const parentElement = document.querySelector('.vk_video_wrapper')
      if (parentElement) {
        parentElement.appendChild(videoContainer)
      }
    }

    onMounted(() => {
      const button = document.querySelector('.vk_video_button')
      if (button) {
        button.addEventListener('click', handleClick)
      }
    })

    onBeforeUnmount(() => {
      const button = document.querySelector('.vk_video_button')
      if (button) {
        button.removeEventListener('click', handleClick)
      }
    })
  },
})
</script>

<template>
  <div class="vk_video_wrapper">
    <div class="vk_video_button">Смотреть видео о создании стекла</div>
  </div>
  <footer>
    <div class="footer_wrapper">
      <div>© 2025 АО "СВЕТ".</div>
      <div>
        Разработчики:
        <a href="https://t.me/iamlostshe"> iamlostshe </a>
        и
        <a href="https://t.me/milinuri"> milinuri. </a>
      </div>
    </div>
  </footer>
</template>

<style>
/* Настройки футера */
footer {
  width: 100%;
  line-height: 30px;
  font-size: 14px;
  background-color: #1a2248;
  color: rgb(224, 224, 224);
  padding-top: 20px;
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

/* Настройки видео */
.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

iframe.vkvideo {
  width: 80%;
  height: 80%;
  max-width: 800px;
  max-height: 450px;
  border-radius: 8px;
}

.vk_video_wrapper {
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.vk_video_button {
  display: block;
  width: 100%;
  height: calc(155px - 45px);
  padding: 45px 0 0 291px;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  background: url(/images/slides/all.jpg) 0 -1px no-repeat #db2a4a;
  color: #ffffff;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>
