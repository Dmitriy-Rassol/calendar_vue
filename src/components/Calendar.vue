<template>
  <div class="calendar">
    <div class="calendar__input">
      <input type="text" v-model="dateInput" :placeholder="lang ? 'ГГГГ ММ ДД' : 'YYYY MM DD'" @input="handleDateInput"
        @blur="formatInputOnBlur" @keydown.enter="handleEnter" class="date-input" maxlength="10">
      <button class="clear-btn" @click="dateInput = ''">x</button>
    </div>
    <div class="calendar__nav nav">
      <div>
        {{ currentMonthYear(lang ? 'ru-RU' : 'en-US') }}
      </div>
      <div>
        <button class="nav__button" @click="nextMonth">&#9650;</button>
        <button class="nav__button" @click="prevMonth">&#9660;</button>
      </div>
    </div>
    <div class="calendar_content">
      <div class="name_days" v-if="lang">
        <div v-for="day in weekDays.weekDaysRU" :key="day.name" :title="day.name">
          {{ day.shortName }}
        </div>
      </div>
      <div class="name_days" v-else>
        <div v-for="day in weekDays.weekDaysEN" :key="day.name" :title="day.name">
          {{ day.shortName }}
        </div>
      </div>
      <div class="days">
        <div 
        :class="[
          'day',
          {
            'prev-month': !day?.isTodayMonth,
            'today': day.isTodayDate,
            'selected': isSelected(day.date)
          }
        ]"
         @click="selectDate(day.date)" 
         :title="formatDate(day.date, lang ? 'ru-RU' : 'en-US')"
         v-for="(day, i) in calendarDays" :key="i"
         >
         {{ day?.day }}

        </div>
      </div>
    </div>
    <div>
      <p class="selected_date" @click="resetDate">{{ formatDate(new Date(), lang ? 'ru-RU' : 'en-US') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import weekDays from '@/utils/weekDays.ts'

defineProps({
  lang: {
    type: Boolean,
    default: true
  }
})

const currentDate = ref<Date>(new Date())
const selectedDate = ref<Date>(new Date())
const dateInput = ref<string>('')

// Получаем месяц и год
const currentMonthYear = (lang: string) => {
  return currentDate.value.toLocaleDateString(lang, {
    month: 'long',
    year: 'numeric'
  })
}

// Получаем дни месяца для отображения
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // Первый день месяца
  const firstDay = new Date(year, month, 1)
  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0)

  // День недели первого дня
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  const days = []

  // Добавляем дни предыдущего месяца
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      day: date.getDate(),
      isTodayMonth: false,
      isTodayDate: isToday(date)
    })
  }

  // Добавляем дни текущего месяца
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      day: date.getDate(),
      isTodayMonth: true,
      isTodayDate: isToday(date)
    })
  }

  // Добавляем дни следующего месяца
  const daysNeeded = 42 - days.length // 42 дня для захвата текущй даты при переключении месяца
  for (let i = 1; i <= daysNeeded; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
      isTodayDate: isToday(date)
    })
  }

  return days
})

// Переключение месяцев вперед
const nextMonth = () => {
  return currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}

// Переключение месяцев назад
const prevMonth = () => {
  return currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

// Сброс даты на сегодня
const resetDate = () => {
  const today = new Date()
  selectedDate.value = today
  currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1) // Переключаем на текущий месяц
}


// Проверка сегодняшней даты
const isToday = (date: Date): boolean => {
  return date.toDateString() === new Date().toDateString()
}

// Выбор даты   
const selectDate = (date: Date) => {
  selectedDate.value = date
}

// проверка выбранной даты 
const isSelected = (date: Date): boolean => {
  if (!selectedDate.value) return false
  return date.toDateString() === selectedDate.value.toDateString()
}

//------------------------------------------------------------------------

// Обработка введенной даты при нажатии Enter
const handleEnter = (event: KeyboardEvent) => {
  event.preventDefault()
  formatInputOnBlur()
}

// Форматимрование даты и выбор даты в календаре
const formatInputOnBlur = () => {
  if (!dateInput.value.trim()) return

  const cleanValue = dateInput.value.replace(/\D/g, '')

  if (cleanValue.length === 8) {
    const [year, month, day] = [
      Number(cleanValue.slice(0, 4)),
      Number(cleanValue.slice(4, 6)),
      Number(cleanValue.slice(6, 8))
    ]

    const inputDate = new Date(year, month - 1, day)

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && inputDate.getDate() === day) {
      selectedDate.value = inputDate
      currentDate.value = new Date(year, month - 1, 1)
      return
    }
  }
  // Если введенная дата некорректна, устанавливаем текущую дату
  dateInput.value = formatDateForInput(selectedDate.value)
}

//------------------------------------------------------------------------

// Автоматическое добавление пробелов при вводе
const handleDateInput = () => {
  const cleanValue = dateInput.value.replace(/\D/g, '').slice(0, 8)
  const parts = [
    cleanValue.slice(0, 4),
    cleanValue.slice(4, 6),
    cleanValue.slice(6, 8)
  ].filter(part => part.length > 0)

  dateInput.value = parts.join(' ')
}

// Форматирование даты
const formatDate = (date: Date, leng: string) => {
  return date.toLocaleDateString(leng, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Форматирование даты для input (ГГГГ ММ ДД)
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = '0' + (date.getMonth() + 1)
  const day = '0' + date.getDate()

  return `${year} ${month.slice(-2)} ${day.slice(-2)}`
}

</script>

<style scoped>
.calendar__input {
  padding: 10px 20px;
  position: relative;
  max-width: max-content;
  margin: 0 0 0 auto;
}

.calendar__nav {
  display: flex;
  justify-content: flex-end;
  gap: 60px;
  align-items: center;
  font-size: 20px;
  padding: 10px 20px;
}

.nav__button {
  cursor: pointer;
  border: none;
  background-color: transparent;

}

.name_days {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-weight: 700;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  padding: 10px 0;
}

.day:hover {
  background-color: #ccc;
  cursor: pointer;
}

.prev-month {
  color: #6c757de1;
  background-color: #f8f9fa;
}

.today {
  background-color: #007bff;
  color: #fff;
}

.today:hover {
  background-color: #007bffef;
}

.selected {
  border: 1px solid #007bff;
  padding: 9px 0;
}

.selected_date {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.date-input {
  width: 100%;
  max-width: 130px;
  padding: 6px 20px;
  border: 1px solid #ccc;
  font-size: 18px;
}

.date-input::placeholder {
  text-align: center;
}

.date-input:focus {
  outline: none;
  border-color: #ccc;
}

.date-input:focus::placeholder {
  color: transparent;
}

.clear-btn {
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #FFFFFF;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 15px;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  font-size: 8px;
  display: flex;
  justify-content: center;
  line-height: 1.1;
  align-items: center;
}
</style>