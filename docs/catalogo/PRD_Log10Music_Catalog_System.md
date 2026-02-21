# PRD — Log10Music Catalog System (Admin + Público)

## 1. Objetivo

Implementar un sistema completo de catálogo para Log10Music que permita:

- Administrar productos, precios, stock y estado de publicación desde un panel privado.
- Resolver incidencias de catálogo sin tocar código.
- Publicar un catálogo público usable comercialmente.
- Operar el sistema de punta a punta vía UI.

El sistema se considera **terminado** solo cuando el flujo completo es operable desde el panel de administración.

---

## 2. Componentes del sistema

### 2.1 Panel de Administración (/admin)

#### A. Dashboard
Debe mostrar indicadores reales:
- Total de productos
- Incidencias abiertas
- Proveedores activos
- Última sincronización
- Estado del sistema (ok / degraded / error)

Fuentes:
- /api/catalog/health
- /api/catalog/metrics

---

#### B. Productos
Vista principal de gestión comercial.

Tabla con columnas:
- Imagen
- Nombre del producto
- SKU
- Marca
- Proveedor
- Precio
- Stock
- Estado (Publicado / Oculto / Error / Incidencia)

Acciones por producto:
- Editar datos
- Editar precio
- Publicar / Ocultar
- Forzar sincronización
- Resolver incidencia

---

#### C. Incidencias
Listado de problemas detectados en el catálogo:
- Modelos ambiguos
- Productos sin precio
- Productos sin stock
- Errores de parsing

Acciones:
- Resolver (mapping)
- Ignorar
- Reintentar sincronización

APIs:
- GET /api/catalog/issues
- POST /api/catalog/mapping

---

#### D. Proveedores
Gestión de proveedores:
- Nombre
- Estado (activo/inactivo)
- Última sincronización
- Archivos asociados

---

#### E. Archivos
Historial de archivos cargados:
- Nombre
- Proveedor
- Estado (procesado / error)
- Fecha
- Acción: reprocesar

---

### 2.2 Catálogo Público (/catalogo)

Página pública comercial.

Debe:
- Mostrar solo productos publicados
- Mostrar imagen, nombre, marca
- Tener CTA comercial (Cotizar / Consultar)
- NO mostrar precio interno ni stock real

Funcionalidades:
- Grid visual
- Filtro por marca
- Búsqueda por texto
- SEO básico
- Performance aceptable

---

## 3. Flujo Operativo Esperado

1. Admin carga archivos de proveedores
2. Sistema sincroniza productos
3. Se generan incidencias
4. Admin resuelve incidencias desde UI
5. Productos quedan listos para publicar
6. Admin publica productos
7. Catálogo público se actualiza automáticamente

Este flujo **debe funcionar sin intervención técnica**.

---

## 4. Criterio de Sistema Terminado

El sistema está listo cuando:
- El admin puede gestionar completamente el catálogo desde UI.
- El catálogo público muestra productos reales y utilizables comercialmente.
- No se requiere modificar código para operar el negocio.
