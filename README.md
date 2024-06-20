# AdminGym

## Descripción del Proyecto

**AdminGym** es una aplicación web para la gestión de miembros y tareas en un gimnasio. Permite registrar accesos, gestionar usuarios y tareas, así como verificar el estado de membresías y pagos.

## Características

- Registro y autenticación de usuarios
- Gestión de tareas (crear, actualizar, eliminar y buscar)
- Registro de accesos por DNI
- Verificación de pagos y fechas adeudadas
- Interfaz amigable y responsiva

## Tecnologías Utilizadas

### Frontend

- React
- Axios
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)

## Instalación

### Requisitos Previos

- Node.js
- MongoDB

### Clonación del Repositorio

```bash
git clone https://github.com/julianmolinerisit/AdminGym.git
cd AdminGym
```
Configuración del Backend
1. Navega al directorio del backend

```bash
cd backend

```

2. Instala las dependencias

```bash
npm install

```

3. Crea un archivo .env en el directorio backend con las siguientes variables:

```bash
PORT=4000
MONGO_URI=tu_mongo_uri
JWT_SECRET=tu_jwt_secret
```
4. Inicia el servidor

```bash
npm run dev

```

Configuración del Frontend

1. Navega al directorio del frontend

```bash
cd frontend

```

2. Instala las dependencias

```bash
npm install

```
3. Crea un archivo config.js en el directorio frontend/src con el siguiente contenido:

```bash
export const API_URL = "http://localhost:4000/api";

```
4. Inicia la aplicación

```bash
npm run dev

```

Uso
1. Registra un nuevo usuario y logueate en la aplicación.
2. Accede a la sección de tareas para gestionar las tareas del gimnasio.
3. Utiliza la sección de accesos para registrar entradas utilizando el DNI de los usuarios.

Estructura del Proyecto
```bash
AdminGym/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── ui/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

# AdminGym

## Descripción del Proyecto

**AdminGym** es una aplicación web para la gestión de miembros y tareas en un gimnasio. Permite registrar accesos, gestionar usuarios y tareas, así como verificar el estado de membresías y pagos.

## Características

- Registro y autenticación de usuarios
- Gestión de tareas (crear, actualizar, eliminar y buscar)
- Registro de accesos por DNI
- Verificación de pagos y fechas adeudadas
- Interfaz amigable y responsiva

## Tecnologías Utilizadas

### Frontend

- React
- Axios
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)

## Instalación

### Requisitos Previos

- Node.js
- MongoDB

### Clonación del Repositorio

```bash
git clone https://github.com/tuusuario/AdminGym.git
cd AdminGym
```

Configuración del Backend

Navega al directorio del backend
```bash
cd backend
```
Instala las dependencias
```bash
npm install
```
Crea un archivo .env en el directorio backend con las siguientes variables:
env
```bash
PORT=4000
MONGO_URI=tu_mongo_uri
JWT_SECRET=tu_jwt_secret
```
Inicia el servidor
```bash
npm run dev
```
Configuración del Frontend

Navega al directorio del frontend
```bash
cd frontend
```
Instala las dependencias
```bash
npm install
```
Crea un archivo config.js en el directorio frontend/src con el siguiente contenido:
```bash
export const API_URL = "http://localhost:4000/api";
```
Inicia la aplicación
```bash
npm start
```
Uso

1. Registra un nuevo usuario y logueate en la aplicación.
2. Accede a la sección de tareas para gestionar las tareas del gimnasio.
3. Utiliza la sección de accesos para registrar entradas utilizando el DNI de los usuarios.

Estructura del Proyecto
```bash
AdminGym/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── ui/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```
Scripts Disponibles
Backend
npm run dev: Inicia el servidor en modo desarrollo
Frontend
npm start: Inicia la aplicación en modo desarrollo
npm run build: Compila la aplicación para producción
npm test: Ejecuta los tests
Contribución
Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

Haz un fork del repositorio
Crea una nueva rama (git checkout -b feature/nueva-caracteristica)
Realiza los cambios y haz commits (git commit -m 'Añadir nueva característica')
Sube los cambios a tu fork (git push origin feature/nueva-caracteristica)
Abre un Pull Request
Licencia
Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE.

Contacto
Autor: Julian Molineris

¡Gracias por usar AdminGym! Si tienes alguna pregunta o sugerencia, no dudes en contactarme.



