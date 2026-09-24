# 🚗⚡ EV Manager Evo — BYD Atto 3 EVO

Gestor integral web de tu **BYD Atto 3 EVO**: cargas, mantenimiento, revisiones, notas y manual técnico. Todo en **un único archivo HTML** sin necesidad de servidor.

## ✨ Características

### 📊 Dashboard Inteligente
- Visualización del coche en tiempo real
- Estado de revisiones (próxima, vencida, completada)
- Últimas cargas registradas
- Gasto total acumulado
- Información de batería y consumo medio
- Enlaces rápidos personalizables (3 columnas)
- Gráfico de consumo por carga

### ⚡ Gestión de Cargas
- Registro de kWh y coste
- **Precios automáticos:**
  - Casa: 0,01140 €/kWh
  - Trabajo: GRATIS (0 €)
  - Otros: editable
- Ubicación (Casa, Trabajo, Electrolinera personalizada)
- Historial editable con búsqueda
- Estadísticas: total kWh, gasto, precio medio

### 🔧 Mantenimiento
- Registro por tipo (frenos, neumáticos, batería, filtros, etc.)
- Coste, fecha y notas
- Historial con estado del último servicio
- Resumen de gastos

### 📋 Revisiones Preventivas
- Calendario BYD precargado (cada 30.000 km / 24 meses)
- Estados: vencida, próxima, completada
- Descripción de tareas por revisión
- Alertas visuales y notificaciones del navegador

### 📝 Notas
- Notas libres con etiquetas
- Filtrado por etiqueta y búsqueda
- Almacenamiento local persistente

### 📖 Manual Técnico
- Índice completo en ES/EN
- Búsqueda sin distinción de tildes
- Temas: especificaciones, carga, batería, garantía, frenos, seguridad, etc.

### 📊 Estadísticas
- Coste por km recorrido
- Precio medio de energía
- Proyección de gasto anual
- Gasto mensual en gráfico
- Resumen general completo

### 🎨 Interfaz Moderna
- Diseño **multicolor con gradientes** modernos (cyan, verde neón, rosa)
- **Completamente responsive** (escritorio, tablet, móvil)
- Tema oscuro/claro con toggle
- Iconos grandes y claros (optimizado para pantalla de coche)
- Transiciones suaves y efectos hover

## 🚀 Uso

### Sin Instalación
1. Descarga `index.html`
2. Abre en tu navegador (doble clic o arrastra)
3. Configura tu vehículo
4. ¡Empieza a registrar!

### Con Servidor Local
```bash
cd ev-manager-evo
python3 -m http.server 8888
# Abre http://localhost:8888
```

## 💾 Almacenamiento

- **Datos guardados localmente** en tu navegador (`localStorage`)
- Nada se envía a servidores
- Exporta/importa JSON para backup o cambiar dispositivo

## ⚙️ Configuración

1. Ve a **Configuración**
2. Rellena:
   - Versión (Design RWD o Excellence AWD)
   - VIN
   - Kilometraje actual
   - Fecha de compra
   - Consumo medio (kWh/100km)
   - Tarifa eléctrica (€/kWh)

3. Activa notificaciones del navegador (opcional)

## 🎯 Precios Automáticos en Cargas

Al seleccionar ubicación de carga:

| Ubicación | Precio |
|-----------|--------|
| Casa | 0,01140 €/kWh |
| Trabajo | 0,00 € (GRATIS) |
| Otros | Manual (editable) |

El precio se calcula automáticamente:
```
25 kWh en Casa → 0.285 € (automático)
30 kWh en Trabajo → 0.00 € (gratis)
20 kWh Electrolinera → Tú ingresas el precio
```

## 📱 Responsive Design

```
Escritorio   → Coche + Info lado a lado, Quicklinks 3 cols
Tablet       → Stack vertical, Quicklinks 2 cols
Móvil        → Full stack, Quicklinks 1 col
```

## 🔋 Especificaciones BYD Atto 3 EVO

- **Batería:** Blade Battery 74,8 kWh (Cell to Body)
- **Versiones:**
  - Design (RWD): 313 CV, 510 km WLTP
  - Excellence (AWD): 449 CV, 470 km WLTP
- **Carga:** 800V, hasta 220 kW DC
- **Garantía:** 6 años / 150.000 km (batería 8 años / 250.000 km)

## 🛠️ Tecnología

- HTML5 + CSS3 + Vanilla JavaScript
- Sin dependencias externas
- Chart.js para gráficos
- PWA compatible (manifest.json incluido)

## 📊 Archivos

```
├── index.html          # App completa (self-contained)
├── manifest.json       # Metadatos PWA
├── README.md           # Este archivo
├── data/
│   ├── manual-index.json        # Referencia del manual
│   └── revisions-schedule.json  # Calendario de revisiones
```

## 📦 Convertir a APK

El archivo `index.html` es compatible con:
- PWABuilder
- Capacitor
- Cordova
- Android WebView

Incluye `manifest.json` básico. Para iconos PNG profesionales:
- 192×192 px
- 512×512 px

## 🔒 Privacidad

✅ **Todos los datos se guardan localmente en tu navegador**
✅ Nada se envía a servidores
✅ Exporta/importa para cambiar dispositivo
✅ Borra los datos cuando quieras (limpia tu navegador)

## 🤝 Contribuir

¿Mejoras? ¿Bugfixes? ¡Abierto a PRs!

## 📄 Licencia

MIT

## 🔗 Enlaces

- [Manual BYD oficial](https://www.byd.com/es-es/service-maintenance/owners-manual.html)
- [PlugShare](https://www.plugshare.com/)
- [Electromaps](https://www.electromaps.com/)

---

**Última actualización:** Septiembre 2026

Hecho con ❤️ para propietarios del BYD Atto 3 EVO
