# 🚗⚡ EV Manager Evo — BYD Atto 3 EVO

Gestor integral web de tu **BYD Atto 3 EVO**: cargas, mantenimiento, revisiones y notas. Todo en **un único archivo HTML** sin necesidad de servidor.

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
- Historial en tarjetas (móvil), tabla con columnas (tablet y escritorio) y filas grandes en Modo coche
- Registrar y editar cargas en una ventana
- Resumen: ahorro vs gasolina con su base, cargas, kWh y €/kWh
- Datos estimados siempre marcados con «≈» y subrayado punteado; al tocar, pasar el ratón o enfocar
  se explica la base del cálculo con tus cifras. Sin marca = introducido por ti

### 🔋 Lecturas del coche (Configuración)
- Ficha para copiar cada pocos días los datos de la app de BYD («Consumo de energía»): km totales, consumo acumulado y, opcional, el reciente
- Muestra la fecha y hora de la última actualización y avisa («Toca actualizar») pasados 7 días
- Con dos lecturas calcula el consumo real entre ellas (energía = consumo × km) y guarda el historial
- La última lectura es el consumo del coche que usa el resto de la app

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

### 📊 Estadísticas
- Selector de periodo (Todo, 12 meses, Este año, Este mes) con variación frente al periodo anterior
- Destacadas: ahorro vs gasolina, coste por km y consumo
- Gasto mensual apilado (energía + mantenimiento) con media y proyección anual
- Bloques de Energía, Dinero y Vehículo (km recorridos, CO₂ evitado, antigüedad)
- kWh y km por mes, consumo por tramo y ahorro acumulado
- Reparto por lugar/tipo de carga y tabla ordenable
- Récords del periodo

### ⚙️ Configuración
- Página unificada en tarjetas con accesos rápidos: Lecturas del coche, Coche y precios, Avisos e idioma, Datos y copia
- «Coche y precios» agrupa solo lo que se usa: versión, fecha de compra, tarifa, consumo de respaldo, consumo del León y gasolina de respaldo
- El botón de guardar solo se activa cuando hay cambios
- Estado de las notificaciones, de Drive y fecha de la última copia de seguridad a la vista

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
| Casa | 0,114 €/kWh |
| Trabajo | 0,00 € (GRATIS) |
| Otros | Manual (editable) |

El precio se calcula automáticamente:
```
25 kWh en Casa → 2.85 € (automático)
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
