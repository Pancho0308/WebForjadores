# Portada temporal · Día de Muertos 2026

Evento: **1–8 de noviembre de 2026**. La restauración es manual; no cambia sola según la fecha.

Se guardaron copias exactas antes de editar:

- `index.html.original`: portada original en inglés (`index.html`).
- `es-index.html.original`: portada original en español (`es/index.html`).

## Al terminar el evento

Desde la carpeta principal del proyecto, copia los respaldos sobre las portadas actuales.
**Esto reemplaza las portadas del evento; guarda primero cualquier cambio posterior que quieras conservar.**

En PowerShell (Windows):

```powershell
Copy-Item respaldos/dia-de-muertos-2026/index.html.original index.html -Force
Copy-Item respaldos/dia-de-muertos-2026/es-index.html.original es/index.html -Force
```

O manualmente: copia `index.html.original` a la raíz y renómbralo `index.html`; copia `es-index.html.original` a `es/` y renómbralo `index.html`, aceptando reemplazar ambos archivos.

Después publica nuevamente **ambos HTML** en el hosting. Si hay caché del sitio, vacíala.
La hoja `css/dia-de-muertos.css` dejará de cargarse al restaurar los originales; no se modificaron los estilos ni los scripts compartidos. Las imágenes pueden quedarse para futuras consultas.

## Publicar la invitación

Sube `index.html`, `es/index.html`, `css/dia-de-muertos.css` y la carpeta `img/DiaDeMuertos/`. Los respaldos no necesitan subirse al hosting: consérvalos localmente o en Git.

Las actividades se presentan como **en preparación**, basadas en `Dia de muertos.txt`. No se publicaron tareas internas, menciones de Discord ni horarios sin confirmar.

## Comprobación local

```sh
node --test tests/*.test.js
```

Tras restaurar las portadas, puedes quitar `tests/dia-de-muertos.test.js`, que comprueba específicamente la invitación temporal.
