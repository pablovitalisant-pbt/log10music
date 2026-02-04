# Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System

## 1. Definición del Proyecto y Negocio

* **Visión y objetivos**: Digitalizar la captación de clientes de audio profesional en Bolivia mediante una landing page de alto impacto que refleje autoridad y modernidad. El objetivo es convertir visitantes en leads calificados mediante un diagnóstico gratuito.
* **Casos de uso principales**:
* El usuario navega por la landing, ve el stock y solicita un diagnóstico mediante un formulario.
* El administrador accede a un panel privado para insertar scripts de seguimiento (Píxeles) sin tocar el código fuente.


* **Stakeholders**: Dueños de Log10Music (decisores), Equipo de Marketing (usuarios del panel), Profesionales de audio/Rental (clientes finales).
* **Métricas de éxito**: Tasa de conversión de formularios, tiempo de carga inferior a 2 segundos, y correcta ejecución de scripts externos.
* **Restricciones**: El diseño debe ser idéntico al HTML/Tailwind proporcionado por Stitch.
* **Riesgos identificados**: Inyección de código malicioso a través del panel de scripts; pérdida de performance por exceso de scripts en el header.

## 2. Requerimientos Funcionales y No Funcionales

* **Funcionalidades**:
* Landing page con estética industrial (Mayores de prioridad).
* Formulario modal de captura de datos (Nombre, Empresa, WhatsApp).
* Panel de administración protegido.
* Sistema de inyección dinámica de código en `<head>` y antes de `</body>`.


* **Requerimientos de rendimiento**: Carga optimizada de imágenes pesadas; Score de Lighthouse > 90.
* **Escalabilidad**: Capacidad para manejar picos de tráfico durante eventos o lanzamientos de stock en Iquique.
* **Disponibilidad**: 99.9% mediante despliegue en infraestructuras edge (Vercel/Netlify).
* **Seguridad**: Autenticación para el admin; sanitización de entradas en el formulario de leads.
* **Usabilidad**: Diseño totalmente responsive que mantenga los efectos *skew* y *glitch* en móviles.

## 3. Arquitectura del Sistema

### 3.1 Arquitectura General

* **Estilo arquitectónico**: Arquitectura basada en componentes (Next.js/React) con una API Route para la gestión de datos.
* **Diagrama de alto nivel**: Cliente -> Servidor (Next.js) -> Base de Datos (PostgreSQL/Supabase).
* **Patrones de diseño**: Container-Presenter para separar la lógica del administrador de la UI de la landing.
* **Fronteras de contexto**: Módulo de Cliente (público) y Módulo de Administración (privado).

### 3.2 Componentes y Módulos

* **Frontend**: Single Page Application (SPA) para la landing y Dashboard para el admin.
* **Backend**: API Endpoints para guardar leads y actualizar configuraciones de scripts.
* **Módulos/Slices**: Leads, Settings (Scripts), Auth.
* **Dependencias entre módulos**: Settings inyecta datos en el Layout principal del Frontend.

### 3.3 Infraestructura

* **Cloud provider**: Vercel (Frontend/Serverless) + Supabase (DB).
* **Regiones y zonas**: `us-east-1` (preferencia por latencia en Sudamérica).
* **Networking**: HTTPS obligatorio; CDN de Vercel para assets.
* **Compute**: Serverless Functions para el manejo de formularios y login.

## 4. Bases de Datos y Almacenamiento

### 4.1 Diseño de Datos

* **Modelo de datos conceptual**: Relación simple entre Configuración de Sitio y Registros de Leads.
* **Esquemas de bases de datos**:
* `leads`: `id` (UUID), `full_name`, `company`, `phone`, `source` (página de origen), `created_at`.
* `site_config`: `id`, `header_code` (TEXT), `footer_code` (TEXT), `updated_at`.


* **Particionamiento/Sharding**: No requerido inicialmente.
* **Versionamiento de esquemas**: Migraciones mediante SQL o Prisma.

### 4.2 Tipos de Almacenamiento

* **Bases de datos relacionales**: PostgreSQL (Almacenamiento de leads y scripts).
* **NoSQL**: No aplica.
* **Búsqueda**: No aplica.
* **Cache**: Redis para almacenar los strings del header/footer y evitar consultas constantes a la DB.
* **Object storage**: AWS S3 o Vercel Blob para imágenes de equipos de audio.
* **Data warehousing**: No aplica.

### 4.3 Estrategias de Datos

* **Backup y recuperación**: Backups diarios automáticos en Supabase.
* **Replicación**: No requerida.
* **Consistencia**: Strong consistency para la configuración del sitio.

## 5. APIs y Contratos de Interfaz

### 5.1 API Design

* **Estilo**: REST.
* **Versionamiento**: `/v1/`.
* **Documentación**: Swagger/Postman interno.

### 5.2 Endpoints Detallados

* `POST /api/leads`: Recibe datos del formulario de la landing.
* `GET /api/config`: Obtiene los scripts para inyectar (público pero cacheado).
* `PUT /api/config`: Actualiza los scripts (requiere Auth).
* `GET /api/leads`: Lista de capturas para el admin (requiere Auth).

### 5.3 Integraciones Externas

* **APIs de terceros**: WhatsApp Business API (opcional para alertas).
* **Webhooks**: Notificación a Slack cuando entra un nuevo lead.
* **Mensajería**: No aplica.

## 6. Autenticación y Autorización

