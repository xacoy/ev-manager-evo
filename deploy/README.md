# Desplegar en NAS (Docker) con datos sincronizados, detrás de Cloudflare Tunnel

Sirve EV Manager Evo desde tu NAS con un backend propio (Node + SQLite, sin dependencias npm de terceros) para que **los datos se sincronicen** entre el móvil y la pantalla del coche — no cada uno con su copia local aislada. Protegido por Cloudflare Access, sin ningún puerto expuesto en tu router.

## 1. Copia los archivos de la app

Dentro de esta carpeta (`deploy/`), crea `site/` con el contenido de la app:

```bash
cd deploy
git clone --depth 1 https://github.com/xacoy/ev-manager-evo.git site
rm -rf site/.git site/deploy   # no hacen falta dentro del contenedor
```

O si prefieres no clonar el repo entero, copia manualmente `index.html`, `manifest.json` y `data/` a `deploy/site/`.

## 2. Conecta con tu Cloudflare Tunnel

### Opción A — cloudflared es un contenedor Docker (recomendado)

1. Averigua el nombre de la red que usa tu stack de `cloudflared`:
   ```bash
   docker network ls
   ```
2. Edita `docker-compose.yml` y sustituye `CAMBIA_ESTO_nombre_de_red_de_cloudflared` por ese nombre real.
3. `docker compose up -d --build`
4. En **Cloudflare Zero Trust → Networks → Tunnels**, edita tu túnel y añade un **Public Hostname**:
   - **Hostname**: p. ej. `ev.tudominio.com`
   - **Service**: `HTTP` → `ev-manager-evo:8080`

### Opción B — cloudflared corre nativo en UGOS (no como contenedor)

1. En `docker-compose.yml`, comenta el bloque `networks:` del servicio y descomenta el bloque `ports:` (queda publicado solo en `127.0.0.1:8091`).
2. `docker compose up -d --build`
3. El Public Hostname en Cloudflare debe apuntar a `http://127.0.0.1:8091`.

## 3. Protege el acceso con Cloudflare Access

En **Cloudflare Zero Trust → Access → Applications**, crea una aplicación nueva para ese hostname y añade una política que solo te permita entrar a ti (por tu email, con código de un solo uso, o con tu cuenta de Google). Así ni la app ni el servidor necesitan implementar login propio — si no pasas por Cloudflare, no llegas ni a ver la pantalla de carga.

## 4. Actualizar la app tras cambios futuros

```bash
cd deploy/site
git pull
docker compose restart ev-manager-evo
```

Si copiaste los archivos a mano, vuelve a copiarlos y reinicia el contenedor.

## Cómo funciona la sincronización

- El servidor expone `GET/PUT /api/state`: el JSON completo de tus datos (config, cargas, mantenimiento, notas, revisiones, adjuntos), guardado en SQLite (`ev-data` volume, archivo `app.db`).
- La app sigue guardando también en `localStorage` como caché local: si el móvil se queda sin cobertura en el coche, sigues viendo y editando los últimos datos conocidos, y en cuanto recupera conexión, el siguiente guardado se sincroniza de nuevo con el servidor (verás un aviso mientras esté desconectado).
- Si abres `index.html` directamente como archivo local (sin este servidor detrás), la app sigue funcionando exactamente igual que antes, solo con `localStorage` — el modo servidor es un añadido opcional, no rompe el uso standalone.

## Qué incluye el endurecimiento

- Imagen `node:22-alpine`, usuario `node` sin privilegios (no root).
- **Cero dependencias npm de terceros** — `server.js` solo usa módulos integrados de Node (`http`, `node:sqlite`, `fs`, `path`), así que no hay superficie de ataque de cadena de suministro que auditar.
- `read_only: true` en el contenedor — solo el volumen `ev-data` (para `app.db`) y `/tmp` son escribibles; el propio código de la app se monta `:ro`.
- `cap_drop: ALL` + `no-new-privileges` — sin capabilities de Linux de más.
- Cabeceras de seguridad + CSP ajustada a los únicos orígenes externos que la app usa de verdad (Chart.js vía jsDelivr, la fuente vía Google Fonts), añadidas por el propio servidor en cada respuesta.
- Límite de 20MB por petición a `/api/state` (los adjuntos van dentro de ese JSON) para evitar que una subida enorme tumbe el proceso.
- Protección contra path traversal al servir archivos estáticos.
- Sin puertos publicados en la Opción A (superficie de ataque = cero desde fuera del host Docker) + Cloudflare Access delante como capa de autenticación.

## Backup

Los datos importan más que el código. Dos formas de respaldarlos:
- **Manual, rápida**: botón "Exportar" dentro de la app → descarga un JSON con todo.
- **Del volumen completo**: copia el volumen Docker `ev-data` (o el archivo `app.db` que contiene) con tu herramienta de backup habitual del NAS.
