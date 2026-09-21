# Desplegar en NAS (Docker) detrás de Cloudflare Tunnel

Guía para servir EV Manager Evo desde tu NAS, accesible desde el móvil o el coche vía tu Cloudflare Tunnel existente, sin abrir ningún puerto nuevo en el router.

## 1. Copia los archivos de la app

Dentro de esta carpeta (`deploy/`), crea `site/` con el contenido de la app:

```bash
cd deploy
git clone --depth 1 https://github.com/xacoy/ev-manager-evo.git site
rm -rf site/.git site/deploy   # opcional, no hacen falta dentro del contenedor
```

O si prefieres no clonar el repo entero en el NAS, copia manualmente estos 3 elementos a `deploy/site/`: `index.html`, `manifest.json`, `data/`.

## 2. Conecta con tu Cloudflare Tunnel

### Opción A — cloudflared es un contenedor Docker (recomendado)

Esta es la más segura: los dos contenedores se hablan por la red interna de Docker, sin publicar ningún puerto.

1. Averigua el nombre de la red que usa tu stack de `cloudflared`:
   ```bash
   docker network ls
   ```
   Busca la red del compose donde tienes `cloudflared` (suele llamarse `<carpeta>_default` o algo que tú le pusieras).

2. Edita `docker-compose.yml` de esta carpeta y sustituye `CAMBIA_ESTO_nombre_de_red_de_cloudflared` por ese nombre real.

3. Arranca el contenedor:
   ```bash
   docker compose up -d
   ```

4. En el dashboard de **Cloudflare Zero Trust → Networks → Tunnels**, edita tu túnel y añade un **Public Hostname** nuevo:
   - **Hostname**: por ejemplo `ev.tudominio.com`
   - **Service**: `HTTP` → `ev-manager-evo:8080` (el nombre del contenedor tal cual, Docker lo resuelve por DNS interno)

Listo — `https://ev.tudominio.com` (o el subdominio que elijas) sirve la app, con TLS de Cloudflare por delante y sin ningún puerto abierto en tu NAS.

### Opción B — cloudflared corre nativo en UGOS (no como contenedor)

1. En `docker-compose.yml`, comenta el bloque `networks:` del servicio y descomenta el bloque `ports:` (queda publicado solo en `127.0.0.1:8091`, no accesible desde fuera del propio NAS).
2. `docker compose up -d`
3. En Cloudflare Zero Trust, el Public Hostname debe apuntar a `http://127.0.0.1:8091` (o a la IP LAN del NAS si tu cloudflared nativo no corre en la misma máquina — evita usar la IP pública).

## 3. Actualizar la app tras cambios futuros

Si clonaste el repo:
```bash
cd deploy/site
git pull
docker restart ev-manager-evo   # opcional, nginx sirve archivos en caliente, no hace falta reiniciar
```

Si copiaste los archivos a mano, vuelve a copiarlos encima.

## Qué incluye el endurecimiento

- `nginxinc/nginx-unprivileged` — no corre como root dentro del contenedor.
- `read_only: true` + `tmpfs` para las pocas rutas que nginx necesita escribir.
- `cap_drop: ALL` + `no-new-privileges` — sin capabilities de Linux de más.
- Volumen del sitio montado `:ro` (solo lectura) — el contenedor no puede modificar la app.
- Cabeceras de seguridad + CSP ajustada a los únicos orígenes externos que la app usa de verdad (Chart.js vía jsDelivr, la fuente vía Google Fonts).
- Límites de memoria/procesos por si algo se descontrola.
- Sin puertos publicados en la Opción A (superficie de ataque = cero desde fuera del host Docker).

## Nota sobre los datos

Esto solo cambia **dónde vive la app** (el HTML/JS). Los datos del usuario (cargas, mantenimiento, adjuntos...) siguen guardándose únicamente en el `localStorage` del navegador de cada dispositivo — la app sigue sin backend ni base de datos. Si abres la misma URL desde el móvil y desde la pantalla del coche con navegadores distintos, cada uno tendrá sus propios datos independientes (usa "Exportar" / "Importar" para pasar los datos de uno a otro).