* **Método de autenticación**: JWT (JSON Web Tokens).
* **Providers**: NextAuth.js o Supabase Auth.
* **Modelo de permisos**: RBAC (Admin solamente).
* **Roles y permisos**: Único rol "SuperAdmin" con acceso total al panel.
* **Gestión de tokens**: Almacenados en cookies HttpOnly para seguridad.
* **MFA**: Recomendado para el acceso al panel de control.

## 7. Seguridad

### 7.1 Secretos y Credenciales

* **Gestión de secretos**: Variables de entorno de Vercel.
* **Qué secretos se necesitan**: `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`.
* **Rotación**: Semestral.
* **Acceso**: Solo el personal técnico autorizado.

### 7.2 Seguridad de Aplicación

* **Validación de input**: Zod para validación de esquemas en el servidor.
* **Protección contra**: XSS (especialmente crítico al renderizar el header/footer inyectado) y CSRF.
* **Encriptación**: TLS 1.3 en tránsito.
* **Headers de seguridad**: Content Security Policy (CSP) ajustada para permitir scripts de Google/FB.

### 7.3 Infraestructura

* **Firewall rules**: Solo accesos HTTPS.
* **Security groups**: Configuración por defecto de Vercel.

## 8. Frontend

### 8.1 Arquitectura Frontend

* **Framework**: Next.js 14+ (App Router).
* **State management**: React Context para el estado del formulario.
* **Routing**: `/` (Landing), `/admin` (Login), `/admin/dashboard` (Panel).
* **Estructura de componentes**: Basada en los bloques de Stitch: `Header`, `Hero`, `ChaosSection`, `PricingTable`, `FAQ`, `Footer`.

### 8.2 UI/UX (Fidelidad 100% a Stitch)

* **Design system**:
* Colores: `#FF5F00` (Primary), `#0A0A0A` (Charcoal).
* Tipografía: `Archivo Black` para títulos, `Inter` para texto.


* **Wireframes y mockups**: Referencia absoluta a `screen.png` y el código HTML adjunto.
* **Responsive design**: Breakpoints de Tailwind (`sm`, `md`, `lg`, `xl`) para asegurar que el diseño no se rompa.

### 8.3 Performance Frontend

* **Code splitting**: Carga dinámica del panel de administración.
* **Asset optimization**: Imágenes en formato WebP.
* **Caching strategy**: Incremental Static Regeneration (ISR) para la landing.

## 9. Observabilidad y Monitoreo

### 9.1 Logging

* **Estrategia**: Registro de intentos de login fallidos y errores de envío de leads.
* **Centralización**: Vercel Logs o Sentry.

### 9.2 Métricas

* **Métricas clave**: Tasa de éxito de formularios, errores 500 en la API.
* **SLIs/SLOs**: Tiempo de respuesta de API < 200ms.

### 9.3 Tracing

* No requerido para esta escala.

### 9.4 Alerting

* Notificaciones vía email ante fallos en la base de datos.

## 10. Testing

### 10.1 Estrategia de Testing

* **Unit tests**: Validación de lógica de procesamiento de leads.
* **Integration tests**: Prueba de guardado en DB desde el formulario.
* **E2E tests**: Playwright para asegurar que los scripts inyectados aparecen en el DOM.

### 10.2 Tipos de Tests

* **Unit tests**: Vitest.
* **Performance tests**: k6 para simular tráfico en campañas.
* **Security tests**: Escaneo de dependencias (Audit).

### 10.3 Test Data

* **Fixtures**: Leads de prueba (`test@test.com`).

## 11. CI/CD y Deployment

### 11.1 Pipeline CI/CD

* **Herramienta**: GitHub Actions conectado a Vercel.
* **Stages**: Build -> Test -> Preview -> Production.

### 11.2 Estrategia de Deployment

* **Ambientes**: `development` y `production`.
* **Estrategia de release**: Atomic deployments (Vercel).
* **Rollback plan**: Instant Revert desde el dashboard de Vercel.

### 11.3 Infrastructure as Code

* **Herramienta**: Configuración mediante `vercel.json`.

### 11.4 Configuración

* Variables de entorno cargadas dinámicamente según el ambiente.

### 11.5 Containerización

* No requerida (uso de Serverless).

## 12. Gestión de Versiones y Código

* **Branching strategy**: `main` para producción, `develop` para integración.
* **Convenciones de commits**: Conventional Commits (`feat:`, `fix:`, `style:`).
* **Code review**: Obligatorio para cambios en el módulo de inyección de scripts.

## 13. Documentación

* **Arquitectura**: Documento técnico de cómo funciona la inyección de scripts sin romper el SSR.
* **API**: `/api/docs` (Swagger).
* **Runbooks**: "Cómo actualizar el píxel de Facebook desde el panel".

## 14. Costos y Recursos

* **Estimación de costos**: Vercel Hobby/Pro ($0-$20), Supabase Free Tier ($0).
* **Team**: 1 Desarrollador Fullstack.

## 15. Consideraciones Operacionales

### 15.1 Disaster Recovery

* Exportación semanal de la tabla de Leads a CSV/JSON externo.

### 15.2 Mantenimiento

* Revisión mensual de scripts externos para asegurar que no ralentizan el sitio.

## 16. Compliance y Legal

* **Regulaciones aplicables**: Ley de Protección de Datos Personales (Boliviana/Referencia GDPR).
* **Data residency**: Nube.
* **Privacy**: Política de privacidad visible en el footer.

---
