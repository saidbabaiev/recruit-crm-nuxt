# Supabase CLI - Автогенерация типов для Nuxt 4

## Установка завершена ✅

### Что установлено:
- `@supabase/supabase-js` - клиент для работы с Supabase
- `supabase` - CLI для управления проектом
- Создана структура папок и файлов

### Структура проекта:
```
├── supabase/
│   └── config.toml
├── types/
│   └── supabase.ts
├── composables/
│   └── useSupabaseClient.ts
├── .env.example
└── nuxt.config.ts
```

## Настройка

### 1. Создайте `.env` файл:
```bash
cp .env.example .env
```

Заполните его вашими данными:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 2. Найдите ваш Project ID:
- Перейдите в Supabase Dashboard
- Settings → General → Project ID

### 3. Обновите скрипт в `package.json`:
Замените `YOUR_PROJECT_ID` на ваш реальный Project ID в строке:
```json
"supabase:generate-types": "npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts"
```

## Использование

### Генерация типов из удаленной БД:
```bash
npm run supabase:generate-types
```

### Генерация типов из локальной БД (если используете Supabase локально):
```bash
npm run supabase:generate-types-local
```

### Использование в коде:
```typescript
// В любом компоненте или composable
const supabase = useSupabaseClient()

// Теперь у вас будет полная типизация
const { data, error } = await supabase
  .from('your_table')
  .select('*')
// TypeScript автоматически подскажет все поля таблицы
```

## Автоматическая генерация при изменении схемы

### Вариант 1: Git hooks
Создайте `.husky/pre-commit`:
```bash
#!/bin/sh
npm run supabase:generate-types
git add types/supabase.ts
```

### Вариант 2: Добавьте в CI/CD
В вашем GitHub Actions workflow:
```yaml
- name: Generate Supabase types
  run: npm run supabase:generate-types
```

### Вариант 3: Watch mode (для разработки)
Можно использовать `nodemon` или `chokidar-cli` для отслеживания изменений.

## Дополнительные команды Supabase CLI

```bash
# Логин в Supabase
npx supabase login

# Связать проект
npx supabase link --project-ref your-project-ref

# Запустить локальную БД
npx supabase start

# Остановить локальную БД
npx supabase stop

# Создать миграцию
npx supabase migration new migration_name

# Применить миграции
npx supabase db push
```

## Пример типизированного запроса

```typescript
// composables/useUsers.ts
export const useUsers = () => {
  const supabase = useSupabaseClient()

  const getUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data // Полностью типизировано!
  }

  return {
    getUsers
  }
}
```

## Troubleshooting

### Ошибка: "Failed to generate types"
- Проверьте правильность Project ID
- Убедитесь, что вы залогинены: `npx supabase login`
- Проверьте интернет-соединение

### Типы не обновляются
- Удалите `types/supabase.ts` и сгенерируйте заново
- Перезапустите TypeScript сервер в VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"

### Нет доступа к таблицам
- Проверьте RLS (Row Level Security) политики в Supabase
- Убедитесь, что используете правильный API ключ (anon или service_role)
