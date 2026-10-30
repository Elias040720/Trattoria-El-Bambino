# Trattoria El Bambino — propuesta web premium

Sitio estático editable en HTML, CSS y JavaScript, sin framework ni instalación de dependencias. Concepto editorial para la trattoria de Jr. Tomás Guido 124, Lince, Lima.

## Abrir el proyecto

1. Descomprime la carpeta completa.
2. Abre `index.html` con tu navegador. Para una vista fiel, sirve la carpeta con un servidor local:

   ```bash
   python -m http.server 5500
   ```

3. Visita `http://localhost:5500`.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Estructura, SEO, mapa y formulario de reserva |
| `styles.css` | Estética responsive, animaciones, estados, accesibilidad |
| `app.js` | Carta interactiva, selección de platos, WhatsApp, reserva, menú móvil y galería |
| `assets/*.webp` | Tres fotografías gastronómicas conceptuales originales |
| `assets/favicon.svg` | Favicon tipográfico provisional |
| `INVESTIGACION.md` | Hallazgos, fuentes, referencias e imágenes auténticas localizadas |
| `BRIEF_MEJORADO.md` | Brief de diseño y desarrollo para la siguiente iteración |
| `tests/smoke.test.mjs` | Pruebas estáticas automáticas sin dependencias |

## Qué funciona

- Navegación responsive con menú móvil accesible.
- Cuatro pestañas de carta: pastas, fusión peruana, pizzas y parrillas.
- Selección de platos sin precios; mensaje de consulta generado para WhatsApp.
- Solicitud de mesa con fecha, hora, número de personas y nota: **abre WhatsApp, no reserva automáticamente**.
- Galería con zoom, enlace a las fotos reales de Facebook y mapa con enlace a Google Maps.
- Animaciones de entrada que respetan `prefers-reduced-motion`, etiquetas semánticas, navegación por teclado, texto alternativo y JSON-LD de tipo `Restaurant`.
- Imágenes comprimidas en WebP; no se cargan bibliotecas de JavaScript.

## Comprobaciones

```bash
node --check app.js
node tests/smoke.test.mjs
```

Estas pruebas verifican rutas, estructura y condiciones básicas; no sustituyen una prueba visual en Chrome/Safari ni un control real de WhatsApp.

## Antes de publicar la web comercial

**Validación de contenido y autorización**

- Sustituir las tres imágenes de concepto por fotografías reales de la comida y el local, con autorización para uso web, y retirar las notas de `imagen conceptual`.
- Sustituir el emblema tipográfico por el logo oficial, si existe y el negocio autoriza su uso.
- Pedir la carta actual (nombres, ingredientes, alérgenos, precios, fotos), corregir el objeto `MENU` en `app.js` y eliminar la nota de carta orientativa.
- Confirmar el WhatsApp, horarios, alcance real del delivery, reservas y datos empresariales. Los horarios de distintos directorios discrepan.
- Si se agrega checkout, pagos, disponibilidad de mesas o recepción de datos, desarrollar un backend real con reglas, seguridad, privacidad y almacenamiento. El `schema.sql` original de La Chávez es de otra marca y **no se reutilizó**.
- Configurar el dominio final, política de privacidad cuando corresponda, OG image absoluta, Search Console y herramientas de medición si se aprueban.
- Hacer revisión formal WCAG 2.2, Lighthouse y pruebas reales de teléfonos antes del despliegue.

## Personalización rápida

- Colores y fuentes: variables `:root` de `styles.css`.
- Fotos: sustituye las rutas de `assets/` manteniendo nombres o actualízalas en `index.html` y `app.js`.
- WhatsApp: `CONFIG.whatsapp` en `app.js`, además de los enlaces estáticos de `index.html`.
- Platos y textos: objeto `MENU` en `app.js` y secciones en `index.html`.
- Mapa: reemplaza los enlaces del enlace compartido por el negocio y verifica el `iframe`.

**Nota:** Este es un prototipo no oficial de diseño, no el sitio publicado ni validado por Trattoria El Bambino. No se ha realizado compra, reserva ni contacto con el establecimiento.

## Fotografía de concepto

Las tres imágenes fueron creadas para este proyecto con una herramienta de generación de imágenes, no extraídas de clientes ni establecimientos reales. Prompts resumidos:

1. **Hero — `hero-pasta.webp`**: editorial gastronómico de pappardelle con ragú sobre mesa de nogal, iluminación ámbar y espacio negativo oscuro a la izquierda.
2. **Pizza — `pizza-artesanal.webp`**: pizza artesanal con mozzarella, tomate y albahaca, fotografía realista cálida.
3. **Fusión — `risotto-fusion.webp`**: risotto de inspiración huancaína con lomo y cebolla, fotografía realista sobre cerámica.

Se usan como *imágenes referenciales* y no acreditan la preparación exacta que se sirva en El Bambino.
