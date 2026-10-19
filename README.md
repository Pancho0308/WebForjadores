# WebForjadores

## Publicación y caché

Los HTML de la raíz y `es/` usan rutas `/css/` y `/js/` con `?v=<hash>` para
que Cloudflare y el navegador no reutilicen archivos de una publicación anterior.
Sube los HTML y los recursos juntos; incluye también `.htaccess`.

Al modificar un CSS o JS, calcula su nueva versión con `git hash-object <archivo>`
y actualiza `?v=` en todos los HTML que lo usan con los primeros 12 caracteres.
Comprueba antes de publicar:

```sh
node --test tests/*.test.js
```

Si Cloudflare tiene una regla que ignora los parámetros de consulta, cambia esa
regla para incluirlos en la clave de caché y purga los recursos afectados.
