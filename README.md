# Vue 3 + TypeScript + Vite

Этот проект сделан на Vue 3 и TypeScript в Vite. Шаблон использует однофайловые компоненты (SFC) Vue 3 с `<script setup>` SFCs, [Документация по script setup](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup).

## О проекте
- Календарь с поддержкой русского и английского языков
- Выбор даты в календаре или ввод
- Переключение между месяцами
- Автоматическое форматирование ввода даты
- Сохранение выбранного языка в localStorage
- При наведении на дату в календаре отображается информация о дате

## Ресурсы
- [Svg для русского языка](https://www.svgrepo.com/svg/401732/flag-for-russia)
- [Svg для английского языка](https://www.svgrepo.com/svg/242307/united-states-of-america-united-states)
- [Справочный материал](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

## Запуск проекта

### Предварительные требования
- Node.js (версия 16 или выше)
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

После выполнения команды приложение будет доступно по адресу: http://localhost:5173

### Сборка для prod
```bash
npm run build
```

### Просмотр
```bash
npm run preview
```
