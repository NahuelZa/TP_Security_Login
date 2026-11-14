# Frontend · Programación IV · Unidad 10

CRUD de categorías, productos e ingredientes con autenticación (JWT en cookie
HttpOnly) y roles `user` y `admin`. El código está organizado por **features** y
las rutas se protegen por sesión y por rol.

React 19 · TypeScript · Vite · Tailwind 4 · React Router · TanStack Query y Table ·
Zustand · Axios.

## Puesta en marcha

Requisitos: Node 20.11 o superior y pnpm. El backend (FastAPI) de la Unidad 9 debe
estar corriendo; no se modifica.

```bash
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:8000
pnpm install
pnpm dev
```

Otros scripts: `pnpm build` (verifica tipos y compila) y `pnpm lint`.

## Estructura

```text
src/
├── features/
│   ├── auth/          # login, registro, sesión y administración de usuarios
│   │   ├── components/   UserRow
│   │   ├── hooks/        useAuth, useAdminUsers
│   │   ├── pages/        LoginPage, RegisterPage, AdminUsersPage
│   │   ├── services/     auth.service, users.service
│   │   ├── store/        authStore (Zustand, sin persist)
│   │   ├── types/        auth.types
│   │   └── index.ts      API pública (barrel)
│   ├── categories/    # misma estructura: hook useCategories
│   ├── ingredients/   # misma estructura: hook useIngredients
│   └── products/      # misma estructura: hook useProducts
├── shared/            # lo que usan varias features
│   ├── api/              api.ts (Axios), setupInterceptors.ts (401 y 403), queryClient.ts
│   ├── components/       Navbar, Toast, UnauthorizedPage, DataTable
│   ├── lib/              config.ts (lee VITE_API_BASE_URL)
│   ├── ui/               fieldClasses, actionsColumn
│   └── utils/            handle-api-error, notify-api-error
├── store/             # estado global de interfaz
│   ├── themeStore.ts         modo oscuro (persist, clave "theme-storage")
│   └── notificationStore.ts  mensajes del Toast
├── routes/
│   ├── AppRouter.tsx         declaración de todas las rutas
│   └── ProtectedRoute.tsx    guardián por sesión y rol (usa Outlet)
├── App.tsx            # verifica la sesión al iniciar y monta el router y el Toast
└── main.tsx
```

## Reglas de arquitectura

- Una feature solo importa de otra a través de su `index.ts` (barrel), nunca de
  sus subcarpetas internas. Dentro de una feature se usan rutas internas, no el
  propio barrel.
- Lo que usan varias features va en `shared/` o en `store/`.
- Los componentes de `pages/` no llaman a Axios ni a TanStack Query: usan el
  custom hook de su feature.
- Alias `@/` → `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`).

## Rutas

| Ruta | Acceso |
|---|---|
| `/login`, `/register`, `/unauthorized` | Públicas |
| `/categories`, `/products`, `/ingredients` | Usuario con sesión |
| `/admin/users` | Solo rol `admin` |

`ProtectedRoute`: mientras se verifica `/auth/me` muestra un indicador de carga;
sin sesión redirige a `/login`; con rol no permitido, a `/unauthorized`.

## Sesión, errores y estado

- La sesión vive en una cookie HttpOnly: no se guarda en `localStorage`. Al iniciar,
  `App.tsx` la recupera con `GET /api/v1/auth/me`.
- **401** (salvo en `/auth/token` y `/auth/me`): se limpia la sesión y se vuelve al login.
- **403**: aviso «acceso denegado»; la sesión no se cierra.
- Solo se persisten preferencias de interfaz (tema).
- Ocultar botones o rutas en el frontend mejora la experiencia, no es seguridad:
  el backend valida el rol en cada petición.