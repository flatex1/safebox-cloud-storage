<div align="center">
  <h1>🔒 SafeBox Cloud Storage</h1>
  <p>
    <strong>Безопасное, современное облачное хранилище, созданное с использованием Next.js, Convex и аутентификации Clerk.</strong>
  </p>
  <p>
    <a href="#возможности">Возможности</a> •
    <a href="#технологии">Технологии</a> •
    <a href="#начало-работы">Начало работы</a> •
    <a href="#структура-проекта">Структура</a> •
    <a href="#развертывание">Развертывание</a>
  </p>
</div>

## ✨ Возможности

- 🔐 Безопасное хранение и обмен файлами
- 👥 Аутентификация пользователей через Clerk
- 🚀 Обновления в реальном времени с помощью Convex
- 👀 Совместный просмотр и редактирование файлов
- 🤖 AI-ассистент "Ровер" для работы с содержимым файлов
- 📱 Адаптивный дизайн
- 🌐 Кроссплатформенная совместимость
- 🔄 Автоматическая синхронизация

## 🛠️ Технологии

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Convex-FF6B6B?style=for-the-badge&logo=data:image/png;base64,..." alt="Convex" />
  <img src="https://img.shields.io/badge/Clerk-4B4B4B?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Liveblocks-000000?style=for-the-badge&logo=liveblocks&logoColor=white" alt="Liveblocks" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

## 🚀 Начало работы

### 1️⃣ Клонируйте репозиторий:

git clone https://github.com/flatex1/safebox-cloud-storage.git
cd safebox-cloud-storage

### 2️⃣ Установите зависимости:

npm install

### 3️⃣ Настройте переменные окружения:

Создайте файл `.env.local` со следующим содержимым:

NEXT*PUBLIC_CLERK_PUBLISHABLE_KEY=ваш_clerk*публичный*ключ
CLERK_SECRET_KEY=ваш_clerk*секретный_ключ
NEXT_PUBLIC_CONVEX_URL=ваш_convex_url

### 4️⃣ Запустите сервер разработки:

npm run dev

### 5️⃣ Инициализируйте Convex:

npx convex dev

📝 Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## 📁 Структура проекта

```bash
safebox-cloud-storage/
├── 📂 app/            # Директория Next.js приложения
├── 📂 components/     # Переиспользуемые React компоненты
├── 📂 convex/        # Функции бэкенда Convex
├── 📂 public/        # Статические файлы
├── 📂 styles/        # Глобальные стили
└── 📂 types/         # Определения типов TypeScript
```

## 🚀 Развертывание

### Развертывание на Vercel

1. 📤 Отправьте код на GitHub
2. 🔗 Подключите репозиторий к Vercel
3. ⚙️ Настройте переменные окружения
4. 🚀 Разверните

### Развертывание бэкенда Convex

npx convex deploy

## 📚 Дополнительная информация
<div align="center">
 <a href="https://deepwiki.com/flatex1/safebox-cloud-storage"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</div>

<p align="center">
  <a href="https://nextjs.org/docs">📖 Документация Next.js</a> •
  <a href="https://nextjs.org/learn">🎓 Изучение Next.js</a>
</p>

<div align="center">
  <p>Made with ❤️ by SafeBox (flatex)</p>
</div>
