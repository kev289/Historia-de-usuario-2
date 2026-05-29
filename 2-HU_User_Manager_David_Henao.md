
# Historia de Usuario — User Manager App (Next.js)

## Nombre del proyecto
**User Manager — Gestión de usuarios con autenticación**

---

# Contexto

Se requiere desarrollar una aplicación web utilizando **Next.js** que permita la gestión completa de usuarios con autenticación. La aplicación tendrá tres vistas principales: un panel de administración de usuarios, una vista de login y un dashboard protegido. Los datos deben persistir en una base de datos **MongoDB** y la arquitectura debe seguir una capa de servicios separada de las vistas.

---

# Historia de Usuario Principal

### HU-01 — Autenticación de usuarios

**Como** usuario de la aplicación  
**Quiero** iniciar sesión con mi email y contraseña  
**Para** acceder al dashboard y las funcionalidades según mi rol.

---

### HU-02 — Administración de usuarios

**Como** administrador  
**Quiero** crear, listar, editar y eliminar usuarios  
**Para** gestionar el acceso y los permisos de los usuarios de la plataforma.

---

### HU-03 — Dashboard protegido

**Como** usuario autenticado  
**Quiero** acceder a un dashboard  
**Para** visualizar información relevante después de iniciar sesión.

---

# Funcionamiento esperado de la aplicación

## Vista 1 — Login (`/login`)

- El usuario ingresa su **email** y **contraseña**.
- Al presionar "Iniciar sesión", se valida contra la base de datos:
  - Si el usuario existe y la contraseña es correcta → redirige al **Dashboard**.
  - Si los datos son incorrectos → muestra un mensaje de error.
- El estado del login debe guardarse en `localStorage`.
- Usar `useRouter` de Next.js para manejar la redirección.

---

## Vista 2 — Dashboard (`/dashboard`)

- Solo es accesible si el usuario está **logueado**.
- Si no hay sesión activa, redirige automáticamente a `/login`.
- Muestra información básica del usuario autenticado (nombre, email, rol).
- Contiene un botón de **Cerrar sesión** que limpia el `localStorage` y redirige a `/login`.

---

## Vista 3 — Administración de usuarios (`/admin/users`)

- Solo es accesible si el usuario está **logueado** y su rol es **`admin`**.
- Si no cumple las condiciones, redirige a `/dashboard` o `/login` según corresponda.
- Lista todos los usuarios registrados en la base de datos.
- Cada usuario se renderiza como un componente reutilizable `UserCard`.
- Permite **crear**, **editar** y **eliminar** usuarios.

---

# Modelo de datos — Usuario

Cada usuario debe tener los siguientes campos:

| Campo      | Tipo     | Descripción                          |
|------------|----------|--------------------------------------|
| `nombre`   | String   | Nombre completo del usuario          |
| `cc`       | String   | Número de cédula o identificación    |
| `email`    | String   | Correo electrónico (único)           |
| `password` | String   | Contraseña del usuario               |
| `role`     | String   | Rol del usuario: `user` o `admin`    |

---

# Operaciones CRUD sobre usuarios

## Crear usuario
- Se muestra un formulario con los campos: nombre, cc, email, password, role.
- Al guardar, el usuario se crea en MongoDB.
- Al crear un usuario nuevo, se debe enviar un **email de bienvenida** al correo registrado.

---

## Listar usuarios
- Se muestran todos los usuarios en tarjetas (`UserCard`).
- Cada tarjeta debe mostrar: nombre, cc, email y rol.
- Cada tarjeta tiene dos botones de acción:
  - **Lápiz (✏️)** → abre el formulario de edición.
  - **Caneca (🗑️)** → elimina el usuario con confirmación.

---

## Editar usuario
- Al hacer clic en el lápiz, se carga un formulario pre-poblado con los datos del usuario.
- Al guardar, se actualizan los datos en MongoDB.

---

## Eliminar usuario
- Al hacer clic en la caneca, se pide confirmación.
- Al confirmar, el usuario es eliminado de MongoDB.

---

# Arquitectura de componentes

## Componente reutilizable `UserCard`

Cada usuario debe renderizarse con un único componente reutilizable:

```jsx
<UserCard />
```

El componente recibe toda su información mediante `props`.

---

# Props obligatorias del componente UserCard

```jsx
<UserCard
  nombre={user.nombre}
  cc={user.cc}
  email={user.email}
  role={user.role}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

# Estilos condicionales por rol

El color de fondo del componente `UserCard` debe cambiar según el rol del usuario:

| Rol     | Color de fondo sugerido |
|---------|-------------------------|
| `admin` | Azul / Índigo           |
| `user`  | Gris / Neutro           |

---

# Capa de servicios

La comunicación con la API **no debe realizarse directamente desde las vistas**. Debe existir una capa de servicios separada.

## Estructura sugerida de servicios

```js
// services/userService.js
export const getUsers = async () => { ... }
export const createUser = async (userData) => { ... }
export const updateUser = async (id, userData) => { ... }
export const deleteUser = async (id) => { ... }

