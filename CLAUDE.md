# Notas para trabajar en este repositorio

## Número de versión
- Cada cambio que se suba a `master` y toque `index.html` debe **actualizar `APP_VERSION`** (cerca del inicio del script, junto a `VEHICLE_BATTERY_KWH`).
- Formato: `AAAA-MM-DD.N`. Si ya hay una versión de hoy, sube solo `N` (`2026-10-22.1` → `2026-10-22.2`); si es otro día, usa la fecha de hoy con `.1`.
- Se ve en Configuración («Versión de la web») y sirve para comprobar que el despliegue es el último.

## Principio: el pasado no cambia nunca
- Lo que ya está registrado (cargas, mantenimiento…) no debe reescribirse por cambiar ajustes ni por añadir datos nuevos.
- Cada carga guarda al registrarse lo que influye en sus cifras: `cons` (consumo kWh/100 km), `refL` (consumo del León, l/100 km), `rate` (tarifa €/kWh) y `fuelPrice` (gasolina del día). Los cálculos usan esos valores y, solo si faltan, los ajustes actuales.
- Si añades un cálculo derivado, que cada elemento use sus propios datos y no un valor global que cambie con el tiempo.
- Única excepción: el precio de la gasolina. Si no hay dato real de ese día se guarda estimado (`fuelEst: true`: media de los 7 últimos días con dato, o el último conocido si es hoy), se marca como estimado en la web y se sustituye por el real en cuanto existe (`freezeFuelPrices`).
