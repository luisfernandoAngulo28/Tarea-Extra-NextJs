# Tarea-Extra-NextJs

Aplicacion e-commerce construida con Next.js, TypeScript y Tailwind CSS usando Fake Store API.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Radix UI (Dialog, Scroll Area)
- Lucide React (iconos)
- Sonner (toasts)
- Valibot (validaciones)
- Vitest (tests basicos)

## Caracteristicas implementadas

### Home comercial

- Hero con copy orientado a conversion.
- CTA principal y CTA secundario (Ver ofertas).
- Seccion de categorias con iconografia profesional.
- Seccion de productos destacados debajo del banner.
- Skeletons de carga para categorias y destacados.

### Productos (UX avanzada)

- CRUD visual con modales para crear, editar y eliminar.
- Edicion con PATCH enviando solo campos modificados.
- Borrado con ventana de 5 segundos y accion Deshacer.
- Busqueda por texto con debounce de 300ms.
- Filtro por categoria + sincronizacion en URL.
- Ordenamiento por precio, rating y nombre.
- Chips de filtros activos con limpieza individual y total.
- Boton Cargar mas para paginacion progresiva.
- Estado de error con mensaje detallado y Reintentar.

### Formularios y accesibilidad

- Labels accesibles con htmlFor/id.
- Campos requeridos marcados con *.
- Mensajes de validacion por campo.
- Boton Guardar/Actualizar deshabilitado hasta que el formulario sea valido.
- Navegacion por teclado y focus-visible en acciones clave.
- Hook compartido para logica de formularios (menos duplicacion).

## Estructura principal

- app/page.tsx: Home.
- app/products/page.tsx: listado, filtros, busqueda, orden y paginacion.
- app/products/components/: modales y componentes de productos.
- app/products/hooks/: hooks de datos y formulario compartido.
- app/products/services/: llamadas a API.
- components/: UI reutilizable (banner, cards, navbar, footer).
- service/api.ts: helper de fetch y manejo de errores.
- validations/product.schema.ts: reglas de validacion.
- tests/: pruebas basicas con Vitest.

## Variables de entorno

1. Crea un archivo .env.local basado en .env.example.
2. Configura la URL de la API:

NEXT_PUBLIC_API_URL=https://fakestoreapi.com

Si no defines NEXT_PUBLIC_API_URL, la app usa Fake Store API por defecto.

## Scripts

- npm run dev: inicia entorno de desarrollo.
- npm run build: build de produccion.
- npm run start: correr build en produccion.
- npm run lint: linting con ESLint.
- npm run test: ejecuta tests (Vitest).
- npm run test:watch: tests en modo watch.

## Instalacion y uso

1. Instala dependencias:

npm install

2. Inicia la app:

npm run dev

3. Abre en el navegador:

http://localhost:3000

## Tests incluidos

- Validacion de esquema de producto.
- Helpers de API (URL base y errores detallados).

Ejecuta:

npm run test

## Notas

- La API Fake Store es publica y puede tener latencia intermitente.
- La accion Deshacer en eliminar restaura el producto creando uno nuevo (normalmente con nuevo id).
