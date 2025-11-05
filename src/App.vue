<template>
  <div id="app">
    <div class="container">
      <h1>{{ langRU ? 'Календарь' : 'Calendar' }}</h1>
      <button class="lang_btn" @click="isLang">
        <RUIcon v-if="langRU" />
        <ENIcon v-else />
      </button>
      <Calendar :lang="langRU" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar.vue'
import RUIcon from '@/components/svg/RUIcon.vue'
import ENIcon from '@/components/svg/ENIcon.vue'
import { onMounted, ref } from 'vue'

const langRU = ref(true)

onMounted(() => {
  langRU.value = localStorage.getItem('lang') === 'ru' ? true : false
})

// Переключение языка
const isLang = () => {
  langRU.value = !langRU.value
  localStorage.setItem('lang', langRU.value ? 'ru' : 'en')
}

</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.lang_btn {
  position: absolute;
  top: -10px;
  right: 0;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 20px;
  font-weight: 700;
}
</style>