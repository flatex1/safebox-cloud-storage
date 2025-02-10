# Добро пожаловать в руководство по интеграции SafeBox для Convex + Clerk

## Инструкции по установке

1. Сначала установите необходимые зависимости:


npm install convex @clerk/clerk-react @clerk/clerk-js
# или
yarn add convex @clerk/clerk-react @clerk/clerk-js


2. Инициализируйте Convex в вашем проекте:


npx convex dev


## Примеры функций с аутентификацией Clerk


// convex/auth.config.js
export default {
  providers: [
    {
      domain: "https://clerk.your-domain.com",
      applicationID: "YOUR_CLERK_APPLICATION_ID",
    },
  ],
};



// convex/functions.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Пример запроса с аутентификацией
export const authenticatedQuery = query({
  args: {
    first: v.number(),
    second: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Не аутентифицирован");
    }
    
    const documents = await ctx.db.query("tablename")
      .filter(q => q.eq(q.field("userId"), identity.subject))
      .collect();
    
    return documents;
  },
});

// Пример мутации с аутентификацией
export const authenticatedMutation = mutation({
  args: {
    first: v.string(),
    second: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Не аутентифицирован");
    }

    const message = {
      body: args.first,
      author: args.second,
      userId: identity.subject,
    };
    const id = await ctx.db.insert("messages", message);
    return await ctx.db.get(id);
  },
});


## Интеграция React компонентов


// App.tsx или подобный файл
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function App() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex}>
        <SignedOut>
          <SignIn />
        </SignedOut>
        <SignedIn>
          {/* Содержимое вашего аутентифицированного приложения */}
          <YourAuthenticatedComponent />
        </SignedIn>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

// Пример компонента, использующего аутентифицированные запросы/мутации
function YourAuthenticatedComponent() {
  const data = useQuery(api.functions.authenticatedQuery, {
    first: 10,
    second: "привет",
  });
  
  const mutation = useMutation(api.functions.authenticatedMutation);
  
  const handleAction = async () => {
    await mutation({
      first: "Привет!",
      second: "я",
    });
  };
  
  return (
    // JSX вашего компонента
  );
}


## Развертывание на Vercel

1. Отправьте ваш код в репозиторий GitHub

2. Настройте ваш проект на Vercel:

# Установите Vercel CLI
npm install -g vercel

# Войдите в Vercel
vercel login

# Разверните ваш проект
vercel


3. Настройте переменные окружения в Vercel:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`

4. Подключите ваш репозиторий GitHub к Vercel:
   - Перейдите на vercel.com
   - Нажмите "Новый проект"
   - Импортируйте ваш репозиторий
   - Настройте параметры сборки
   - Добавьте переменные окружения
   - Разверните

5. Настройте автоматическое развертывание:
   - Vercel будет автоматически развертывать при push в основную ветку
   - Вы можете настроить предварительные развертывания для pull request'ов

Не забудьте также развернуть ваш бэкенд Convex:

npx convex deploy


## Важные замечания

- Храните ваши переменные окружения в безопасности
- Не коммитьте файлы `.env` в ваш репозиторий
- Обновите конечные точки вебхуков Clerk в панели управления Clerk
- При необходимости настройте параметры CORS в вашем развертывании Convex
