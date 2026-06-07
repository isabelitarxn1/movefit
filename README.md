# MoveFit 💪

MoveFit es una aplicación móvil multiplataforma enfocada en hábitos saludables y rutinas de ejercicio. El proyecto permite a los usuarios gestionar rutinas, registrar entrenamientos, visualizar su progreso y fortalecer la constancia mediante una experiencia móvil sencilla, intuitiva y accesible.

La aplicación está desarrollada con Ionic y Angular, utilizando tecnologías web como HTML, SCSS y TypeScript, con el objetivo de funcionar en dispositivos Android y iOS desde una única base de código. El almacenamiento es **local** (SQLite), por lo que funciona sin conexión a un servidor externo.

## Objetivo general

Desarrollar una aplicación móvil multiplataforma utilizando Ionic que permita a los usuarios gestionar rutinas de ejercicio, registrar actividades físicas y realizar seguimiento de hábitos saludables mediante una interfaz intuitiva, accesible y funcional para dispositivos Android y iOS.

## Objetivos específicos

- Diseñar una interfaz gráfica intuitiva y adaptable para mejorar la experiencia de usuario en dispositivos móviles.
- Implementar un sistema de autenticación mediante correo electrónico y contraseña.
- Permitir la creación, consulta, edición y eliminación de rutinas de ejercicio.
- Incorporar un catálogo de ejercicios con información básica para el usuario.
- Registrar entrenamientos realizados, incluyendo rutina, duración y fecha.
- Visualizar estadísticas básicas e historial de entrenamientos.
- Incorporar recordatorios y notificaciones para fomentar la constancia.
- Garantizar el funcionamiento correcto en plataformas Android y iOS.

## Funcionalidades principales

### Autenticación
- Registro de usuario.
- Inicio de sesión con correo electrónico y contraseña.
- Cierre de sesión.
- Protección de rutas: las secciones privadas requieren sesión activa.

### Rutinas
- Visualización de rutinas creadas.
- Creación de nuevas rutinas.
- Edición y eliminación de rutinas.
- Definición de ejercicios, series, repeticiones, duración y días asignados.

### Catálogo de ejercicios
- Listado de ejercicios disponibles.
- Consulta de descripción e instrucciones básicas.

### Entrenamientos
- Registro de sesiones de entrenamiento.
- Asociación de entrenamientos a una rutina.
- Registro de duración y fecha.

### Progreso
- Visualización de historial de entrenamientos.
- Estadísticas básicas de actividad física.
- Seguimiento de avances del usuario.

### Perfil y configuración
- Consulta y edición de datos personales.
- Gestión de información física y datos de entrenamiento.
- Configuración de recordatorios y notificaciones.

## Tecnologías

- **Ionic** 8 + **Angular** 21 (componentes standalone)
- **Capacitor** 8 (empaquetado Android / iOS)
- **TypeScript**, **SCSS**, HTML
- **SQLite** local vía `@capacitor-community/sqlite` (+ `jeep-sqlite` para el navegador)

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- Ionic CLI (opcional, para `ionic serve`): `npm install -g @ionic/cli`

## Instalación

```bash
git clone https://github.com/isabelitarxn1/movefit.git
cd movefit
npm install
npm start
```

> El archivo `sql-wasm.wasm` (necesario para SQLite en el navegador) ya viene incluido en `src/assets`, así que no se requiere ningún paso extra al clonar.

## Ejecutar

```bash
npm start          # servidor de desarrollo en http://localhost:4200
```

Otros comandos útiles:

```bash
npm run build      # compila para producción (carpeta www/)
npm run lint       # análisis de código con ESLint
npm test           # pruebas unitarias (Karma + Jasmine)
```

Para correr en un dispositivo/emulador:

```bash
npm run build
npx cap sync
npx cap open android   # o ios
```

## Estructura del proyecto

