#!/usr/bin/env python3
"""Media de la gasolina 95 en Canarias (Las Palmas + Santa Cruz de Tenerife).

Fuente: Geoportal de gasolineras del Ministerio para la Transición Ecológica
(datos abiertos). Escribe data/fuel-canarias.json con el precio medio actual y un
histórico diario que la web usa para calcular el ahorro frente a la gasolina.
"""
import json, os, sys, time, urllib.request
from datetime import date, datetime, timedelta, timezone

BASE = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/"
PROVINCES = {"laspalmas": "35", "tenerife": "38"}
# Histórico oficial por fecha (dd-mm-aaaa): sirve para rellenar días sin dato.
HIST = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestresHist/FiltroProvincia/{fecha}/{pid}"
FIELDS = ["Precio Gasolina 95 E5", "Precio Gasolina 95 E10"]
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "fuel-canarias.json")


def fetch(url, tries=4):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (ev-manager-evo)", "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(5 * (i + 1))
    raise RuntimeError(f"No se pudo descargar {url}: {last}")


def prices(data):
    out = []
    for st in data.get("ListaEESSPrecio", []):
        for f in FIELDS:
            raw = (st.get(f) or "").strip().replace(",", ".")
            if raw:
                try:
                    v = float(raw)
                except ValueError:
                    continue
                if 0.8 < v < 3.5:
                    out.append(v)
                break
    return out


def day_average(day):
    """Media de la gasolina 95 en las dos provincias un día pasado; None si el servicio no tiene datos."""
    allp = []
    for pid in PROVINCES.values():
        allp += prices(fetch(HIST.format(fecha=day.strftime("%d-%m-%Y"), pid=pid), tries=2))
    return round(sum(allp) / len(allp), 3) if allp else None


def backfill(hist, start, end, limit=70):
    """Añade al histórico los días sin dato entre start y end con el precio oficial de ese día.
    Nunca inventa: si el servicio no responde o no hay precios, el día se deja vacío."""
    have = {h["date"] for h in hist}
    added, fails, day = 0, 0, start
    while day <= end and added < limit and fails < 3:
        key = day.strftime("%Y-%m-%d")
        if key not in have:
            try:
                avg = day_average(day)
            except Exception as e:  # noqa: BLE001
                print(f"  {key}: sin datos históricos ({e})", file=sys.stderr)
                fails += 1
                day += timedelta(days=1)
                continue
            fails = 0
            if avg:
                hist.append({"date": key, "price": avg})
                added += 1
                print(f"  {key}: {avg} €/l (histórico oficial)")
            time.sleep(1)
        day += timedelta(days=1)
    return hist


def main():
    per, allp = {}, []
    for name, pid in PROVINCES.items():
        p = prices(fetch(BASE + pid))
        if p:
            per[name] = {"price": round(sum(p) / len(p), 3), "stations": len(p)}
            allp += p
    if not allp:
        print("Sin precios; no se actualiza", file=sys.stderr)
        return 1
    avg = round(sum(allp) / len(allp), 3)
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    try:
        with open(OUT, encoding="utf-8") as fh:
            old = json.load(fh)
    except Exception:  # noqa: BLE001
        old = {}
    hist = [h for h in old.get("history", []) if h.get("date") != today]
    hist.append({"date": today, "price": avg})
    # Huecos: los últimos 14 días siempre; y desde BACKFILL_FROM (AAAA-MM-DD) si se indica al lanzar la acción a mano.
    hoy = now.date()
    desde = hoy - timedelta(days=14)
    if os.environ.get("BACKFILL_FROM"):
        try:
            desde = min(desde, date.fromisoformat(os.environ["BACKFILL_FROM"].strip()))
        except ValueError:
            print("BACKFILL_FROM no válido; se ignora", file=sys.stderr)
    hist = backfill(hist, desde, hoy - timedelta(days=1))
    hist = sorted(hist, key=lambda h: h["date"])[-730:]
    doc = {
        "fuel": "Gasolina 95",
        "area": "Canarias (Las Palmas + Santa Cruz de Tenerife)",
        "source": "Ministerio para la Transición Ecológica - Geoportal de gasolineras",
        "updated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "price": avg,
        "stations": len(allp),
        "provinces": per,
        "history": hist,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"Gasolina 95 Canarias: {avg} €/l ({len(allp)} estaciones)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
