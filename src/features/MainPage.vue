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
    <div class="vk_video_button">Видео: создание стекла</div>
  </div>
</template>

<style>
.vk_video_wrapper {
  position: relative;
  width: 100%;
  max-width: 1312px;
  height: auto;
  margin: 0 auto;
}

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
  position: relative;
  width: 100%;
  max-width: 1312px;
  height: auto;
  margin: 0 auto;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .vk_video_wrapper {
    padding-bottom: 130px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .vk_video_wrapper {
    padding-bottom: 130px;
  }
}

.vk_video_button {
  display: block;
  position: absolute;
  width: calc(640px - 291px);
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

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .vk_video_button {
    background-image: none;
    width: calc(100% - 137px);
    height: calc(130px - 45px);
    padding: 40px 0 5px 137px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .vk_video_button {
    background-image: none;
    width: calc(100% - 35vw);
    height: calc(130px - 45px);
    padding: 40px 0 5px 35vw;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .vk_video_button {
    width: calc(513px - 237px);
    height: calc(125px - 40px);
    padding: 40px 0 0 237px;
    background-size: contain;
  }
}

.vk_video_button:before {
  content: '';
  display: block;
  width: 60px;
  height: 60px;
  border: 1px solid transparent;
  border-radius: 50%;
  background-color: #ffffff;
  position: absolute;
  z-index: 1;
  top: 40px;
  left: 193px;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .vk_video_button:before {
    top: 35px;
    left: 43px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .vk_video_button:before {
    top: 35px;
    left: 26vw;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .vk_video_button:before {
    top: 34px;
    left: 145px;
  }
}

.vk_video_button:after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-left: 17px solid #1a2248;
  border-bottom: 12px solid transparent;
  position: absolute;
  z-index: 1;
  top: 59px;
  left: 217px;
}

@media only screen and (min-width: 319px) and (max-width: 640px) {
  .vk_video_button:after {
    top: 55px;
    left: 69px;
  }
}

@media only screen and (min-width: 641px) and (max-width: 959px) {
  .vk_video_button:after {
    top: 55px;
    left: 29vw;
  }
}

@media only screen and (min-width: 960px) and (max-width: 1174px) {
  .vk_video_button:after {
    top: 53px;
    left: 170px;
  }
}
</style>
