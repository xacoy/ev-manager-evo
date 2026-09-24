# EV Manager Evo · BYD Atto 3 EVO

Aplicación web de un solo archivo para gestionar de forma integral tu **BYD Atto 3 EVO** (versiones Design y Excellence): cargas, mantenimiento, revisiones programadas, notas con etiquetas, manual técnico bilingüe (ES/EN) y estadísticas de uso y coste.

No requiere servidor, ni npm, ni instalación. Todo funciona en tu navegador.

## Cómo usarla

1. Abre `index.html` haciendo doble clic (o arrastrándolo a tu navegador).
2. Ve a **Configuración** y rellena los datos de tu vehículo (versión, VIN, kilometraje, fecha de compra, consumo medio, tarifa eléctrica).
3. Empieza a registrar cargas, mantenimiento y notas desde el menú lateral.

Los datos se guardan automáticamente en el **almacenamiento local del navegador** (`localStorage`). Si limpias los datos del navegador o cambias de dispositivo, perderás la información salvo que la exportes antes (ver más abajo).

## Estructura del proyecto

```
ev-manager-evo/
├── index.html                  # Aplicación completa (self-contained)
├── manifest.json                # Metadatos PWA, útil de cara a empaquetar como APK
├── data/
│   ├── manual-index.json        # Copia de referencia del índice del manual (ES/EN)
│   └── revisions-schedule.json  # Copia de referencia del calendario de revisiones (ES/EN)
└── README.md
```

> Los archivos en `data/` son una copia legible de la información que ya va **embebida dentro de `index.html`** (para que la app funcione sin servidor ni peticiones locales). Si quieres ampliar el manual o el calendario de revisiones, edítalos primero ahí como referencia y luego actualiza el mismo contenido dentro de las constantes `MANUAL_CONTENT` y `REVISIONS_SCHEDULE` en `index.html`.

## Funcionalidades

- **Dashboard**: kilometraje, consumo medio, gasto total, próxima revisión con barra de progreso, gráficos de consumo y reparto de gasto (cargas vs. mantenimiento).
- **Accesos rápidos**: widget de enlaces en el Dashboard (cargadores cercanos, PlugShare, Electromaps, manual y servicio oficial BYD) pensado para consultarlo desde el móvil en el coche. Puedes añadir tus propios enlaces (seguro, taller de confianza, etc.) y borrar los que no uses.
- **Cargas**: registro de kWh, coste, ubicación y km; historial editable y estadísticas (€/kWh medio, total kWh, etc.).
- **Mantenimiento**: registro por tipo (frenos, neumáticos, batería, filtros, reparación...), coste y notas.
- **Revisiones**: calendario preventivo del Atto 3 EVO precargado (cada 24 meses o 30.000 km), con estado vencida / próxima / completada.
- **Notas**: notas libres con etiquetas, filtrado por etiqueta y búsqueda de texto.
- **Manual**: índice técnico buscable en español e inglés (búsqueda sin distinguir tildes).
- **Estadísticas**: coste por km, precio medio de la energía, proyección de gasto anual, gasto mensual y resumen general.
- **Alertas automáticas**: aviso visual (campana + banner) cuando una revisión está próxima o vencida, revisado cada minuto mientras la app está abierta. Puedes activar además **notificaciones del navegador** (Configuración → Notificaciones automáticas) para recibir avisos aunque tengas la pestaña en segundo plano.
- **Tema**: oscuro/claro, con botón de cambio en la barra lateral (se recuerda tu preferencia).
- **Exportar / Importar**: botón "Exportar" descarga un JSON con todos tus datos; "Importar" permite restaurar ese JSON (con confirmación, ya que reemplaza los datos actuales).

## Sobre el manual y las revisiones incluidas

El **Atto 3 EVO** es el rediseño 2025/2026 del Atto 3 original (motor, batería, carga y carrocería distintos). El contenido del manual y el calendario de revisiones incluidos en esta app son un **índice de referencia** construido a partir de especificaciones publicadas (batería Blade Battery de 74,8 kWh con tecnología Cell to Body, versiones Design/Excellence, carga rápida de hasta 220 kW, garantías, etc.), **no el PDF oficial completo**.

Enlaces oficiales conocidos (verifica siempre la versión más reciente para tu mercado, ya que BYD actualiza estos documentos):

- Manual del propietario oficial (inglés, conducción izquierda, 2026): `https://www.byd.com/material/seal-2026/ATTO 3 EVO Owner's Manual-Left-hand Drive-20260327-EN.pdf`
- Ficha/folleto oficial en español: `https://www.byd.com/material/byd-site/es-es/pdfs/atto-3-evo/ATTO 3 EVO-0317-BPS-ES-V4_WEB.pdf`
- Portal oficial de manuales BYD España: `https://www.byd.com/es-es/service-maintenance/owners-manual.html`

No se localizó un manual del propietario completo en español específico del EVO en el momento de crear esta app; si BYD publica uno, sustituye o amplía el contenido de `data/manual-index.json` (y su copia en `index.html`) con la información real.

## Conversión a APK

`index.html` es una web app auto-contenida, por lo que es compatible con herramientas típicas de empaquetado a APK (por ejemplo Median, PWABuilder o una WebView de Android/Capacitor). Ten en cuenta:

- Ya incluye un `manifest.json` básico como punto de partida para PWA.
- Para un empaquetado más pulido necesitarás iconos PNG reales (192×192 y 512×512 px), ya que el icono actual es un SVG embebido válido para navegador pero no todas las herramientas de empaquetado lo aceptan.
- Las notificaciones del navegador (`Notification API`) funcionan mientras la app esté abierta; para notificaciones en segundo plano dentro de una APK necesitarás la integración nativa que ofrezca la herramienta de empaquetado elegida (Service Worker + Push, o notificaciones nativas si usas Capacitor/Cordova).

## Privacidad

Todos los datos (vehículo, cargas, mantenimiento, notas) se guardan **únicamente en tu navegador**, en este equipo/dispositivo. Nada se envía a ningún servidor.