```
src/app/
├── pages/
│   ├── login/          # Inicio de sesión (RF01)
│   ├── register/       # Registro de usuario (RF01)
│   ├── home/           # Dashboard de inicio con accesos rápidos (RF09)
│   ├── rutinas/        # Gestión de rutinas (RF03, RF04) — en construcción
│   ├── progreso/       # Historial y estadísticas (RF06, RF07) — en construcción
│   ├── perfil/         # Datos del usuario + cerrar sesión (RF02)
│   └── configuracion/  # Recordatorios y notificaciones (RF08) — en construcción
├── tabs/               # Navegación inferior (barra de 5 secciones)
├── components/         # Componentes reutilizables (fitness-card)
├── guards/             # Protección de rutas (authGuard, guestGuard)
├── services/
│   ├── database.service.ts   # Conexión SQLite + esquema
│   ├── user.repository.ts    # Acceso a datos de usuarios (SQL)
│   ├── password-hasher.ts    # Hash y verificación de contraseñas
│   └── auth.service.ts       # Orquesta registro, login y sesión
├── validators/         # Validación de formularios (register.validator)
└── models/             # Interfaces y helpers de datos (user.model)
```

La capa de autenticación está separada por responsabilidad: `AuthService` coordina el flujo y se apoya en `UserRepository` (datos), `PasswordHasher` (cripto) y `parseRegister` (validación). Las rutas privadas (`/tabs`) están protegidas con `authGuard`; el login y registro con `guestGuard` (un usuario ya autenticado no vuelve a verlos).

## Flujo de navegación

El flujo principal inicia con una pantalla de autenticación. Desde allí, el usuario puede iniciar sesión o registrarse. Una vez autenticado, accede al dashboard principal, desde donde navega a las secciones de rutinas, progreso, perfil y configuración.

1. Inicio de la aplicación.
2. Pantalla de autenticación.
3. Registro o inicio de sesión.
4. Dashboard de inicio.
5. Gestión de rutinas.
6. Catálogo de ejercicios.
7. Registro de entrenamiento.
8. Seguimiento de progreso.
9. Perfil de usuario.
10. Configuración y recordatorios.

## Pantallas del proyecto

- Inicio de sesión.
- Registro de usuario.
- Inicio o dashboard principal.
- Progreso.
- Rutinas.
- Crear rutina.
- Perfil.
- Configuración.

## Almacenamiento

Los datos se guardan **localmente**, sin servidor externo:

- **SQLite** para la información relacional (usuarios, rutinas, entrenamientos). En dispositivo es SQLite nativo; en navegador corre sobre WebAssembly y se persiste en IndexedDB.
- **localStorage** solo para la sesión activa del usuario.

Las contraseñas **nunca** se guardan en texto plano: se derivan con PBKDF2-SHA256 + sal aleatoria por usuario.

> **Mantenimiento (avanzado):** el WASM debe coincidir con la versión de `sql.js` que usa `jeep-sqlite` (fijada con `overrides` en `package.json`). Solo si actualizas `jeep-sqlite` necesitas regenerar el WASM con `npm run copy:wasm`.

## Estado actual

| Módulo | Estado |
|---|---|
| Autenticación (registro / login / sesión + protección de rutas) | ✅ Funcional |
| Dashboard de inicio | ✅ Funcional |
| Navegación por tabs | ✅ Funcional |
| Perfil (ver datos + cerrar sesión) | ✅ Básico |
| Rutinas, Progreso, Configuración | 🚧 Pantallas base (pendiente lógica) |

## Requerimientos funcionales

| ID | Descripción |
|---|---|
| RF01 | Registro e inicio de sesión con correo y contraseña |
| RF02 | Gestión del perfil de usuario |
| RF03 | Creación de rutinas de ejercicio |
| RF04 | Consulta, edición y eliminación de rutinas |
| RF05 | Catálogo de ejercicios |
| RF06 | Registro de entrenamientos |
| RF07 | Seguimiento de progreso e historial |
| RF08 | Recordatorios y notificaciones |
| RF09 | Navegación entre inicio, rutinas, progreso, perfil y configuración |

## Requerimientos no funcionales

- Compatibilidad con Android 10.0+ e iOS 13.0+.
- Interfaz intuitiva, amigable y fácil de usar.
- Diseño responsivo para diferentes tamaños de pantalla.
- Funcionamiento sin conexión mediante almacenamiento local.
- Protección de datos sensibles del usuario (contraseñas hasheadas).
- Estabilidad durante el uso de las funciones principales.
- Accesibilidad mediante buen contraste, tamaños legibles y elementos táctiles adecuados.
- Almacenamiento local de rutinas, usuarios y registros de entrenamiento.
