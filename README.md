# Quick Notes UI - Frontend

**Aplicación Angular standalone para gestionar notas rápidas.**

## Características

- Crear una nota con título y descripción.
- Listar todas las notas disponibles.
- Eliminar una nota.
- Editar una nota directamente desde su tarjeta.
- Llamadas HTTP al backend para consumir y modificar datos.
- Diseño simple, responsive y funcional.

## Tecnologías

- Angular 20
- Componentes standalone
- Angular Signals
- RxJS
- SCSS

## Estructura del proyecto

```
quick-notes-ui/
│
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── note-list/
│   │   │   └── note-form/
│   │   ├── components/
│   │   │   └── note-card/
│   │   └── services/
│   │       └── note.ts
│   └── index.html
│
├── angular.json
├── package.json
└── tsconfig.json
```

## Instalación y ejecución

1. Clona este repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd quick-notes-ui
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:

   ```bash
   ng serve
   ```

4. Abre la aplicación en tu navegador:

   ```
   http://localhost:4200
   ```

## Conexión al Backend

Este frontend se conecta por defecto al backend a través de rutas como:

- `GET /notes`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

Asegúrate de tener el backend corriendo localmente (por ejemplo, en `http://localhost:3000`).

## Notas

- Esta aplicación fue desarrollada como parte de una prueba técnica para el Banco Pichincha.
- El formulario principal es para **crear** notas; la edición se hace directamente desde la tarjeta de cada nota.
- Utiliza buenas prácticas modernas de Angular como `@Component.standalone` y `signal()` para el estado reactivo.
