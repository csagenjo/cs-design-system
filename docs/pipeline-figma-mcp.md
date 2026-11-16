# Pipeline Figma MCP → código

Paso 4 del proyecto: comprobar qué entiende el conector de Figma (`get_design_context`)
de una pantalla real y cuánto hay que suponer para montarla con los componentes del
sistema. Dos pasadas sobre las mismas pantallas:

- **Pasada A** (16/11/2026): sin Code Connect. Este documento.
- **Pasada B**: con Code Connect en los componentes que usan las pantallas. Pendiente.

Pantallas (página "Supplier form"):

| Pantalla | Nodo | En código |
|---|---|---|
| Supplier form · Cards · Filled | 32924:574 | `src/App.jsx?screen=cards` |
| Supplier form · Tabs · Filled | 32936:9544 | `src/App.jsx?screen=tabs` |

## Pasada A — cómo fue

1. **La pantalla de Cards no cabe en una respuesta.** El conector devuelve solo la
   estructura ("sparse") y obliga a pedir cada capa: 1 + 8 llamadas (barra
   superior, título, 5 tarjetas, acciones). La de Tabs sí llega entera (~25 000
   tokens, al límite) porque solo trae la pestaña visible.
2. Con esas respuestas se compuso cada pantalla solo con átomos y organismos del
   repo: TopNavigation, SidebarMenu, PageTitle, Card, Headline, HelperText,
   SectionHeader, InputText, InputDropdown, InputTelephone, InputStepper,
   RadioGroup, Checkbox, FileUpload, Button, ButtonBar, Tabs/TabPanel,
   InlineNotification. Ningún estilo de componente nuevo; solo el layout de la
   página (filas, celdas, paddings) con tokens de spacing y layout.
3. Comparación con las capturas de Figma a 1440.

## Lo que el conector entiende bien

- **Tokens.** Cada valor llega como variable con su valor de reserva
  (`var(--input/inputcommon/root/borderwidth/generic, 1.5px)`). Traducirlo a
  `--ds-*` es mecánico salvo los nombres que no coinciden 1:1 (`cards` → `card`,
  `inputcommon` → `input`).
- **Descripciones de componente.** Llegan todas, y son lo más útil de la
  respuesta: "Code: src/organisms/ButtonBar.jsx", "Title siempre h1", "el nivel
  no es una propiedad", "en código: organisms/RadioGroup.jsx". Hoy hacen de
  Code Connect manual. Merece la pena que todas digan su fichero de código.
- **Nombres de capa.** `Header`, `Fields`, `Row`, `Cell`, `Section help`,
  `Registered address` describen la composición; con ellos el layout sale solo.
- **Estado y obligatoriedad.** Asterisco, ayuda, Disabled de "Internal code",
  pestaña seleccionada, radio marcado.

## Donde hubo que suponer

| # | Qué | Cómo se resolvió |
|---|---|---|
| 1 | Las instancias llegan aplanadas en `div`: no dice "esto es InputDropdown" | Deducido del nombre de capa (`Dropdown`, `Telephone Field`, `Stepper Build`) y de los iconos. Solo Cards, Headline, SectionHeader, Checkbox y Drawer Toggle llegan como componente con props |
| 2 | Variante de Button | Deducida del token (`bg/accent-primary`, `bordercolor/default-generic`, `paddinghor/medium`) |
| 3 | Nivel de encabezado | No está en el dato. h1 el título (lo dice Page Title), h2 cada sección, h3 los subgrupos |
| 4 | Pestañas ocultas | El conector solo trae la visible; el contenido de las otras 4 salió de la pantalla de Cards |
| 5 | Modo de Device | Las pantallas resuelven los tokens en Mobile (headline md 22, gutter 24); el código pinta Desktop (28, 32). Diferencia visual que no es un error del código |
| 6 | Medidas fijas viejas | Instancias con tamaños de antes de la rejilla estricta (stepper 148, file selector 288, hueco vacío de 359 para acciones del título). Se ignoraron: manda el componente |
| 7 | Iconos | Llegan como SVG temporales; se usó el átomo `Icon` por el nombre de la capa (`chevron-down`, `plus`, `log-out`). La skill del conector pide descargarlos: choca con la regla del repo |
| 8 | Comportamiento | Nada: qué valida cada campo, textos de error, dónde va el foco, añadir o quitar contacto, opciones de los desplegables. Todo inventado |
| 9 | Logo | Hueco de ejemplo con hex sueltos; se puso un texto |

## Diferencias código ↔ Figma que destapó

- **TabItem** no tenía icono a la izquierda ni icono de error a la derecha (sí en
  Figma). Añadidos: `icon`, `hasError`, `errorLabel` (v3.1), y `Tabs` los pasa
  por `items[]`.
- **Tokens de Tabs sin exportar:** `tabs/all/icon/fg/generic`,
  `tabs/all/errorIcon/fg/generic`, `tabs/all/root/gap/generic`. Están a mano en
  `tokens.css`; falta el export para confirmar el valor del icono (puesto a
  `fg/icon/default`).
- **ButtonBar:** en Figma "Delete" y "Save draft" de la izquierda son negros
  (Type Default); en código, teal. Abierto en `tech-debt.md`.
- **Fondo de página:** no hay token de componente para el lienzo de la pantalla;
  el banco usa `bg/page`. Lo resolverían las plantillas de layout (paso 5).
- **Plantilla de Vite:** `#root` limitaba el ancho a 1126. El banco lo anula.

## Comportamiento añadido (Tabs)

"Create supplier" está activo. Al pulsarlo valida (obligatorios, NIF/CIF,
código postal, emails, dígitos de control del IBAN) y, si hay errores:

- cada campo muestra su mensaje;
- las pestañas con errores llevan el icono a la derecha y el lector oye
  "has errors";
- la ButtonBar resume ("Three fields need your attention: 2 in Identification
  and 1 in Bank details.") en una región viva;
- se abre la primera pestaña con errores y el foco va a su primer campo.

Después de pulsarlo, los errores se recalculan al escribir. Con todo correcto
aparece "Supplier created.". `?screen=tabs` arranca con tres fallos para verlo;
`?screen=tabs&data=valid` arranca con los datos correctos.

## Para la pasada B

- Code Connect en los componentes de estas pantallas, empezando por los que hoy
  llegan aplanados: InputText, InputDropdown, InputTelephone, InputStepper,
  Button, ButtonBar, RadioGroup, FileUpload, TabItem/Tabs, PageTitle,
  TopNavigation.
- Poner Device = Desktop en las 6 pantallas antes de leerlas.
- Medir lo mismo: llamadas, tokens, piezas identificadas sin suponer.
