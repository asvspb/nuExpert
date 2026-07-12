# nuExpert

**nuExpert** — это архитектурно жесткий, ИИ-ориентированный фреймворк на базе Nuxt 3 (Fullstack). Он создан как идеальная "песочница" для автономных ИИ-агентов, позволяющая безопасно и быстро разворачивать любые бизнес-идеи.

## Ключевые особенности

- **AI-First Design**: Проект содержит файлы `AGENTS.md` и `.cursorrules` с жесткими инструкциями для нейросетей, чтобы они не ломали архитектуру.
- **End-to-End TypeScript**: Никакого `any`. Zod является единым источником истины (`shared/schemas`).
- **Собственный Backend (Nitro)**: Никаких внешних FastAPI/Express. Встроенный сервер Nuxt с маршрутами `server/api/`.
- **Drizzle ORM + PostgreSQL**: Быстрая и безопасная работа с БД (миграции через `drizzle-kit generate/migrate`).
- **Современный UI**: Tailwind CSS v4 + Nuxt UI v3 (базовая тема в `app.config.ts`).
- **Жесткий контроль качества**: 
  - Flat ESLint (`eslint.config.js`)
  - `dependency-cruiser` для предотвращения кольцевых зависимостей и изоляции слоев (Фронт не видит Бэк).
  - Unit тесты (Vitest) и E2E тесты (Playwright) с высокими порогами покрытия (60/50%).
- **DevOps Ready**: Включен многоступенчатый `Dockerfile`, настроенный `docker-compose.yml` (App + DB + Redis) и GitHub Actions CI/CD.

## Быстрый старт

### 1. Требования
- Node.js 20+
- Docker и docker-compose (для локального окружения БД/Redis)

### 2. Установка и запуск

Поднимите базу данных и кэш:
```bash
docker-compose up db redis -d
```

Установите зависимости:
```bash
npm install
```

Примените миграции Drizzle:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Запустите сервер разработки (Nuxt):
```bash
npm run dev
```

### 3. Проверки качества

Для проверки кода перед коммитом запустите сводный скрипт (он прогонит typecheck, lint, dependency-cruiser и тесты с покрытием):
```bash
npm run validate
```

Для E2E тестирования:
```bash
npm run e2e
```

## Как разворачивать новые бизнес-идеи

ИИ-агенты должны следовать этому алгоритму при добавлении новых фич:
1. Создайте Zod-схему в `shared/schemas/`.
2. Создайте Drizzle-схему в `server/database/schema.ts`.
3. Сгенерируйте и примените миграции (`npx drizzle-kit generate` и `npx drizzle-kit migrate`).
4. Добавьте API Endpoint в `server/api/`.
5. Напишите UI в `app/pages/` или `app/components/` с использованием Composition API и `<script setup lang="ts">`. Явно отдавайте приоритет Nuxt UI-компонентам (`<UButton>`, `<UInput>` и т.д.) вместо ручной вёрстки Tailwind-классами.
6. Покройте логику тестами.
7. Убедитесь, что `npm run validate` проходит без ошибок.

---

Разработано как эталонная архитектура для взаимодействия Человека и ИИ.
