# Notas para trabajar en este repositorio

## Número de versión
- Cada cambio que se suba a `master` y toque `index.html` debe **actualizar `APP_VERSION`** (cerca del inicio del script, junto a `VEHICLE_BATTERY_KWH`).
- Formato: `AAAAMMDDHHMM` con la fecha y hora (hora de Canarias) del cambio, p. ej. `202610300952`. Se muestra como `v202610300952`. Al subir otro cambio, usa siempre una hora posterior.
- Se ve en Configuración («Versión de la web») y sirve para comprobar que el despliegue es el último.

## Principio: el pasado no cambia nunca
- Lo que ya está registrado (cargas, mantenimiento…) no debe reescribirse por cambiar ajustes ni por añadir datos nuevos.
- Cada carga guarda al registrarse lo que influye en sus cifras: `cons` (consumo kWh/100 km), `refL` (consumo del León, l/100 km), `rate` (tarifa €/kWh) y `fuelPrice` (gasolina del día). Los cálculos usan esos valores y, solo si faltan, los ajustes actuales.
- Si añades un cálculo derivado, que cada elemento use sus propios datos y no un valor global que cambie con el tiempo.
- Única excepción: el precio de la gasolina. Si no hay dato real de ese día se guarda estimado (`fuelEst: true`: media de los 7 últimos días con dato, o el último conocido si es hoy), se marca como estimado en la web y se sustituye por el real en cuanto existe (`freezeFuelPrices`).
