# ¿Qué es Adiuvare?

Adiuvare es una aplicación web de gestión de eventos solidarios que conecta **asociaciones** con **voluntarios**. Desarrollada como proyecto académico para la asignatura de **Desarrollo de Interfaces (UT2)**.

La idea de esta app es que permita a las asociaciones publicar eventos (recogidas de alimentos, paseos de perros, charlas de salud mental, etc.) y a los voluntarios inscribirse en ellos. La interfaz está diseñada **mobile-first**, simulando una pantalla de iPhone 17 en el navegador de escritorio.

## Tecnologías utilizadas

*   **React 18** (con Vite como empaquetador)
*   **React Router v6** (para la navegación y rutas protegidas)
*   **Context API** (para el modo oscuro y estado global)
*   **CSS puro** (variables CSS para los temas, sin frameworks externos)
*   **Fetch API** (conexión con el backend)


### Funcionalidades destacadas

- **Modo claro/oscuro** persistente (guardado en `localStorage`)
- **Login y Registro** con validación y feedback al usuario (mensajes de error, éxito, etc.)
- **Home** con buscador, categorías y tarjetas de eventos
- **Perfil** de usuario con preferencias y cierre de sesión
- **Ayuda** con preguntas frecuentes desplegables
- **Página 404** personalizada para rutas inexistentes
- **Diseño responsive** adaptado a móvil y escritorio
- **Accesibilidad**: mensajes de confirmación y de ayuda para el usuario.

### Funcionalidades extra (no exigido, pero implementado)
- **Sistema de Roles (Voluntario vs Asociación)**: 
  - La app cambia dinámicamente según el rol. Las asociaciones ven un botón para **crear eventos** y solo gestionan sus propios eventos. Los voluntarios pueden buscar eventos, inscribirse y guardarlos en favoritos.
- **Creación dinámica de categorías**: 
  - Al crear un evento, la asociación no solo elige entre las categorías predefinidas, sino que puede **crear una nueva categoría** sobre la marcha, y esta se guarda en la base de datos.


## Instalación y uso

### Requisitos previos
- Node.js 18+ y npm instalados
- Tener el **backend** de Adiuvare arrancado en el puerto `8080` (puedes encontrarlo en el repo `adiuvare-backend`).

### Pasos

# 1. Clonar el repositorio
git clone https://github.com/Jvdith/adiuvare-app.git

# 2. Entrar a la carpeta
cd prototipo-app-react

# 3. Instalar dependencias
npm install

# 4. Arrancar el servidor de desarrollo
npm run dev