// services/authService.js
export const login = async (email, password) => { ... }
```

Las vistas solo llaman funciones de la capa de servicios.

---

# API Routes (Next.js)

Deben implementarse las siguientes rutas de API:

| Método   | Ruta                    | Descripción                  |
|----------|-------------------------|------------------------------|
| `GET`    | `/api/users`            | Listar todos los usuarios    |
| `POST`   | `/api/users`            | Crear un nuevo usuario       |
| `PUT`    | `/api/users/[id]`       | Actualizar un usuario        |
| `DELETE` | `/api/users/[id]`       | Eliminar un usuario          |
| `POST`   | `/api/auth/login`       | Autenticar usuario           |

---

# Conexión a MongoDB

- Usar **MongoDB** como base de datos.
- Usar el paquete `mongoose` para la conexión y definición de modelos.
- La cadena de conexión debe guardarse en una variable de entorno:

```env
MONGODB_URI=mongodb+srv://...
```

---

# Email de bienvenida

Al crear un nuevo usuario:
- El sistema debe enviar un email de bienvenida al correo registrado.
- El email debe incluir el nombre del usuario y sus credenciales de acceso.
- Investigar como obtener apiKey de gmail y usar nodemailer

---

# Seguridad de contraseñas

## Fase 1 (inicial — obligatorio para entrega básica)
- Las contraseñas se guardan en texto plano.
- Validación directa en login.

## Fase 2 (obligatorio — entrega final)
- Implementar **bcrypt.js** para hashear contraseñas al crear/actualizar usuarios.
- Validar contraseña en login con `bcrypt.compare`.
- Recurso de referencia: https://www.youtube.com/watch?v=eeTeZEozElk

---

# Autenticación y protección de rutas

## Guardar sesión
- Al iniciar sesión correctamente, guardar en `localStorage`:
  - Datos del usuario (nombre, email, rol)
  - Token o indicador de sesión activa

## Protección de rutas con `useRouter`

```js
import { useRouter } from 'next/navigation'

// En componentes protegidos:
const router = useRouter()

useEffect(() => {
  const user = localStorage.getItem('user')
  if (!user) {
    router.push('/login')
  }
}, [])
```

## Reglas de acceso

| Ruta             | Requiere login | Requiere rol admin |
|------------------|----------------|--------------------|
| `/login`         | No             | No                 |
| `/dashboard`     | Sí             | No                 |
| `/admin/users`   | Sí             | Sí                 |

---

# Requerimientos técnicos obligatorios

## Next.js
- App Router.
- Usar `useRouter` de `next/navigation` para redirecciones.

## React Hooks
- `useState` — manejo de estado local.
- `useEffect` — efectos secundarios y protección de rutas.

## MongoDB + Mongoose
- Conexión a base de datos en un archivo utilitario reutilizable (`lib/mongodb.js`).
- Modelo `User` definido con Mongoose Schema.

---

# Comportamientos esperados

## Si no hay usuarios registrados
Mostrar un mensaje:

```txt
No hay usuarios registrados. ¡Crea el primero!
```

---

## Si el login falla
Mostrar un mensaje de error claro:

```txt
Email o contraseña incorrectos.
```

---

## Si un usuario sin rol admin intenta acceder a /admin/users
Redirigir a `/dashboard` automáticamente.

---

# Requisitos de Git y GitHub

Cada desarrollador deberá:

## Crear un repositorio en GitHub
El repositorio debe contener:
- código fuente
- commits frecuentes
- avance progresivo del proyecto

---

## Buenas prácticas de commits

Ejemplos:

```bash
git commit -m "add User model with mongoose"
git commit -m "create login API route"
git commit -m "implement UserCard component with role-based styles"
git commit -m "add route protection with useRouter"
git commit -m "integrate welcome email on user creation"
git commit -m "implement bcrypt password hashing"
```

---

# Despliegue

La aplicación debe ser desplegada en:

https://vercel.com

Las variables de entorno deben configurarse en el panel de Vercel:
- `MONGODB_URI`
- Variables del servicio de email

---

# Entregables

Cada estudiante/desarrollador deberá entregar:

## 1. Repositorio GitHub
Debe incluir:
- historial de commits
- código funcional
- README con instrucciones de instalación y variables de entorno necesarias

---

## 2. Link de despliegue en Vercel

```txt
https://mi-user-manager.vercel.app
```

---

# Criterios de aceptación

## La historia se considera completada cuando:

### Autenticación
- [ ] El login valida email y contraseña contra MongoDB
- [ ] La sesión se guarda en `localStorage`
- [ ] El logout limpia `localStorage` y redirige a `/login`
- [ ] Se usa `useRouter` para redirecciones

### Protección de rutas
- [ ] `/dashboard` redirige a `/login` si no hay sesión
- [ ] `/admin/users` redirige si no hay sesión o no es admin

### CRUD de usuarios
- [ ] Se pueden listar todos los usuarios
- [ ] Se puede crear un usuario con todos sus campos
- [ ] Se puede editar un usuario existente
- [ ] Se puede eliminar un usuario con confirmación
- [ ] Al crear un usuario se envía email de bienvenida

### Componentes
- [ ] Los usuarios se renderizan con el componente `UserCard`
- [ ] `UserCard` recibe datos mediante `props`
- [ ] El color de fondo cambia según el rol del usuario
- [ ] Los botones de editar y eliminar están en el componente

### Arquitectura
- [ ] Existe una capa de servicios separada de las vistas
- [ ] Las vistas no llaman la API directamente
- [ ] Existe conexión a MongoDB con Mongoose
- [ ] El modelo `User` está definido correctamente

### Seguridad (Fase 2)
- [ ] Las contraseñas se hashean con bcrypt al crear/actualizar
- [ ] El login usa `bcrypt.compare` para validar

### Despliegue
- [ ] El proyecto está en GitHub con commits frecuentes
- [ ] La app está desplegada en Vercel
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] La aplicación funciona sin errores en producción

---

# Recursos de referencia

- Next.js docs locales: `node_modules/next/dist/docs/`
- bcrypt.js: https://www.youtube.com/watch?v=eeTeZEozElk
- MongoDB Atlas: https://cloud.mongodb.com
- Nodemailer: https://nodemailer.com
- Vercel: https://vercel.com

---

# Autor

Creado por **David Henao Bustamante**
