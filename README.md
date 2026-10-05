# CCM Automotive Experience

Sitio web experimental para Taller Automotriz CCM, Platanar, Costa Rica.

## Experiencia 3D

La Nissan Pathfinder es una construcción procedural WebGL/Three.js: no se utiliza una imagen del vehículo. El scroll controla las escenas Diagnóstico → Motor → Frenos → Suspensión → CCM y el usuario puede rotar el vehículo con el mouse o el dedo.

## Ejecutar

Por usar módulos ES de Three.js desde CDN, sirve el proyecto con un servidor HTTP (por ejemplo Live Server) o publícalo directamente en Netlify. No abras `index.html` como `file://` si el navegador restringe módulos.

## Estructura

- `index.html` — contenido y escena.
- `styles.css` — dirección visual cinematográfica.
- `script.js` — render WebGL, vehículo 3D e interacción por scroll.
