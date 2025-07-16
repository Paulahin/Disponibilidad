# Disponibilidad App

## Descripción
La aplicación de Disponibilidad permite a los usuarios ingresar información sobre áreas y sitios, y obtener contactos relacionados desde una base de datos MySQL. La aplicación está dividida en dos partes: el backend, que maneja la lógica del servidor y la base de datos, y el frontend, que proporciona la interfaz de usuario.

## Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

```
disponibilidad-app
├── backend
│   ├── db
│   │   └── schema.sql          # Esquema de la base de datos MySQL
│   ├── src
│   │   ├── server.js           # Punto de entrada del servidor Express
│   │   └── controllers
│   │       └── contactsController.js # Controlador para manejar contactos
│   ├── package.json             # Dependencias y scripts del backend
│   └── README.md                # Documentación del backend
├── frontend
│   ├── Dispo.html               # Archivo HTML principal del frontend
│   ├── styles
│   │   └── main.css             # Estilos CSS para el frontend
│   └── scripts
│       └── main.js              # Código JavaScript para el frontend
└── README.md                    # Documentación general del proyecto
```

## Backend
El backend está construido con Node.js y Express. Utiliza una base de datos MySQL para almacenar información de contactos, áreas y sitios. 

### Instalación
1. Navega al directorio `backend`.
2. Ejecuta `npm install` para instalar las dependencias.
3. Configura la base de datos en `db/schema.sql`.
4. Inicia el servidor con `node src/server.js`.

### API
El backend expone varios endpoints para manejar contactos. Consulta el archivo `backend/README.md` para más detalles sobre el uso de la API.

## Frontend
El frontend está construido con HTML, CSS y JavaScript. Proporciona una interfaz de usuario donde los usuarios pueden ingresar información sobre áreas y sitios.

### Instalación
1. Abre `Dispo.html` en un navegador web.
2. Asegúrate de que el backend esté en funcionamiento para interactuar con la API.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT.