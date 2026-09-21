# Imagen mínima: solo Node (sin dependencias npm de terceros, cero riesgo
# de cadena de suministro) sirviendo la app y la API sobre SQLite.
FROM node:22-alpine

WORKDIR /app

# Crea /data con el dueño correcto ANTES de bajar privilegios: al montar
# ahí encima un volumen Docker vacío, este hereda esos permisos en el
# primer arranque (si no, el volumen nace de root y el usuario "node" no
# podría escribir app.db).
RUN mkdir -p /data && chown node:node /data

# Usuario sin privilegios ya incluido en la imagen oficial de Node.
USER node

COPY --chown=node:node server.js ./server.js

ENV PORT=8080
ENV DB_PATH=/data/app.db
ENV SITE_DIR=/app/site

EXPOSE 8080
CMD ["node", "server.js"]
