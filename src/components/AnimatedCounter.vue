<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  value: string | number
  duration?: number
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 800,
  isActive: false,
})

const displayValue = ref('0')

const animateNumber = (targetValue: string | number) => {
  const targetStr = targetValue.toString()

  // Извлекаем число и суффикс (например, из "750+" получаем число 750 и суффикс "+")
  const match = targetStr.match(/^(\d+)(.*)$/)
  if (!match) {
    displayValue.value = targetStr
    return
  }

  const targetNumber = parseInt(match[1])
  const suffix = match[2] || ''
  const start = 0
  const startTime = Date.now()

  const updateCounter = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)

    // Используем easeOutQuart для более плавной анимации
    const easeProgress = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.floor(start + (targetNumber - start) * easeProgress)

    displayValue.value = currentValue.toString() + suffix

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    } else {
      displayValue.value = targetStr
    }
  }

  requestAnimationFrame(updateCounter)
}

watch(
  () => props.isActive,
  (newValue) => {
    if (newValue) {
      animateNumber(props.value)
    } else {
      displayValue.value = '0'
    }
  },
  { immediate: true },
)

watch(() => props.value, (newValue) => {
  if (props.isActive) {
    animateNumber(newValue)
  }
})

onMounted(() => {
  if (props.isActive) {
    animateNumber(props.value)
  }
})
</script>
