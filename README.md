# MoveFit

MoveFit es una aplicación móvil multiplataforma enfocada en hábitos saludables y rutinas de ejercicio. El proyecto permite a los usuarios gestionar rutinas, registrar entrenamientos, visualizar su progreso y fortalecer la constancia mediante una experiencia móvil sencilla, intuitiva y accesible.

La aplicación está desarrollada con Ionic y Angular, utilizando tecnologías web como HTML, SCSS y TypeScript, con el objetivo de funcionar en dispositivos Android y iOS desde una única base de código.

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

## Flujo de navegación

El flujo principal de la aplicación inicia con una pantalla de autenticación. Desde allí, el usuario puede iniciar sesión o registrarse. Una vez autenticado, accede al dashboard principal, desde donde puede navegar hacia las secciones de rutinas, progreso, perfil y configuración.

Flujo general:

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

El diseño inicial contempla las siguientes pantallas:

- Inicio de sesión.
- Registro de usuario.
- Inicio o dashboard principal.
- Progreso.
- Rutinas.
- Crear rutina.
- Perfil.
- Configuración.

## Tecnologías utilizadas

- Ionic Framework.
- Angular.
- TypeScript.
- HTML.
- SCSS.
- JavaScript.
- Local Storage / SQLite para almacenamiento local.
- Capacitor para integración multiplataforma.

## Requerimientos funcionales

- RF01: Registro e inicio de sesión mediante correo electrónico y contraseña.
- RF02: Gestión del perfil de usuario.
- RF03: Creación de rutinas de ejercicio.
- RF04: Consulta, edición y eliminación de rutinas.
- RF05: Catálogo de ejercicios.
- RF06: Registro de entrenamientos.
- RF07: Seguimiento de progreso.
- RF08: Recordatorios y notificaciones.
- RF09: Navegación intuitiva entre inicio, rutinas, progreso, perfil y configuración.

## Requerimientos no funcionales

- Compatibilidad con Android 10.0+ e iOS 13.0+.
- Interfaz intuitiva, amigable y fácil de usar.
- Diseño responsivo para diferentes tamaños de pantalla.
- Funcionamiento sin conexión mediante almacenamiento local.
- Protección de datos sensibles del usuario.
- Estabilidad durante el uso de las funciones principales.
- Accesibilidad mediante buen contraste, tamaños legibles y elementos táctiles adecuados.
- Almacenamiento local de rutinas, usuarios y registros de entrenamiento.

## Instalación del proyecto

Para ejecutar el proyecto localmente, primero se debe clonar el repositorio:

```bash
git clone https://github.com/isabelitarxn1/movefit.git
