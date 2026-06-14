# Mobile Chat App

Expo (React Native) клиент + Node/Express бэкенд.

## Требования

- Node.js 18+
- Expo Go на телефоне (или iOS/Android эмулятор)
- Проект Supabase + Azure Bot с каналом Direct Line

## Запуск

Сначала бэкенд, затем клиент (клиент ходит за токеном на бэкенд).

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # заполнить реальными значениями
npm start
```

**Клиент (Expo):**
```bash
cd chat
npm install
cp .env.example .env   # заполнить реальными значениями
npx expo start
```
Затем в терминале Expo: `i` — iOS, `a` — Android, или QR-код в приложении Expo Go.

## Переменные окружения

`backend/.env`:

| Переменная | Описание |
|---|---|
| `CHAT_APP_DIRECT_LINE_SECRET` | Secret канала Direct Line (обязателен, иначе сервер не стартует) |
| `SUPABASE_PROJECT_REF` | Ref проекта Supabase |
| `PORT` | Порт сервера (по умолчанию 3000) |

`chat/.env`:

| Переменная | Описание |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL бэкенда: `http://localhost:3000` для эмулятора; для телефона по QR — IP в локальной сети, напр. `http://192.168.x.x:3000` |
| `EXPO_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Публичный (publishable) ключ Supabase |
