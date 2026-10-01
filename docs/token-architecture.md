# Token Architecture — CS Design System
*Estado: Retail ✅ · Youth Banking ✅ · Julio 2026*

## Cascada de colecciones

```
Base (157)
  └─ primitivos raw: hex, opacidades, dimensiones, tipografía
  └─ el código NUNCA los usa directamente

Theme (873 por tema × 2 temas activos)
  └─ mapea Base a roles semánticos POR TEMA
  └─ 2 temas activos: Overall (Retail) · Youth
  └─ Wholesale · Business · Private · Wireframe ELIMINADOS de la colección el 15/07/2026
     (decisión abierta — pueden volver más adelante, o no; ver "Estado de temas")
  └─ convenio: {rol}-light / {rol}-dark  (los dos valores posibles para el Mode)
  └─ el código NUNCA los usa directamente

Mode (364 × 2 modos: Light/Dark)
  └─ resuelve qué valor de Theme usar según modo UI activo
  └─ tokens SIN sufijo de modo — semánticos puros
  └─ EL LAYER QUE USA EL CÓDIGO → var(--ds-fg-primary), etc.

Component (1038 · 41 accent/visited visibles · 997 hidden)
  └─ tokens por componente, referencian SOLO Mode
  └─ convenio: {componente}/{dispositivo}/{parte}/{propiedad}/{estado}

Device (99 × 3: Mobile/Tablet/Desktop — mobile-first, Mobile = default)
  └─ tipografía y espaciados responsivos · hereda de Theme {rol}-mobile|-tablet|-desktop
  └─ capa paralela — no interviene en cascada de color
```

**Regla de oro:** `Component → Mode → Theme → Base`
Saltar capas rompe el dark mode y la multi-temabilidad.

### La tipografía NO necesita capa de Componente (regla, 22/07/2026)

La regla de oro de arriba aplica **al color**. La tipografía es la excepción documentada:

- El **color** siempre pasa por un token de Componente propio (`{componente}/fg/*`) porque cambia con Theme y Mode (light/dark, Retail/Youth). El token de Componente es el punto donde cada componente resuelve a qué token de Mode apunta — por eso no se puede saltar.
- La **tipografía** (`fontSize`, `fontWeight`, `fontFamily`, `lineHeight`) **no cambia con Theme ni Mode** — solo varía por dispositivo, que es exactamente para lo que existe la capa **Device** (capa paralela, no de color). Por eso un componente puede consumir `fontSize/headline/2xl`, `fontWeight/regular`, `fontFamily/headline`… **directamente de Device**, sin token de Componente intermedio.

Checkbox y Radio ya lo hacían así; desde 22/07 es regla explícita, no una excepción sin documentar. Headline y Helper Text la aplican (color vía Componente→Mode, tipografía directa de Device).

---

## Base tokens (157)

### Paleta de color — 9 familias

| Familia | Hex 500 | Rol Retail | Rol Youth |
|---|---|---|---|
| primary (teal) | #4BA9C0 | Hero CTA · superficies primarias | Soporte · acento |
| secondary (magenta) | #E02C7C | Acento secundario | Hero CTA · superficies primarias |
| tertiary (lavanda) | #B185C5 | Decorativo · containerShape | Decorativo · containerShape |
| neutral | #7B8390 | Grises de interfaz | Igual |
| info | #0287D0 | Quaternary · informativo | Igual |
| error | #D53737 | Feedback error | Igual |
| success | #4CAF50 | Feedback éxito | Igual |
| warning | #FFAE0C | Feedback aviso | Igual |
| annotation | #9747FF | Uso interno DS | Igual |

Cada familia: 11 pasos (50, 100–900, 950).

### Opacidades — dos familias distintas ⚠️ no mezclar

**`color/opacity/black/*` y `color/opacity/white/*`** — type: color — fills con transparencia.
- 4 niveles: 10% · 16% · 30% · 40%

**`opacity/*`** — type: number — para `opacity` CSS del elemento completo.
- 5 valores: 30 · 40 · 60 · 70 · 80

---

## Theme — Retail vs Youth Banking

| Aspecto | Retail | Youth |
|---|---|---|
| Hero de marca (CTA, primary surfaces) | primary/teal | secondary/magenta |
| Color de soporte | secondary/magenta | primary/teal |
| Tokens cambiados entre temas | — | 148 (primary↔secondary swap) |

### Reducción de profundidad de color primary/secondary (15/07/2026)

Los roles de **texto/icono** primary y secondary se aclararon un paso hacia el `500` de su familia, en **Retail y Youth**, en light y dark. Regla aplicada por búsqueda+reemplazo en Figma sobre `primary-light/-dark` y `secondary-light/-dark`: lo que estaba en base alta (700 en primary, 600 en secondary) pasó a `500`. Valores reales del diff `tokens/Theme/`:

**Roles primary → `color/primary/500`** (antes `/700`) · en Youth = `color/secondary/500` (antes `/700`):
```
fg/primary-light · fg/title/primary-light · fg/headline/primary-light
fg/label/primary-light · fg/icon/primary-light
fg/body|headline|label|icon/onSurface/static-primary-light
borderColor/primary-light
bg/containerShape/primary-light   ⚠️ único bg/* que cambió — ver nota
```
**Roles secondary → `color/secondary/500`** (antes `/600`) · en Youth = `color/primary/500` (antes `/600`):
```
fg/secondary-light · fg/label/secondary-light
fg/icon/secondary-light · fg/body/secondary-light
```
**Tokens nuevos añadidos** (no existían antes):
```
fg/body/primary-light  → color/primary/500   (Youth: secondary/500)
fg/body/primary-dark   → color/primary/300   (Youth: secondary/300)
```

**Roles `accent` — dirección CONTRARIA, hacia `/700`** (antes `500` o mixto). Son roles distintos de los primary/secondary planos, no mezclar:
```
fg/icon/accent-primary-light · borderColor/accent-primary-light · bg/containerShape/accent-light
→ color/primary/700   (Youth: color/secondary/700)
```

**NO cambió (intencional — intensidades separadas):**
- ramas `bold`: `bg/primary-bold-light` (600), `bg/secondary-bold-light` (600)
- ramas `subtle`/`medium` y `bg/accent-primary-light` (sigue en 300)

**Efectos secundarios en Component tokens:**
- `checkbox/all/root/bg/selected` dependía de `bg/primary-bold` (`#36879C`) y quedó desincronizado → corregido a mano a `bg/primary` (`#4BA9C0`). Si algún componente en código depende de tokens `-bold` para primary/secondary, es candidato a la misma revisión.
- ~~`pagination/web/activePage/bg/primary` → `bg/surface/primary-bold`~~ **Obsoleto.** Superado por la reconstrucción de Pagination del 18/07/2026: los rellenos ahora apuntan a `bg/surface/primary` (`#4BA9C0`) / `bg/surface/secondary` (`#E02C7C`), sin repunte a `-bold`, y el círculo de página actual es `selectedPage`, no `activePage`. Ver §Pagination — nomenclatura por Part.

> ⚠️ **Verificar:** `bg/containerShape/primary-light` es un token `bg/*` y cambió (700→500). Es coherente con la regla primary (su hermano `bg/containerShape/accent-light` fue a 700), pero conviene confirmar con Carol que fue intencional y no un efecto colateral del reemplazo global.

---

## Mode (364 tokens × Light/Dark)

Tokens semánticos que el código consume. Grupos principales:

- `fg/*` — 208 tokens: texto e iconos
- `bg/*` — 114 tokens: fondos y superficies
- `borderColor/*` — 36 tokens: bordes
- `opacity/*` — 6 tokens: overlays y hover

### bg/hover tokens — semántica de color

`bg/hover-primary/secondary/tertiary` mapean a los tres acentos del sistema en versión muy suave:
- `bg/hover-primary` → azul cielo (acento teal en hover de listas y filas)
- `bg/hover-secondary` → rosa muy pálido (acento magenta)
- `bg/hover-tertiary` → lila muy pálido (acento purple)

Uso: Advanced Selector, Account Selector, Table rows.

### bg/negative — ELIMINADO (01/07/2026)

`bg/negative` (rojo muy oscuro `#4f1111`) eliminado de Mode — sin consumidores definidos en el sistema. Cuando aparezca roto en algún componente, reasignar a:
- `bg/error` → para fondos sólidos de estado negativo/error
- `bg/error-subtle` → para superficies suaves de estado negativo

### `bg/default` · `bg/page` · `bg/container` — escalera de elevación (11/08/2026)

Tres tokens neutros que en **light** son casi indistinguibles pero en **dark** revelan una escalera de elevación real — cuanto más elevada la superficie, más clara en dark mode:

| Token | Light | Dark | Rol |
|---|---|---|---|
| `bg/default` | `#FFFFFF` | `#050506` | lienzo base de la app (el más oscuro en dark) |
| `bg/page` | `#F9FAFA` | `#464B53` | área de contenido, un nivel por encima |
| `bg/container` | `#FFFFFF` | `#606772` | superficie de tarjeta/panel elevada (scope `FRAME_FILL`/`SHAPE_FILL`, el más claro en dark) |

**Origen del hallazgo:** `table/all/cellCommon/bg/onSurface` estaba aliasado a `bg/default` en vez de `bg/container` — coincidía en light (`#FFFFFF`) pero en dark habría puesto las celdas "onSurface" casi negras (el lienzo base) en vez de leerse como tarjeta elevada. Mismo patrón que la trampa `inverse`/`onColor` de arriba, pero en la familia `bg/*` en vez de `fg/*`. Corregido el alias en Figma a `bg/container`. `--ds-bg-container` no existía en absoluto en `tokens.css` — añadido al Mode layer (antes faltaba, probablemente la razón original por la que `onSurface` cayó en `bg/default` como sustituto).

**De paso, auditada y corregida toda la escala neutra en dark de `tokens.css`** (estaba desincronizada de Figma, en algunos casos con el orden invertido): `bg-default` `#191C1F`→`#050506` · `bg-page` `#050506`→`#464B53` · `bg-subtle` `#2C2F34`→`#7B8490` · `bg-disabled` sin override→`#9AA1AA` (heredaba el light `#EEEFF1`, casi blanco, en todos los estados disabled del sistema).

### `*/inverse` vs `*/onColor` — trampa de dark mode ⚠️ (confirmada y cerrada 11/08/2026)

Mismo valor en **light mode**, distinto en **dark mode** — existe en las tres familias `fg/label/*`, `fg/body/*` y `fg/icon/*`, no solo icono:

- `*/inverse` → se **invierte** con el modo (blanco en light → negro en dark, o al revés). Correcto SOLO cuando el fondo sobre el que se apoya **también invierte** — es decir, `bg/inverse` (Button default-filled, CTALink primary). Ahí ambos invierten juntos y el contraste se mantiene.
- `*/onColor` → se **mantiene fijo** (blanco) en los dos modos. Correcto cuando el fondo es una **superficie de color de marca/feedback que NO invierte** (`bg/primary`, `bg/secondary`, `bg/error`, `bg/success`… — todas resuelven al mismo tono en light y dark, solo cambia de intensidad).

**Regla de detección:** antes de fijar un color de texto/icono sobre un fondo relleno, resolver el `bg` en Light y Dark — si el hex es el mismo en los dos modos, el fg va a `onColor`; si el hex cambia entre modos, el fg va a `inverse`. Nunca decidir por el nombre del token ni por lo que "parece coherente" visualmente en un solo modo.

**Auditoría completa (11/08/2026):** verificado en vivo (resolución de cadena de alias en Figma, no el JSON cacheado) que el bug era real y no solo teórico — 7 casos confirmados con `*/inverse` sentado sobre un `bg` que no invierte, todos corregidos (en Figma y en `tokens.css`): `button/all/label/fg/accent-primary`, `ctaLink/all/label/fg/accent-highEmphasis`, `chip/all/label/fg/selected`, `chip/all/icon/fg/selected`, `badgeNotification/all/label/fg/generic`, `pagination/root/text/fg/selectedPage`, `pagination/activePage/fg/hover` — todos realiasados a `*/onColor`. En paralelo, `--ds-fg-label-inverse`/`--ds-fg-body-inverse`/`--ds-fg-icon-inverse` (que sí necesitaban invertir, para Button/CTALink default-filled) no tenían override dark en `tokens.css` — añadido (`#050506`), y `--ds-button-fg-default-filled`/`--ds-cta-link-fg-primary` recableados de `fg-onColor` (no invertía, incorrecto ahí) a `fg-label-inverse`.

### Sufijos de intensidad en bg y fg

- `-subtle` → intensidad baja (superficie muy suave)
- `-medium` → intensidad media
- `-bold` → intensidad alta (superficie saturada)

**No confundir** con los sufijos `-light/-dark` de Theme, que indican los dos valores posibles para light/dark mode.

---

## Component tokens (1038)

### Patrón "Common + específico"

Cuando una familia de componentes comparte estructura, los tokens compartidos viven en un grupo `Common` separado:

```
Input/
  InputCommon/   ← 27 tokens compartidos (root/label/helper/validation/valueText)
  InputText/     ← iconLeft, iconRight
  InputTelephone/ InputAmount/ InputDate/ InputDropdown/ InputStepper/

advancedSelector/all/   ← tokens propios del Advanced Selector
accountSelector/all/    ← tokens propios del Account Selector
```

**Borrowing intencional de InputCommon hacia Selector:** los tokens de `label/fg`, `helper/fg` y `validation/fg/*` son compartidos entre la familia Input y ambos Selectors. Es una decisión de arquitectura — todos son componentes de formulario y deben tener un único punto de mantenimiento para esos tokens.

### Tokens de icono — gestión en CSS, no en Figma

Los iconos son vectores de la librería Lucide. Figma no permite vincular el fill de un vector a una variable de componente → el color en Figma apunta al Mode token correspondiente (aproximación visual).

En código, el color se aplica via `currentColor` en el componente padre:
```css
/* Component token */
--ds-selector-icon-fg-primary: var(--ds-fg-icon-primary)
/* En el JSX, se aplica al contenedor, no al SVG */
color: var(--ds-selector-icon-fg-primary)
/* El SVG hereda via currentColor */
```

### Nomenclatura de color de icono — por contraste, no por posición ni Variant (14–15/07/2026)

Los tokens de color de icono se nombraban por su **posición** (`iconLeft`/`iconRight`) o por la **Variant de origen** (`default-primary`, `accent-generic`). Ninguno de los dos describe lo que el token resuelve. Regla nueva: **nombrar por el contraste real** — "¿qué necesita verse sobre este fondo?".

**Button e Icon Button** — consolidado en Figma:
```
Antes: iconLeft/fg/* + iconRight/fg/*   (16 tokens, duplicados por posición y por Variant)
Ahora: button/all/icon/fg/*             (4 tokens, por contraste)
  on-color            → icono sobre fondo relleno (blanco)      → fg/icon/onColor
  on-outline-default  → icono sobre contorno, tema default
  on-outline-accent   → icono sobre contorno, tema accent
  disabled            → icono deshabilitado
```
La posición (left/right) **nunca** determina el color. El criterio es el contraste del **estado concreto**, no la Variant: en Secondary/Tertiary el fondo pasa a relleno en Hover y Focus Hover, así que ahí el icono es `on-color` (blanco) aunque la Variant no sea Primary. Como `currentColor` propaga el color del padre al SVG, esto se resuelve en CSS puro vía los estados del botón — sin token de icono por estado.

`button/all/icon/size/*` también consolidado (antes `iconLeft/size` + `iconRight/size` duplicados).

> **Button — sincronizado con tokens.css (15/07/2026):** `button/all/icon/size/*` → `--ds-button-icon-size-{small,medium,large}` (`sizing/2xs·xs·sm` = 16/20/24). El **color** de icono NO tiene token propio: se hereda vía `currentColor` del botón, y ese color lo fijan los `--ds-button-fg-*` existentes (`on-color`→`fg/*-filled`, `on-outline-accent`→`fg/accent-outline`, `on-outline-default`→`fg/default-outline`, `disabled`→`fg/disabled`). Regla CLAUDE.md §4 — no se crea token de icono por estado.

**Selector y Account Selector** — mismo patrón aplicado (15/07/2026): `Selector/iconLeft/fg/*` == `Selector/iconRight/fg/*` (mismo valor `#4BA9C0` primary / `#B9BEC4` disabled), consolidados en CSS a un único par por componente:
```css
--ds-selector-icon-fg-primary   / --ds-selector-icon-fg-disabled
--ds-account-selector-icon-fg-primary / --ds-account-selector-icon-fg-disabled
```
Left y right comparten color; solo el tamaño (`--ds-selector-icon-left/right-size`, ambos 20px) sigue separado por posición — candidato a la misma consolidación en una pasada futura.

### Nomenclatura `default`/`secondary` vs `generic` — eje de color por Variant (01/09/2026, Collapsible)

Al construir `Collapsible` se encontró un family de 15 tokens (`collapsible/all/*`) definido en Figma pero completamente sin usar en el componente real (ver `architecture.md`, sesión 1 sept). Al rebindear, salió a la luz una nomenclatura confusa que se corrigió ahí mismo:

```
Antes: collapsible/all/{root/borderColor,label/fg}/primary   → negro
       collapsible/all/icon/fg/primary                        → negro (mismo rol, nombre distinto)
       collapsible/all/icon/fg/generic                        → rosa  (mal nombrado: no es "genérico", es el color secondary)
Ahora: collapsible/all/{root/borderColor,label/fg,icon/fg}/default    → negro, consistente en las 3 familias
       collapsible/all/{root/borderColor,label/fg,icon/fg}/secondary → rosa,  consistente en las 3 familias
       collapsible/all/root/{borderRadius,borderWidth,gap,paddingHor,paddingVer}/generic → sin cambio, comparten valor entre default y secondary
```

**Regla fijada (CLAUDE.md §5):** en el eje de color que varía por Variant de un componente, usar **`default`** (sin color de marca) y **`secondary`** (con color de marca) — nunca `primary`, que induce a pensar en el teal de marca aunque el valor real sea negro/rosa. Reservar **`generic`** solo para propiedades que valen igual en las dos variantes (radio, grosor, gap, padding). Si un token `generic` en realidad diverge por variante, está mal nombrado.

### InlineNotification — 19 tokens, cero rebind (01/09/2026)

A diferencia de Collapsible (arriba) e Icon Button, aquí no hubo nada que corregir: los 19 tokens
`inlineNotification/all/*` ya estaban bien enlazados en las 12 variantes antes de escribir código.

```
inlineNotification/all/root/borderColor/{error,success,information,warning} → color de borde por Type
inlineNotification/all/icon/fg/{error,success,information,warning}          → mismo color, en el icono
inlineNotification/all/root/bg/{default,borderless}                         → ambos blancos — Simple no
                                                                                tiene token bg (sin fondo)
inlineNotification/all/{title,text}/fg/generic                              → negro fijo, NO varía por Type
```

El color de `type` tiñe **solo** icono y borde — título y mensaje se quedan siempre en negro, en las 3
variantes de `style` (Default/Borderless/Simple) y los 4 `Type`. Sirve como caso de referencia contrario
al de Collapsible: cuando el propio archivo de Figma ya está bien construido, EXPLORE debe confirmarlo
por dato (ver todas las variantes, no una muestra) antes de asumir que hace falta trabajo de rebind — no
todo componente nuevo arrastra la misma deuda.

### Tooltip — 8 tokens, la pareja fg/bg SÍ invierte junta (02/09/2026)

```
tooltip/all/root/bg/generic          → bg/inverse         (negro light / blanco dark)
tooltip/all/text/fg/generic          → fg/label/inverse    (blanco light / negro dark)
tooltip/all/root/{gap,paddingHor,paddingVer,borderRadius}/generic → literales de geometría
```

Comprobado explícitamente vía cadena de alias en vivo (`use_figma`, no el hex resuelto de un solo modo
que devuelve `get_variable_defs`) antes de escribir `tokens.css` — este proyecto ha cazado varias veces
el patrón contrario (un lado de la pareja fg/bg invierte con el modo y el otro se queda fijo: Chip,
Pagination, Button default-filled, CTALink primary — ver §10 de CLAUDE.md). Aquí **no** es ese bug: `bg` y
`fg` usan el par `*-inverse` los dos, así que invierten juntos y el contraste se mantiene en ambos modos
— negro-sobre-blanco en light, blanco-sobre-negro en dark, sea cual sea el tema de la app. `--ds-bg-inverse`
y `--ds-fg-label-inverse` ya llevaban overrides dark correctos desde el audit del 11/08 (Snackbar y Button
default-filled los usan igual) — no hizo falta tocar la capa Mode.

La flecha (vector `arrow`, 8×6 en Top/Bottom · 6×8 en Left/Right) no tiene Variable propia en Figma —
geometría literal leída de `get_metadata` por variante, tratada como token literal de Componente
(`--ds-tooltip-arrow-base`/`-arrow-length`), mismo criterio que `--ds-snackbar-root-shadow`.

### LoadingSpinner — bug real: "inverted" apuntaba al fondo de página, no a blanco fijo (02/09/2026)

```
loadingSpinner/all/root/borderColor/primary   → bg/surface/primary  (teal, NO invierte, pero es de la
                                                                       familia bg para un glifo)
                                               → fg/icon/primary    (✅ Carol lo corrigió en paralelo —
                                                                       mismo valor, familia semántica
                                                                       correcta: --ds-fg-icon-primary,
                                                                       ya usado por 15+ componentes)
loadingSpinner/all/root/borderColor/inverted  → bg/default          (❌ invierte: blanco light / casi
                                                                       negro dark — MAL para un color
                                                                       que debe verse sobre superficie
                                                                       de color en los dos modos)
                                               → fg/icon/onColor    (✅ corregido — blanco fijo, mismo
                                                                       criterio que la regla de §5)
```

A diferencia de Tooltip (arriba), aquí sí había bug — y de un tipo nuevo: no es la pareja fg/bg de un
componente (bg y su propio texto), sino un color de icono/glifo que necesita quedarse fijo porque se
renderiza SOBRE otra superficie que no es la del propio spinner. El nombre `borderColor/inverted` sugería
"el color opuesto al primary", pero estaba resuelto contra `bg/default` — el fondo de la página, que sí
cambia con el modo — en vez de un blanco fijo tipo `fg/icon/onColor`. Sin corregir, un `LoadingSpinner
color="inverted"` dentro de un elemento de fondo oscuro (el caso de uso real: dentro de un `Button` en
`loading`) se habría vuelto casi invisible en dark mode. Reenlazado en Figma a `fg/icon/onColor`
(confirmado blanco en Light y Dark vía cadena de alias) antes de escribir código — no se trabajó alrededor
del bug en CSS, se corrigió en origen, mismo criterio que todos los bugs anteriores de este tipo.

**Actualización (03/09/2026):** variante y token renombrados de `Inverted`/`borderColor/inverted` a
`onColor`/`borderColor/onColor` — mismo criterio de nomenclatura fijado al construir Progress Bar el mismo
día ("onColor" describe mejor "color fijo para cualquier superficie de color" que "Inverted"). `Primary` no
cambió — es un color de marca real, no un eje de superficie. Cambio de API pública en `LoadingSpinner.jsx`
(`color="inverted"` → `color="onColor"`) sobre un átomo ya mergeado en `main`.

El vector `Progress (Stroke)` de Figma es un path RELLENO (ring con hueco vía `windingRule: EVENODD`), no
un stroke real pese al nombre — confirmado con `strokes: []` vacío y un `fills` real. Un path relleno
estático no puede animarse como un spinner de verdad, así que en código se reconstruye como un `<circle>`
con stroke real y `stroke-dasharray` — el `strokeWeight` de Figma (2/3/4/6 en xs/sm/md/lg) sí es un dato
real y coincide exacto con `size/8` en las 4 variantes, así que se usó tal cual para el grosor del trazo.

### ProgressBar — el indicator no era un bug, el track sí (03/09/2026)

```
progressBar/all/indicator/bg/generic  → bg/surface/secondary  (mismo color en Default Y onColor —
                                                                  A PROPÓSITO, confirmado contra
                                                                  Sistema Origen, no un bug)
progressBar/all/root/bg/default       → bg/page   (❌ era esto)  → bg/subtle   (✅ corregido)
progressBar/all/root/bg/onColor       → bg/default (❌ era esto — invierte) → bg/onColor (✅ fijo)
progressBar/all/text/fg/generic       → fg/default  (Label Y Helper text comparten el mismo color)
```

**El hallazgo que cambió el diagnóstico:** el archivo real de Sistema Origen (no la copia limpia de IP)
muestra que la propiedad de variante se llama literalmente `Secondary` en el panel de Variants, pero la
documentación de esa misma página la describe como `onPrimary` — una inconsistencia que ya existía en el
sistema de referencia, no introducida al limpiarlo. Con ese dato, el indicator compartido entre variantes
dejó de parecer un bug: Sistema Origen renderiza el mismo color de indicator en las dos columnas, a
propósito — el eje real siempre fue "¿sobre qué superficie va este progress bar?", no un color de marca
alternativo. Carol renombró la variante a `onColor` (mejor que `onPrimary`: sirve para cualquier superficie
de color, no solo teal — mismo criterio que `fg/icon/onColor`, §5).

**El track sí tenía un bug real**, y de un tipo distinto a los anteriores de esta sesión: no era un binding
apuntando a la variable equivocada por accidente — apuntaba a tokens de fondo de **página** (`bg/page`,
`bg/default`) en vez de a un color de superficie propio del componente, así que por definición el track
resultaba invisible justo en el escenario donde se esperaría que se viera mejor (`Default` sobre `bg/page`,
`onColor` sobre `bg/default`). Confirmado con **cálculo real de contraste WCAG** sobre los valores hex
resueltos de cada candidato, no a ojo:

| Candidato | Light vs bg/page | Light vs bg/default | Dark vs bg/page | Dark vs bg/default |
|---|---|---|---|---|
| `bg/subtle` (#EEEFF1) | ~1.1:1 ❌ | ~1.15:1 ❌ | 3.4:1 | 8.7:1 |
| `borderColor/default` (#9AA1AA) | ~2.5:1 ❌ | ~2.6:1 ❌ | 4.5:1 | 10.5:1 |
| `borderColor/emphasis` (#2C2F34) | 12.9:1 | 13.5:1 | 8.8:1 | 20.4:1 |

Ningún gris de la paleta actual da un contraste "correcto pero sutil" (~3:1) contra fondos casi blancos en
light mode — o es casi invisible o es tan fuerte como un texto de máximo énfasis. Dado que el track solo
necesita verse bien en su PROPIO contexto de uso (Default sobre `bg/page`, onColor sobre una superficie de
color real, nunca al revés), la solución no fue perseguir un gris universal sino corregir el binding para
que cada variante apunte a un token que sí resuelve bien en su escenario real: `bg/subtle` para Default,
`bg/onColor` (blanco FIJO en los dos modos, no `bg/default` que invierte) para onColor. Verificado con las
mismas 4 combinaciones tras el fix — contraste correcto en las cuatro.

**Límite de uso real, encontrado probando contra 7 superficies (no 1) a petición de Carol.** El fix de
contraste de arriba resuelve el track, pero no cubre todo: sobre `bg/surface/secondary` (rosa) el indicator
—siempre `bg/surface/secondary`, el mismo valor en las dos variantes— se funde con el fondo, porque ahí
fondo e indicator son literalmente el mismo rosa. Y el texto (`text/fg` = `fg/default`, fijo casi negro en
las dos variantes) no tiene versión para `onColor`, así que sobre una superficie oscura de verdad como
`bg/inverse` se vuelve ilegible, aunque track e indicator sigan funcionando ahí. Decisión de Carol: no
rediseñar el componente — documentar el límite. `onColor` se usa sobre `bg/surface/*` de saturación media o
subtle, EXCEPTO `bg/surface/secondary`.

### SegmentedControl — tokens limpios, pero cero estados construidos antes de esta sesión (03/09/2026)

```
segmentedControl/all/root/bg/generic          → bg/subtle       (track, igual que rootSegment/bg/generic)
segmentedControl/all/rootSegment/bg/generic   → bg/subtle       (unselected — mismo valor que root, a
                                                                   propósito: el segmento se funde con el
                                                                   track cuando no está seleccionado)
segmentedControl/all/rootSegment/bg/selected  → bg/inverse      (negro light / blanco dark)
segmentedControl/all/label/fg/generic         → fg/label/default
segmentedControl/all/label/fg/selected        → fg/label/inverse (pareja correcta con bg/selected —
                                                                    invierten JUNTOS, no es el bug fg/bg
                                                                    ya cazado en Chip/Pagination/Button)
segmentedControl/all/rootSegment/bgMix/hover           → opacity/hover/default  (10% negro light / 10%
                                                                                   blanco dark)
segmentedControl/all/rootSegment/bgMix/hover-selected  → opacity/hover/default-inverse (10% blanco light /
                                                                                          10% negro dark —
                                                                                          opuesto a propósito,
                                                                                          aclara lo oscuro)
segmentedControl/all/rootSegment/bgMix/pressed         → opacity/pressed = 80  (NO es un color-mix como
                                                                                 hover — es un opacity plano
                                                                                 sobre todo el segmento,
                                                                                 mismo mecanismo que
                                                                                 --ds-icon-button-opacity-pressed)
segmentedControl/all/rootSegment/borderColor/focus-inner/-outer, borderWidth/focus → mismos tokens de foco
                                                                                       ya usados en otros
                                                                                       componentes
```

A diferencia de todos los componentes anteriores de Sprint 4, aquí el problema no estaba en los BINDINGS
(los tokens de `.Segment` ya resolvían correctamente, incluida la pareja fg/bg de `selected` — invierten
juntos, sin bug) sino en que **el componente no tenía ningún estado de interacción construido todavía**:
Figma solo exponía un eje `Size`, y la composición de arriba (`Number×Selected`) enumeraba combinaciones en
vez de resolverse por composición — mismo antipatrón ya evitado en Table/CellActions/FileSelector, ignorado
por completo en código (`SegmentedControl.jsx` compone N segmentos libremente, sin el límite de 5 de Figma).

Construir los estados (Hover/Focus/Pressed × Size × Behavior = 24 variantes reales) fue un trabajo conjunto
con Carol en Figma, con 3 bugs reales encontrados sobre la marcha: el `cornerRadius` del wrapper exterior del
foco en `0` en vez de `radio interior + padding` (dejaba un hueco irregular en la curva); `primaryAxisAlignItems`/
`counterAxisAlignItems` sin copiar al crear el wrapper (el label perdía el centrado); y las 3 variantes
Hover+Selected usando `bgMix/hover` en vez de `bgMix/hover-selected` sin el fill base `bg/selected` (el hover
se veía como un gris casi transparente en vez de un negro aclarado). El anillo de foco en sí replica la
técnica real de Checkbox (2 capas con auto-layout+hug, sin posiciones fijas) — el primer intento se hizo por
error en un nodo huérfano fuera del component set real, detectado por Carol y corregido.

### Accordion — 2 fugas de IP reales, no solo tokens mal nombrados (08/09/2026)

```
accordion/all/title/fg/generic      → fg/default   (#050506) — título, correcto
accordion/all/body/fg/generic       → fg/default   (#050506) — contenido, correcto
accordion/all/icon/fg/generic       → fg/default   (#050506) — chevron, correcto
accordion/all/title/borderTopColor/generic     → ❌ ID de variable con formato de
                                                    librería EXTERNA, ya irresoluble
                                                    (getVariableByIdAsync → null).
                                                    Valor cacheado #0d0804, no coincide
                                                    con el negro estándar del sistema
                                                → ✅ reenlazado a borderColor/default
                                                    (#9AA1AA) — mismo token que ya usa
                                                    el rectángulo Border inferior
accordion/all/text/fg/generic       → huérfano, ya no resuelve a ninguna Variable local
                                        y ningún nodo real lo consume — ignorado
accordion/all/button/bg/pressed     → nombrado como color, se consume como opacity (80%)
                                        sobre todo el bloque — mismo patrón que Icon
                                        Button/Segmented Control, no es un color-mix
```

A diferencia de todos los componentes anteriores de esta sesión, aquí no bastaba con revisar a qué Variable
apunta cada binding — el `fontFamily/default` del texto del título SÍ tenía la Variable correcta enlazada
(confirmado siguiendo su cadena de alias completa hasta `Nunito`), pero el `fontName` REAL renderizado en el
nodo era `{family: "<tipografía de La Empresa>", style: "Bold"}` — el nombre real de una tipografía de una empresa real. Figma
permite sobreescribir manualmente la fuente de un nodo de texto sin romper el binding de su Variable, así
que el token "parece" correcto mirando solo el panel de Variables — hace falta comprobar la propiedad
`fontName` real del nodo, no solo su binding. Barrido completo de los 12 nodos de texto del componente por
dato: solo 1 estaba afectado (el resto ya usaba Nunito correctamente). Corregido sin tocar el binding, solo
el `fontName` real.

El segundo hallazgo (`borderTopColor`) es la primera vez en el proyecto que una referencia de Variable
resulta ser directamente irresoluble — no un valor equivocado, sino un ID con formato de librería externa
(hash largo, no el formato corto de IDs locales de este archivo) que ya no apunta a nada. Mismo criterio que
los fixes fg/bg anteriores: se corrige en origen (reenlazar a un token local real), no se trabaja alrededor
en CSS.

**Actualización, mismo día — simplificación real, no solo bindings corregidos.** Carol lo dejó explícito:
había pedido simplificar los tokens de Componente, no solo enlazarlos bien. Resultado final:

```
accordion/all/fg/text/generic     → fg/default   (#050506) — título Y cuerpo, un solo token
accordion/all/fg/icon/generic     → fg/default   (#050506) — icono, scope STROKE_COLOR propio
accordion/all/border/color/generic → borderColor/default (#9AA1AA) — línea superior E inferior
accordion/all/border/width/generic → 1 (FLOAT)
accordion/all/opacity/pressed      → opacity/pressed (80, FLOAT) — antes "button/bg/pressed"
accordion/all/button/bg/hover      → bg/hover-primary (sin cambios, ya era real)
```

De 15 tokens de color/ancho fragmentados a 6. La primera propuesta de simplificación fusionaba título,
cuerpo E icono en un único color — Carol corrigió: "recuerda que distinguimos entre textos e iconos... los
padres del grupo deben ser bg, fg, border" — la norma real de nomenclatura del proyecto anida `text`/`icon`
**dentro** de `fg` (no los junta solo porque hoy coincidan en valor), y el icono necesita su propio scope
`STROKE_COLOR` en Figma porque los iconos de este sistema son vectores con stroke, no fill — ya estaba así
de correctamente configurado, confirmado por dato (`variable.scopes`) antes de asumir que hacía falta
arreglarlo. Los 6 tokens de borde fragmentados (`title/borderTopColor`/`-BottomColor`/`-TopWidth`/
`-BottomWidth`, `content/borderBottomWidth`/`-BottomColor`) resultaron ser un único concepto repetido —
`content/borderBottomColor/generic` (`#eeeff1`) era además un color genuinamente distinto, alimentando un
stroke suelto que solo existía en 1 de las 8 variantes — cruft real, no una excepción de diseño. Al intentar
borrar los tokens viejos aparecieron 3 capas más de bindings de ancho de stroke sin pintura real asociada
(`Title + Action` y el frame raíz de cada variante) — vestigios sin efecto visual, limpiados antes de poder
completar el borrado.

**Actualización, mismo día — `border/width/generic` probó aplicarse en 2 lados, luego revertido a 1.** Carol
probó cambiar el trigger en Figma de borde solo-arriba a arriba-Y-abajo en el frame `Title`. Consecuencia
directa asumida en ese momento: el prop `isLast` (y el rectángulo `Border` que dependía de él) dejaría de
hacer falta — en una lista apilada, el borde inferior de un item y el superior del siguiente caerían en el
mismo píxel con el mismo color y grosor. Se eliminó de `Accordion.jsx` sobre esa base. **Carol revirtió el
cambio en Figma poco después** — el rectángulo `Border`/propiedad `Last` seguía haciendo falta, así que
`Title` volvió a borde solo-arriba ("había ignorado el border, pero como es necesario he aplicado los strokes
de nuevo, así que revisa de nuevo"). Reconfirmado el estado real en Figma: `Title` de nuevo solo-arriba,
`Border` sigue presente y visible con su propio stroke inferior. `isLast` restaurado en `Accordion.jsx`,
mecanismo original intacto. El organismo `AccordionGroup` (`src/organisms/`) compone varios `Accordion` con
gap `0` fijo en el propio organismo y aplica `isLast` automáticamente al último item — `multiple` decide si
se permite más de un item abierto a la vez.

### AmountView — convención plain/soft/solid (01/07/2026)

Sustituyó la nomenclatura anterior (`positiveHighEmphasis`, `negativeHighEmphasis`, `negative`):

```
amountView/all/
  root/
    bg/
      positive-solid  → bg/success          (verde sólido)
      positive-soft   → bg/success-subtle   (verde suave)
      negative-solid  → bg/error            (rojo estándar — NO bg/error-bold ni bg/negative)
      negative-soft   → bg/error-subtle     (rojo suave)
      disabled        → bg/disabled
    borderRadius/ paddingHor/ paddingVer/ gapHor/   (geometría)
  fg/
    generic   → fg/body/default   (negro, para fondos claros)
    onColor   → fg/body/onColor   (blanco, para fondos sólidos)
    disabled  → fg/body/disabled
```

**Lógica de legibilidad WCAG AA:**
- `positive-solid` (bg/success verde): texto `generic` (negro) → ratio ~5.2:1 ✅
- `negative-solid` (bg/error rojo): texto `onColor` (blanco) → ratio ~9.8:1 ✅

**Nota de implementación:** `align-self: flex-start` + `flex: 0 0 auto` obligatorio en la raíz para que la píldora haga hug cuando vive en un contenedor `flex-direction: column`.

### BadgeHighlight — corrección de fondos (01/07/2026)

```
badgeHighlight/all/root/bg/
  emphasis   → bg/secondary-subtle   (rosa pálido magenta)
  neutral    → bg/surface/default    (antes: bg/page — incorrecto)
  positive   → bg/success-subtle     (antes: bg/success sólido — icono invisible)
  negative   → bg/error-subtle       (antes: bg/negative oscuro — icono invisible)
  disabled   → bg/disabled

badgeHighlight/all/icon/fg/
  emphasis   → fg/icon/secondary   (magenta)
  neutral    → fg/icon/subtle      (gris)
  positive   → fg/icon/success     (verde sobre fondo suave)
  negative   → fg/icon/error       (rojo sobre fondo suave)
  disabled   → fg/icon/disabled
```

Variantes renombradas en Figma: `Neutral High Emphasis` → `Emphasis`, `Neutral Low Emphasis` → `Neutral`.

### Selector families — estado de tokens de icono

**Color de icono — CREADO y sincronizado (15/07/2026).** Figma expone `Selector/iconLeft/fg/{primary,disabled}` y `Selector/iconRight/fg/{primary,disabled}` (mismo valor left/right: `#4BA9C0` primary, `#B9BEC4` disabled → Mode `fg/icon/primary` / `fg/icon/disabled`). Consolidados en `tokens.css` a un único par por componente, sin distinción de posición:

```css
--ds-selector-common-icon-fg-primary   → var(--ds-fg-icon-primary)
--ds-selector-common-icon-fg-disabled  → var(--ds-fg-icon-disabled)
/* alias por componente */
--ds-selector-icon-fg-primary  · --ds-selector-icon-fg-disabled
--ds-account-selector-icon-fg-primary · --ds-account-selector-icon-fg-disabled
```

Consumido por `SelectorInvoker` · `SelectorListItem` · `AccountSelectorInvoker` · `AccountSelectorListItem` vía `color:` sobre el contenedor + `currentColor` en el SVG (componente `Icon` compartido). Los sub-componentes antiguos `.Icon Left`/`.Icon Right` ya no existen en Figma.

**Aún pendiente de crear:**
```
advancedSelector/all/root/borderColor/focus-inner   ← no bloqueante
accountSelector/all/root/borderColor/focus-inner    ← no bloqueante
```
(Deuda conocida — el focus-inner del Country Picker/Advanced List Item se ve en teal en vez de blanco; ver deuda técnica en CLAUDE.md.)

---

### Pagination — nomenclatura por Part (18/07/2026)

`.Parts` de Pagination se reconstruyó desde cero: cada parte tenía estructura interna distinta (Link anidado, Frame duplicado, sin fondo…) y ahora comparten contenedor 32×32 → fondo (si aplica) → contenido, sin envoltorios extra.

**Renombrado de tokens — nombres cruzados heredados de Sistema Origen, ya corregidos para coincidir con el Part real:**

| Antes | Ahora | Es |
|---|---|---|
| `arrowLeft/*`  | `previous/*`     | flecha chevron-left |
| `arrowRight/*` | `next/*`         | flecha chevron-right |
| (intuición: actual) | `activePage/*` | el **Link** de texto subrayado (resto de páginas) |
| (intuición: otras)  | `selectedPage/*` | el **círculo** relleno de la página actual |

⚠️ **`activePage` ↔ `selectedPage` van cruzados respecto a la intuición.** Mapear SIEMPRE por el nombre del Part, no por lo que sugiere "Active"/"Selected": `activePage` = Link, `selectedPage` = círculo.

**Regla de contraste — caso de referencia (idéntica a Button/Icon Button):** contenido en blanco (`fg/icon/onColor` para icono, `fg/label/inverse` para texto) cuando el fondo del estado es **relleno/sólido**; oscuro cuando es **contorno**. En Pagination el fondo se rellena en el hover de `previous`/`next`/`dots` (chevron/…, van a blanco) y de forma persistente en `selectedPage` (círculo). El resto (Enabled/Focus/Pressed) es contorno → color por Variant (primary teal / secondary rosa).

Dark mode: los rellenos usan `fg/icon/onColor` (blanco en ambos modos), nunca `fg/icon/inverse` (se invierte a negro). El JSON exportado ya está limpio de `inverse` de icono.

**Mapa `--ds-pagination-*` → Mode:**
```css
/* selectedPage — círculo */
selected-bg-primary/secondary/disabled → bg/primary · bg/secondary · bg/disabled
root-text-fg-selected                  → fg/label/inverse   /* ⚠ ver deuda abajo */
/* activePage — Link subrayado */
active-fg-primary/secondary/hover/disabled → fg/label/default · secondary · inverse · disabled
active-bg-hover-primary/secondary          → bg/primary · bg/secondary
active-border-bottom-width                 → 1px (borderWidth/sm), color absorbido en currentColor
/* previous · next — flechas (idénticas, separadas como input iconLeft/Right) */
{previous,next}-fg-primary/secondary/disabled/hover → fg/icon/{primary,secondary,disabled,onColor}
{previous,next}-bg-hover-primary/secondary          → bg/primary · bg/secondary
/* dots — usa tokens de label, no de icono */
dots-fg-primary/secondary/disabled → fg/label/{default,secondary,disabled}
dots-fg-hover                       → fg/icon/onColor  ({icon.fg.onColor})
```

**Deuda de contraste (SelectedPage).** ~~Figma exporta `root/text/fg/selectedPage` = `fg/label/default`~~ **(1) resuelto 11/08/2026** — era el mismo bug `inverse`/`onColor` de arriba: el token de Figma invertía con el modo sentado sobre `bg/surface/primary`, que no invierte. Corregido en Figma y en código a `fg/label/onColor` (blanco fijo, correcto en los dos modos). ⚠️ **(2) sigue pendiente:** blanco sobre teal `#4BA9C0` = 2.7:1, no cumple WCAG AA — decisión consciente de Carol de dejarlo así por ahora; revisar (¿oscurecer el fill del círculo, o volver a texto oscuro?).

---

## Cell family + Table (11/08/2026) — familia completa

Los 4 átomos/organismos de la familia Celda (`table/all/cellCommon/*`) están construidos y ensamblados en `Table`:

- **CellHeader** (átomo) · **CellData** (átomo) · **CellMore** (átomo, disparador overflow) · **CellActions** (organismo, ≤2 acciones) — comparten los 10 tokens `cellCommon` (padding, gap, borde, superficie) y solo divergen en lo específico (padding vertical `basic` de cada uno).
- **Table** (organismo, `src/organisms/Table.jsx`) — decisión de arquitectura: **sin componente "Row" separado**. No existe uso standalone de una fila fuera de una tabla (a diferencia de CellActions, que sí vive sola dentro de una CellData), así que exponerla como organismo aparte solo añade superficie de API sin caso de uso real. `Table` exporta `Table` + `TableRow`, la fila es una pieza estructural del mismo archivo, no una entidad documentada aparte.
- **Sin chrome propio.** No existe un componente "Table" en Figma (verificado con `search_design_system` — solo existen `Column Header`/`Column Cell`/`Column More`, la familia Cell). `Table`/`TableRow` son wrappers de layout puro (`display:flex`, sin fondo/borde/radio propios) — si se necesita una tarjeta alrededor, la envuelve el consumidor.
- **Semántica ARIA, no `<table>` nativo.** CellHeader/CellData ya eran `<div>` con flexbox (no `<th>`/`<td>`) — mantenerlo así evita reescribir 3 átomos ya shippeados, y es el patrón estándar en tablas de datos complejas (AG Grid, MUI DataGrid, TanStack Table tampoco usan `<table>` nativo, por virtualización/columnas sticky/cell renderers custom). Roles añadidos: `role="table"` (Table) · `role="row"` (TableRow) · `role="columnheader"` (CellHeader) · `role="cell"` (CellData/CellMore/CellActions).
- **Composición pura, sin clonar props.** Igual que CellActions/ButtonBar — `Table`/`TableRow` no inspeccionan ni clonan sus `children`; `surface="zebra"`/`lastRow` se siguen fijando a mano por celda, Table no adivina el índice de fila.

### Bug de swap: `bg/primary` ↔ `bg/primary-bold` en dark (11/08/2026)

Al auditar la familia bg de marca/feedback en dark mode se encontró que `--ds-bg-primary` (el token más usado de toda la familia — Button accent, Checkbox/Chip seleccionado, CTALink accent, BadgeNotification primary, 5× Pagination) y `--ds-bg-primary-bold` (0 consumidores) tenían sus valores dark **intercambiados entre sí** en `tokens.css` — ninguno coincidía con el valor real de Figma. Corregido: `bg-primary` dark `#286371`→`#4BA9C0` (el teal vivo real, no un teal casi negro); `bg-primary-bold` dark `#4BA9C0`→`#F7FBFC`. De paso se sincronizó el resto de la familia (antes sin override dark, caían al valor light): `bg-primary-medium`, `bg-secondary`, `bg-secondary-medium`, `bg-tertiary`, `bg-error`/`bg-error-subtle`, `bg-success`/`bg-success-subtle`, `bg-hover-primary`, `bg-inverse`, `bg-accent-primary/secondary`, `bg-warning`, `bg-info`, `bg-highlight` — todos con el valor real resuelto en vivo desde Figma.

**Tokens huérfanos eliminados** (sin fuente en Figma bajo ningún nombre + 0 consumidores en código): `bg-quaternary` (las 4 variantes), `bg-hover-secondary`/`bg-hover-tertiary`, `bg-completed` (duplicado de `bg-success`), `bg-done` (sí era variable propia en Figma con consumidores reales — `switch/all/track/bg/on`, `stepNavigator/web/steps/bg/completed`, ambos en backlog sin construir — pero se decidió simplificar: esos dos se repuntaron a `bg/success` y `bg/done` se eliminó de Figma).

**Técnica de auditoría — diff estructural, no textual.** Los re-exports de Tokens Studio reordenan claves JSON (alfabético o por orden de creación en Figma), produciendo diffs de cientos de líneas que son 100% ruido cosmético. Para auditar un re-export con confianza: aplanar ambos JSON a `path → (hex, alias)` (recorriendo hasta el nodo con `$value`+`$type`) y comparar por path, no por posición de línea — así se separa lo que cambió de verdad de lo que solo cambió de sitio.

---

## Snackbar (12/08/2026) — construido, Sprint 1 Pri 2 cerrado

Nodo EXPLORE confirmado: `3109:11663`, variante `Length` = `Single Line` / `Multi-Line`. 8 tokens `snackbar/all/*` nuevos, todos alias directos — cero valores nuevos en Base/Mode.

| Token Figma | CSS | Alias Mode | Valor (light) |
|---|---|---|---|
| `snackbar/all/root/bg/generic` | `--ds-snackbar-root-bg-generic` | `bg/inverse` | `#050506` |
| `snackbar/all/text/fg/generic` | `--ds-snackbar-text-fg-generic` | `fg/body/inverse` | `#FFFFFF` |
| `snackbar/all/root/borderRadius/generic` | `--ds-snackbar-root-border-radius` | `borderRadius/md` | `8px` |
| `snackbar/all/root/paddingHor/generic` | `--ds-snackbar-root-padding-hor` | `spacing/lg` | `12px` |
| `snackbar/all/root/paddingVer/singleLine` | `--ds-snackbar-root-padding-ver-single` | `spacing/sm` | `6px` |
| `snackbar/all/root/paddingVer/multiLine` | `--ds-snackbar-root-padding-ver-multi` | `spacing/lg` | `12px` |
| `snackbar/all/root/gap/singleLine` | `--ds-snackbar-root-gap-single` | `spacing/sm` | `6px` |
| `Snackbar/Shadow` (Effect Style) | `--ds-snackbar-root-shadow` | — (literal, no es Variable) | 3-layer drop-shadow |

**`fg/body/inverse`, no `fg/label/inverse` — verificado contra el panel de variables de Figma, no asumido.** La primera hipótesis fue reutilizar `fg-label-inverse` (el mismo token que Button default-filled/CTALink primario), razonando por analogía con el par `bg-inverse`/`fg-*-inverse` ya cerrado el 11/08. Al comprobar el alias real en el panel de Component tokens de Figma, el mensaje del Snackbar resuelve contra `fg/body/inverse` — correcto semánticamente: es texto de cuerpo, no el label de un botón. Ambos tokens (`fg-label-inverse`/`fg-body-inverse`) resuelven al mismo hex en `tokens.css` hoy (`#FFFFFF` light / `#050506` dark), así que no había regresión visual posible por el error — pero el alias sí importa si algún día divergen. Regla general reafirmada: **verificar el alias real, no inferirlo por el patrón de un componente anterior**, aunque el resultado visual coincida.

**Inversión de bg/fg con el modo, confirmada por captura, no por nombre de token.** Antes de cablear los tokens se pidió confirmación visual en Figma dark mode: canvas claro → Snackbar negro/texto blanco; canvas oscuro → Snackbar blanco/texto negro. Mismo patrón que Button default-filled/CTALink primario (`bg-inverse` sí invierte con el modo, a diferencia de `fg/*/onColor` que se mantiene fijo). Verificado también en el componente ya construido, en ambos modos, antes de dar la tarea por cerrada.

**La acción no lleva tokens propios.** Es una instancia directa de `Button` (`variant="default" size="sm"`) — los paddings de Figma (`paddingHor/small` 8px, `paddingVer/small` 6px) ya coincidían exactamente con el tamaño `sm` existente de Button, sin necesidad de crear ni ajustar nada.

**Shadow como token literal, no como alias de Mode.** `Snackbar/Shadow` es un Effect Style de Figma (no una Variable de color), así que no tiene cascada Component→Mode→Theme→Base que seguir — se escribe como valor `box-shadow` literal en la capa Component, igual que `borderRadius`/`spacing` cuando vienen de un FLOAT de Device en vez de una alias chain de color. Mismo tratamiento que debieron tener `--ds-shadow-md`/`--ds-shadow-lg` (referenciados por `Button.jsx` en `.ds-btn--floating` desde v2, pero nunca definidos en `tokens.css` — gap preexistente, detectado de pasada en esta sesión, sin relación con Snackbar).

---

## Description List + 4 dependencias (19–21/08/2026) — construido, Sprint 1 Pri 3 cerrado

Description List dependía de 4 piezas que no existían todavía: `Divider`, `List`, `SectionHeader`, y una v2 de `AmountView`. Auditoría completa en Figma (varias sesiones, EXPLORE→PLAN extendido) antes de escribir una línea de código — resumen de lo que salió de ahí.

### SectionHeader — consolidación de 4 copias en una

El texto de título de sección (teal, bold, 19px) estaba **duplicado 4 veces** — List View, Selector, Account Selector y Description List cada uno con su propio wrapper interno `.Header`/`.Heading`, mismo estilo copiado a mano. Consolidado en un único componente `Section Header`, sacado de donde vivía escondido (dentro de List View, sin página propia) a su propia página en Figma. Verificado con barrido programático de las 52 páginas del archivo: 0 instancias del wrapper viejo antes de borrarlo, y confirmado que los 4 sitios instancian ahora el mismo componente.

**No es la misma escala que `Headline`.** Coincidencia de que ambos puedan resolver a 19px en algún tamaño no significa que sean el mismo token — se verificó el `fontSize`/`lineHeight`/`fontWeight` real de cada uno antes de decidir, no se asumió por el valor en px:

| | SectionHeader | Headline |
|---|---|---|
| Device family | `fontSize/title/*` | `fontSize/headline/*` |
| lineHeight | `fontLheight/sm` (28.5, propio) | escala headline propia |
| weight | siempre Bold-capable (prop `weight`) | siempre Regular |

Tokens Component: `--ds-section-header-text-fg-default/primary/disabled` → Mode `fg/title/default/primary/disabled`. La nomenclatura de Figma para el color "normal" era **"Subtle"** (confuso — no es un gris apagado, resuelve al mismo `#050506`/`#FFFFFF` que cualquier texto de contraste completo) — renombrado a `default` en código, siguiendo la regla de nombrar por lo que resuelve, no por la etiqueta heredada.

**Mode nuevo `fg/title/*` — valores reales, no replicados de `fg/headline/*`.** Resueltos siguiendo la cadena de alias completa en vivo (Theme → Base), no asumidos por analogía:

| Mode token | light | dark |
|---|---|---|
| `fg/title/default` | `#050506` | `#FFFFFF` |
| `fg/title/primary` | `#4BA9C0` | `#4BA9C0` (igual en ambos modos) |
| `fg/title/disabled` | `#B9BEC4` | `#7B8490` |
| `fg/title/subtle`* | `#9AA1AA` | `#EEEFF1` |

*`fg/title/subtle` existe en Mode pero **SectionHeader no lo usa** — es un token distinto de `fg/title/default`, coincidencia de que ambos tengan "subtle"/"Subtle" en su nombre por caminos distintos (Figma nombró la Variant de color "Subtle", el Mode layer tiene un token real también llamado `subtle`). Confundirlos habría sido el mismo tipo de trampa que `inverse`/`onColor` — se verificó el hex real de cada uno antes de cablear.

### Divider — nombrar por semántica, no por la propiedad CSS que lo pinta

Implementación real en Figma: barra sólida de 1px de alto (`fill`/`background`, no `border-bottom`). Token: `--ds-divider-border-color-generic` → `var(--ds-borderColor-subtle)` (`#EEEFF1`).

El nombre lleva `-border-color-` aunque el átomo lo consume como `background-color` — decisión deliberada, no descuido. Ese mismo valor de color ya se usa como `border-color`/`border-bottom-color` en el resto del codebase (filas de la familia Cell, divisores de Description List section) — nombrar el token por la propiedad CSS de un único consumidor (`-bg-`) habría creado dos nombres para el mismo concepto semántico. El nombre describe **qué es** (un color de borde/divisor), no **qué propiedad lo pinta en este átomo concreto**.

### List — sin eje de tamaño, fiel a lo que expone Figma

`Unordered List` / `Ordered List` / `Checkmark List` (antes hardcodeados 3 veces a mano dentro de Description List, ahora consolidados como sus propios componentes en Figma) solo exponen un tamaño (`size="16"`, un único valor, no una variante real). **No se inventó una escala** aunque la tipografía Body ya tiene pasos disponibles (`2xs/xs/sm/md/lg` = 12/14/16/19/28px) — construir `size` en código sin que exista en Figma habría sido exactamente el tipo de anticipación que el freeze de alcance del proyecto prohíbe. Si algún día hace falta un List compacto o grande, se construye en Figma primero.

Tokens `--ds-list-*`: `bodytext-fg-generic` (`#050506`), `bullet-fg-generic` / `icon-checkmark-fg-generic` (`#4BA9C0`, ambos al mismo token `fg-icon-primary`), `gap-unordered` (8, reusado también por `ordered` — Figma no expone un gap propio para `ordered`), `gap-checkmark` (6), `padding-left-unordered` (2), `padding-bottom-generic` (6).

### AmountView v2 — la promesa `solid/soft/plain` de CLAUDE.md, cumplida de verdad

El `subtle` de la v1 (fondo con tinte de color — verde/rojo clarito, texto en el color del sentimiento) **no existía así en el `Amount View` real de Figma**. Se detectó auditando el Balance de Description List Account, que necesitaba instanciar el importe sin pastilla de color. Matriz real, verificada en Figma variable por variable (no inferida):

| `highlight` × `type` | bg | fg |
|---|---|---|
| `neutral` + positive | (ninguno) | `fg-generic` (negro) |
| `neutral` + negative | `bg-neutral` (`#EEEFF1`) | `fg-generic` |
| `emphasis` + positive | `bg-positive-solid` (`#389A3D`) | `fg-onColor` (blanco) |
| `emphasis` + negative | `bg-negative-solid` (`#D53737`) | `fg-onColor` |
| `subtle` + positive | `bg-positive-soft` (`#F8FCF8`) | `fg-generic` (**negro, no de color**) |
| `subtle` + negative | `bg-negative-soft` (`#FDF7F7`) | `fg-generic` |
| `disabled` + positive | (ninguno) | `fg-disabled` (`#B9BEC4`) |
| `disabled` + negative | `bg-disabled` (`#EEEFF1`) | `fg-disabled` |

**Asimetría intencional, no un hueco sin cablear.** A bajo/nulo énfasis (`neutral`, `disabled`), positivo se queda sin marca visual — es el estado esperado, no necesita señalarse. Negativo siempre lleva un fondo, aunque sea gris neutro — lleva peso semántico que merece marcarse incluso a bajo énfasis. El patrón se repite en dos filas distintas (`neutral` y `disabled`), confirmando que es una regla de diseño, no un olvido puntual. Se verificó explícitamente en Figma antes de fijar la decisión — un fill quedó enlazado-pero-oculto en `Neutral+Positive` mientras se decidía, y se retiró una vez confirmada la asimetría.

**Renombrado, no solo re-etiquetado:** `bg-positive-subtle`/`bg-negative-subtle` → `bg-positive-soft`/`bg-negative-soft` (Figma renombró el eje). **Eliminados por reconciliación** (ya no en el JSON re-exportado, eran el bug del tinte de color): `--ds-amount-view-fg-positive-subtle` / `-fg-negative-subtle`.

El primitivo `.Amount` (texto sin color de estado, usado dentro de la pastilla) expone sus propios 3 ejes fieles a Figma: `size` (`xs/sm/md/lg` = 12/14/16/19), `isoPlacement` (`left`/`right`), `amountWeight` (`bold`/`regular`).

### DescriptionList — contenedor tonto, nunca un enum de 8 variantes

Figma modela `Description List` como 8 "Variants" (Text/Not Filled/Badge/Link+Icon/Unordered List/Ordered List/Checkmark List/Account) × 2 Orientation — inevitable en una herramienta sin slots reales, donde cada tipo de contenido necesita hornearse dentro del componente. En código es exactamente lo contrario: un contenedor tonto (`DescriptionList` + `DescriptionListItem`) que aloja `children` libres, igual que `CellData`/`Table`. Badge/Link/List/AmountView/SectionHeader/Divider se importan e instancian donde hagan falta — nunca se reimplementan dentro del organismo.

Tokens `--ds-descriptionlist-*`: `label-fg-generic` (`#050506`), `valuetext-fg-generic` (`#050506`) / `-subtle` (`#9AA1AA`, estado "Not Filled"), `accountname-fg-generic` (`#050506`), `iban-fg-generic` (`#9AA1AA`), `helpertext-fg-generic` (`#9AA1AA`). El JSON también trae `descriptionList/all/{title,amount,iconAccount}/*` — **no se construyeron como tokens del organismo**: `title` lo aporta `SectionHeader` compuesto, `amount` lo aporta `AmountView` compuesto — construir tokens propios habría duplicado lo que esos átomos ya resuelven.

### Fuga de IP encontrada dentro de la propia librería "CS - Design System"

Dos casos, ninguno en la copia de Sistema Origen ya fichada — dentro del archivo activo, invisibles sin expandir cada variante:
- Icono `check` (Checkmark List): enlace de documentación con el dominio real de Sistema Origen en el campo de descripción del componente.
- Icono `Placeholder/Placeholder` (Description List, variante Account): el mismo ítem ya apuntado en la deuda técnica del 14/07, resuelto aquí para esta instancia concreta (ver `CLAUDE.md` §10 — el barrido completo de las 52 páginas buscando otras instancias sigue sin repetirse).

Ambos corregidos en Figma antes de tocar código.

---

## Dialog + 3 sub-piezas (24/08/2026) — construido, Sprint 1 Pri 4 cerrado, Sprint 1 completo

`Dialog`, `DialogSimple`, `ErrorAndEmptyState`, `Scrim` — nodos EXPLORE: Dialog `3284:6660` · DialogSimple `3284:6701` · `.Header` `3284:6720` · Scrim `3309:18518` · ErrorAndEmptyState `5036:8906`.

### Consolidación de namespace (previa a CODE)

Figma tenía 4 namespaces sueltos y desconectados entre sí: `dialog/*`, `dialogHeader/*`, `dialogSimple/*`, `emptyAndErrorState/*` — 34 variables con solapamiento real (header/root/scrim compartidos por las 4 piezas). Consolidado al patrón Common+específico ya usado en InputCommon/cellCommon: un único `dialog/all/*` de 27 tokens. `.Header` compartido (arrow + title + X, 5 variantes de color) queda como única fuente para Dialog Standard/Small, DialogSimple (siempre Default) y ErrorAndEmptyState (siempre Default, sin flecha ni título visible).

### 3 bugs de contraste/enlace reales — mismo patrón de pareja fg/bg ya documentado

El `.Header` tiene 5 variantes de color (`default`/`primary`/`onPrimary`/`secondary`/`tertiary`). Cada una empareja un `bg` con un `title/fg` y un `icon/fg` — los 3 deben invertir (o no) **juntos** con el modo, o el texto/icono se vuelve invisible. `default`/`secondary`/`tertiary` invierten (el bg se aclara en dark); `primary`/`onPrimary` son fijos ambos modos.

- **Tertiary** (detectado por captura de Carol en dark mode, antes de escribir código): `bg/surface/tertiary` se aclara en dark (`#B185C5`→`#CAABD7`, igual que Secondary), pero `title/fg/tertiary` e `icon/fg/tertiary` estaban en la familia `fg/*/default` (invierte HACIA blanco en dark) en vez de `fg/*/inverse` (invierte hacia negro) — texto/icono blanco sobre lila claro, casi invisible. Comparado contra Secondary (mismo patrón de bg, correctamente en `fg/*/inverse`) para confirmar el diagnóstico antes de tocar Figma. Repuntado a `fg/title/inverse` / `fg/icon/inverse`.
- **Default** (detectado por Carol en vivo, tras el primer fix, comparando contra el título hermano de la misma variante): `title/fg/inverse` (nombre confuso pero correcto) resolvía a `fg/title/default` — invierte bien, negro en light. Pero `icon/fg/inverse` (mismo nombre de variante, pieza distinta) resolvía a `fg/icon/inverse` — blanco fijo en light, sobre `bg/default` que también es blanco en light → icono invisible. El title de la misma variante SÍ estaba bien; solo el icon tenía el binding equivocado. Repuntado a `fg/icon/default`, igual patrón que su title hermano.

Ambos verificados por cadena de alias completa en Figma (no por nombre ni por hex coincidente) antes y después del fix, y confirmados visualmente en el banco de pruebas (light + dark, las 5 variantes de color).

`bg/surface/primary|secondary|tertiary` del header resuelven exactamente igual que los `--ds-bg-primary/-secondary/-tertiary` ya existentes en Mode (mismos valores en ambos modos) — reusados directamente, sin token de Componente nuevo para esa parte.

**Tercer bug — de enlace de capa, no de definición de token.** Los dos anteriores eran sobre qué resolvía cada token; este era sobre a qué token apuntaba cada CAPA real dentro de las instancias de Figma. Detectado por Carol comparando capturas: el icono de la variante Default no se veía sobre fondo blanco. Barrido completo de `strokes[].boundVariables` en Dialog/DialogSimple/ErrorAndEmptyState reveló que las capas de icono de Header=Primary y Header=Default estaban **cruzadas entre sí** (Primary enlazado al token pensado para Default y viceversa), y las de DialogSimple/ErrorAndEmptyState apuntaban al token de Tertiary por error — 12 instancias mal enlazadas en total, corregidas capa por capa vía Plugin API y verificadas con un barrido posterior (0 restantes).

**Renombrado final (Carol, mismo día):** `generic`→`primary` e `inverse`→`default` en `header/title/fg/*` y `header/icon/fg/*`, para que las 5 variantes de color queden nombradas exactamente igual que su header (`default`/`primary`/`onPrimary`/`secondary`/`tertiary`), sin la excepción que "generic" suponía. Verificado sin duplicados ni colisiones de nombre tras el renombrado (27 tokens, mismo total). Reflejado en `tokens.css` (`--ds-dialog-header-title-fg-*` / `--ds-dialog-header-icon-fg-*`).

**Limpieza adicional de Figma, encontrada al revisar los strokes del root:**
- `Dialog/DialogShadow` era una referencia a una librería externa (0 estilos de efecto locales en todo el archivo) — recreado como estilo local con los mismos valores (2 capas: `0 24px 24px rgba(0,0,0,.24)` + `0 0 24px rgba(0,0,0,.12)`) y reasignado a las 10 variantes PopUp de Dialog + DialogSimple Default, que resultó compartir el mismo shadow — no uno propio de radius 12 como se había documentado al principio (dato impreciso de una extracción de codegen).
- Los strokes de Dialog (3 capas en gradiente, 2 ocultas + 1 visible sin token) y de DialogSimple Default (2 gradientes visibles apilados, tampoco con token) eran restos de edición, no diseño intencional. Limpiados: Dialog se queda sin borde (coincide con la extracción original, que ya lo daba transparente), DialogSimple Default con un único stroke sólido enlazado a `borderColor/subtle`.

### Tokens

Los 27 `--ds-dialog-*` en `tokens.css`: bodyText/emptyState (2 fg) · header bg×5 colores · header title fg×5 · header icon fg×5 · header padding×2 (layout, literal px) · root bg · scrim bg · simple (icon fg, border color, borderRadius, content gap, padding×2, literales) · title fg compartido (DialogSimple/ErrorAndEmptyState). Sombra `Dialog/DialogShadow` (2 capas: `0 24px 24px rgba(0,0,0,.24)` + `0 0 24px rgba(0,0,0,.12)`) tratada como literal en CSS, mismo criterio que `--ds-snackbar-root-shadow` — aplica a `width="popUp"` de Dialog **y** a `variant="default"` de DialogSimple (mismo shadow, no uno propio). `--ds-dialog-simple-border-color-generic` nuevo, `var(--ds-borderColor-subtle)` — antes el borde no tenía token, era un gradiente sin enlazar. `--ds-bg-overlay` no tenía override dark hasta esta sesión (`bg/overlay` dark en Figma = negro→blanco 30%) — añadido.

### Hallazgo de código (no de Figma): tamaño de Button un escalón corto

Los botones grandes de Dialog piden `fontSize/label/lg` (19px), pero `Button.jsx` `size="lg"` da 16px (`fontSize/label/md`) — un escalón por debajo, preexistente a esta sesión. Ver `CLAUDE.md` §10 para la decisión pendiente. No se tocó Button.jsx sin decisión explícita, dado el radio de impacto (todos sus consumidores ya construidos).

---

## ListView + 3 átomos nuevos (24/08/2026) — construido, Sprint 2 primera pieza

`ListView`, `Text`, `DescriptionText`, `DetailText`. Nodo EXPLORE: List View `3209:62506`.

### Corrección de proceso a mitad de sesión

Durante EXPLORE de List View se detectó que `DetailText` (icono+texto duplicado 4 veces en el código de la familia Selector) no existía como componente compartido publicado en Figma. Antes de confirmarlo con Carol, se empezó a escribir el átomo en código basándose en los tokens ya inferidos de una exploración puntual anterior. Carol paró el trabajo: **Figma es la fuente de verdad — un átomo que se echa en falta durante EXPLORE se plantea antes de escribir código, no se infiere y se deja que Figma "alcance" después.** Ella construyó `DetailText` en Figma (página propia, `Show Icon` booleano, icono como instance swap) y lo instanció en las variantes reales de List View/Selector antes de retomar el código. Los nombres de token ya explorados coincidieron exactamente con lo que Carol construyó — confirma que la exploración en sí era correcta, pero el problema real era el orden del proceso, no el contenido. Corregido de cara a lo que queda de Sprint 2 en adelante.

### Los 3 átomos nuevos — mismo criterio que SectionHeader (página propia, token family real)

- **`Text`** (`text/all/label/fg/*`) — opción de texto enriquecido, intercambiable en el slot Description de List View/Selector vía instance swap de Figma. `color` default/secondary/disabled × `size` 14/16 × `weight` bold/regular. `Chevron` es una **propiedad de componente booleana** (no un eje de variante) que esconde/muestra una instancia de icono chevron-right — evita duplicar las 6 variantes en 12. Absorbió el eje `weight` de `.Text + Chevron` (0 instancias en las 52 páginas, confirmado antes de fusionar y borrar) sin arrastrar su color "Subtle" sin consumidor real.
- **`DescriptionText`** (`descriptionText/all/text/fg/*`) — texto plano subtle, valor por defecto del slot Description. `color` default/subtle/disabled × `size` 14/16/14 Narrow/16 Narrow (narrow con `fontFamily/narrow`, sin consumidor real hoy — no se expone como prop v1).
- **`DetailText`** (`detailText/all/{text,icon}/fg/*`) — icono + texto. `color` default/secondary/tertiary/disabled × `size` 14/16. Icono y texto tienen familias de token separadas (pueden divergir aunque hoy resuelven igual valor a valor).

Ambos `Text` y `Description` pasaron de nombre privado (`.Text`, `.Description`) a público (`Text`, `Description`→`DescriptionText`) para poder publicarse a la librería — necesario porque `Selector List Item` (a diferencia de `.SelectorInvoker`/`List View`, ambos privados) SÍ es un componente publicado, y una alerta real de Figma ("some preferred values have not been published") solo aparecía ahí: un componente público no puede ofrecer como opción de swap algo que nunca se publica. Diagnosticado comparando el estado de publicación de los 3 componentes contenedores (`importComponentSetByKeyAsync` por clave), no asumiendo.

### Refactor de la familia Selector ya construida

`SelectorInvoker`, `SelectorListItem`, `AccountSelectorInvoker`, `AccountSelectorListItem` — su markup de description/detail (duplicado con soporte de color inconsistente: `SelectorListItem` no exponía color de detail text en absoluto) sustituido por instancias de `DescriptionText`/`DetailText`. Regresión introducida y cazada en el mismo pase: el estado `disabled` de cada consumidor dejó de pintar el color correcto porque el CSS `:disabled` apuntaba a un `<span>` contenedor que ya no lleva el color — corregido pasando `color="disabled"` explícito desde cada consumidor, verificado con `getComputedStyle` en vivo (no solo leyendo el JSX) antes de dar el fix por cerrado.

### ListView

Fila interactiva real (`<button>`), no un listado pasivo — confirmado por los tokens de estado (`bg/hover`, `bg/pressed` como opacity, `borderColor/focus-inner`/`focus-outer` con radio propio) y el patrón ya establecido en `SelectorInvoker`. hover/pressed/focus se resuelven con pseudo-clases CSS nativas (`:hover`, `:active`, `:focus-visible`), no con una prop `state` — mismo criterio que Selector, donde esos 3 estados tampoco son parte del enum de `state` (que solo cubre error/disabled/readOnly/dataHidden, cosas que CSS no puede expresar solo).

`rightPanelContent` es un slot libre — el componente `Right Panel` de Figma expone 10 opciones (Amount View/Amount Two/Checkbox/Radio Button/Switch/Text Button/Icon/Badge with Icon/Loading Indicator/Highlight Badge) mediante una prop `component` de tipo swap-de-variante; portarlo tal cual habría replicado en código la necesidad de Figma de no tener slots reales — mismo criterio que `DescriptionList` no reimplementando los 8 "Variants" de Figma. Dos de esas 10 opciones (`Switch`, `Loading Spinner`) no están construidas todavía en código — no bloquea List View salvo que un consumidor necesite exactamente esas.

`Icon Left` expone 6 tamaños en Figma (`20/24/32/40/48/64`) que mapean 1:1 con la escala existente de `Icon.jsx` (`2xs/xs/sm/md/lg/3xl`, salta el `2xl`=56 que Figma no define) — reusada tal cual, sin inventar una escala nueva.

### 8 overrides dark que faltaban, encontrados resolviendo estos tokens

`fg/label/secondary`, `fg/label/disabled`, `fg/body/secondary`, `fg/body/tertiary`, `fg/body/subtle`, `fg/body/disabled`, `fg/icon/disabled`, `borderColor/subtle`, `borderColor/disabled` — ninguno tenía override real en dark (heredaban el valor de light). Además `--ds-fg-disabled` tenía el mismo valor en light y dark (`#B9BEC4`) pese a que Figma resuelve `#7B8490` en dark — corregido. Todos verificados por cadena de alias en vivo antes de escribir el valor.

---

## Device tokens (99 × Mobile/Tablet/Desktop) — responsive real desde 28/09/2026

**Cadena:** `Device` (modo Mobile · Tablet · Desktop) → `Theme` (`{rol}-mobile|-tablet|-desktop`, mismo patrón que `{rol}-light|-dark` para Mode) → `Base`. Las variables sufijadas de Theme son la arquitectura, no redundancia — igual que las de color, están **ocultas y sin scope** (solo Device aparece en los pickers de Figma; enlazar Theme directo era lo que causó 75 saltos de capa).

- **Orden mobile-first**: Mobile es la 1ª columna = modo por defecto (Figma no permite otro default que el primero). Desktop = valores históricos del sistema (back-office).
- **Cada modo tiene su propia variable en Theme**, aunque hoy valga lo mismo que otro modo — cambiar un valor por device nunca obliga a tocar la estructura.
- **Una sola librería, device = modo**: nada de librerías por dispositivo (el problema que tenía La Empresa con 3 librerías separadas).

**Antes (auditoría 28/09):** 80 de 81 tokens valían lo mismo en Mobile y Desk; `Generic` era copia literal de `Desk`; con Mobile por defecto, la variante Desktop de Page Title renderizaba el h1 a 32 en vez de 48.

### Tipografía — escala responsive (px, M / T / D)

| Rol | Mobile | Tablet | Desktop |
|---|---|---|---|
| headline 2xl (h1) | 32 | 40 | 48 |
| headline xl (h2) | 28 | 32 | 36 |
| headline lg (h3) | 24 | 28 | 32 |
| headline md (h4) | 22 | 24 | 28 |
| headline sm (h5) | 19 | 22 | 24 |
| headline xs (h6) | 16 | 19 | 19 |
| subheadline xl / lg / md | 28 / 24 / 22 | 32 / 28 / 24 | 36 / 32 / 28 |
| title xl / lg | 24 / 22 | 28 / 24 | 32 / 24 |
| body lg | 22 | 24 | 28 |
| body 2xs–md · label · annotation · subheadline xs/sm · title sm/md | constantes | | |

Primitivos nuevos en Base: `typography/fontSize/22`, `typography/fontSize/40`.

### Line-height emparejado por rol (`fontLheight/{familia}/{tamaño}`)

Un token de line-height **por cada** `fontSize/*` (27), no una escala genérica: si el tamaño cambia por device, su line-height cambia con él. Los 9 genéricos `fontLheight/3xs…3xl` se retiraron (y sus 27 variables Theme).

- **Texto de lectura** (body, label, annotation, title): 1.5 × tamaño.
- **Headline / subheadline**: 1.25 × tamaño (regla única de titulares, 29/09 — antes cada nivel tenía una proporción distinta, de 1.13 a 1.33, ajustada a mano).
- **Ambos redondeados al múltiplo de 4 más cercano (empate → abajo), sin decimales** (29/09). Rejilla de 4 para tipografía dentro de la de 8 del layout — mismo criterio que Material/Carbon/Atlassian: dos líneas siempre suman múltiplo de 8, y 4 evita el aire excesivo que daría 8 en textos pequeños. Elimina el 28.5 (subpíxel: renderiza a 28 o 29 según posición) y los 18/21/33/42 fuera de rejilla.

| Tamaño | Lectura | Titulares |
|---|---|---|
| 12 | 16 | — |
| 14 | 20 | — |
| 16 | 24 | 20 |
| 19 | 28 | 24 |
| 22 | 32 | 28 |
| 24 | 36 | 28 |
| 28 | 40 | 36 |
| 32 | 48 | 40 |
| 36 | — | 44 |
| 40 | — | 48 |
| 48 | — | 60 |

Primitivos de line-height en Base **nombrados por valor** (`typography/fontLheight/24`), igual que `typography/fontSize/*` — antes eran escalones (`50`=18 … `800`=72) sin relación con el valor. Escala final: 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 60 (todos múltiplos de 4).

Re-enlace en Figma: ~1.600 nodos de texto + 121 overrides de instancia. **Lección real:** `setBoundVariable('lineHeight')` a nivel de nodo NO sustituye un binding de rango ya existente (el nodo queda con 2 entradas y el segmento sigue usando la vieja) — usar `setRangeBoundVariable(start, end, …)` por segmento.

### Spacing (fijo) y Layout (responsive) — 01/10/2026

| Token | Mobile | Tablet | Desktop | Uso |
|---|---|---|---|---|
| `spacing/2xs · xs · sm · md · lg` | 2 · 4 · 6 · 8 · 12 | = | = | padding/gap de componentes |
| `spacing/xl · 2xl · 3xl` | 16 · 24 · 32 | = | = | padding/gap de componentes |
| `layout/margin` | 16 | 20 | 24 | margen de página: padding horizontal de Top/Bottom Navigation, padding del flydown |
| `layout/gutter` | 24 | 28 | 32 | separación entre bloques grandes: gap Logo↔Tabs, gap entre columnas del flydown |

**Regla: un componente mide lo mismo en los tres dispositivos; lo que se adapta es el layout** (márgenes, gutters, tipografía de titulares). Mismo criterio que Carbon, Atlassian, Polaris y Material: botones e inputs de 40–48 px son además el tamaño táctil mínimo, reducirlos en mobile quita área táctil justo donde más falta.

**Por qué se separó (01/10).** El 28/09 `spacing/xl/2xl/3xl` se hicieron responsive (12/16/16 · 16/20/24 · 24/28/32) pensando en layout, pero 18 Component tokens de controles apuntaban a `spacing/xl` (Button/Icon Button/Segmented Large, InputCommon, Telephone, Accordion, Dialog…). Con Mobile como modo por defecto, esos controles encogían en Figma (Icon Button Large 56 → 48, con los anillos de foco descolocados) mientras el código seguía en valores fijos. Convertirlos en excepciones a Base habría hecho de la excepción la regla — se separó la escala en dos familias. Los valores responsive aprobados el 28/09 no se pierden: pasan a `layout/*`. Cadena igual que el resto de Device: `layout/margin` → Theme `layout/margin-mobile|-tablet|-desktop` → Base `dimension/*`. Primitivo `dimension/350` (=28) sigue en uso por `layout/gutter` Tablet.

**Rejilla: se valida en el TAMAÑO EXTERIOR del componente, no en cada padding (29/09).** `2xs`=2 y `sm`=6 se mantienen a propósito como **pasos de compensación**: son los que hacen que el total caiga en rejilla — Button md 6+20+6 = 32, celda de Table 6+20+6 = 32, Tooltip 2+16+2 = 20, título de Accordion 6+28+6 = 40. Mismo criterio que Atlassian (`space.025`/`space.075` = 2/6) y Carbon (`spacing-01` = 2). Un 2 o un 6 que NO compensa nada (separación entre ítems, padding de un contenedor con contenido variable) es un error y se corrige a 4/8/12.

Auditoría del 29/09 — componentes cuyo tamaño exterior no caía en rejilla, y causa real (ninguna era el spacing de compensación):

| Componente | Antes | Causa | Ahora |
|---|---|---|---|
| Button *Full width* S/L | 33/45 | frame `Label` con alto fijo 21 (line-height viejo); 4 variantes Large con `Root` fijo a 45 + anillo de foco a mano | 32/44 |
| Segmented Control | 33/49 | frame `segment` 1px mayor que su contenido | 32/40/48 |
| CTA Link | 41/29 | frame `Link` 1px mayor que su contenido | 40/28 |
| Button anidado (Inline Notification, Collapsible, File Upload, List View) | 33/45 | override de alto viejo en la instancia | 32/44 |
| List | 30/34 | separación entre ítems 6 (`list/all/root/paddingBottom/*`) | 8 → 24/28/32/36 |
| Inline Notification | 122 | padding 6 + gap 6; `gapVer` enlazado a `counterAxisSpacing` (sin efecto) y el gap real sin token; padding derecho enlazado directo a `spacing/lg` | padding/gap 8 → 104 (1 línea) / 128 |
| Accordion | 41/131 | rectángulo `Border` de 1px sumando altura; frame `Title` fijo a 40 con contenido de 44; padding inferior de contenido 6 | `Border` absoluto, título 6+28+6, contenido 12/12 → 40/136 |

En código, además: Accordion pinta sus separadores sin sumar altura (`box-shadow` inset arriba, `::after` absoluto abajo); InlineNotification pinta el borde por dentro, agrupa título+mensaje sin gap (como `Label + Message` en Figma) y declara el line-height que le faltaba (heredaba 23.2 de `index.css`).

### Constantes en los 3 modos (con variable propia por modo)

`sizing/*` (8/16/20/24/32/40/48/56/64) · `borderWidth/*` · `borderRadius/*` · `fontFamily/*` · `fontWeight/*` · `fontStyle` · `fontDecor`. `opacity/*` no depende del device (sin sufijo).

### Breakpoints ≠ anchos de frame

| Token (Base) | Valor | Qué es |
|---|---|---|
| `breakpoint/tablet` | 768 | corte Mobile→Tablet (código: `@media (min-width: 768px)`) |
| `breakpoint/desktop` | 1024 | corte Tablet→Desktop — mayoría de sistemas: Tailwind/Atlassian `lg`=1024, Polaris 1040, Carbon 1056, Bootstrap 992 |
| `frame/mobile` · `frame/tablet` · `frame/desktop` | 375 · 768 · 1280 | ancho de frame de diseño en Figma (antes `dimension/mobile…`), no un breakpoint |

---

## Tokens de documentación `doc/*` (29/09/2026)

Grupo propio en Component tokens para los frames de documentación de Figma — **fijos, NO responsive** (la doc se lee siempre igual, no debe encogerse con el modo Device, que en Auto = Mobile) y **ocultos de publicación** (solo existen en este archivo).

| Token | Valor | Uso |
|---|---|---|
| `doc/all/fontSize|lineHeight/display-xl` | 128 / 160 | título de portada |
| `doc/all/fontSize|lineHeight/display-lg` | 64 / 80 | título de Intro |
| `doc/all/fontSize|lineHeight/title-lg` | 40 / 48 | subtítulo de portada |
| `doc/all/fontSize|lineHeight/title-md` | 28 / 36 | Title component (título de sección) |
| `doc/all/fontSize|lineHeight/title-sm` | 24 / 28 | etiquetas de portada (.Status, .Kind of file, Bottom row) |
| `doc/all/fg/text/default` | → Mode `fg/default` | color de esos títulos (dark mode) |

Tipografía → Base directo (misma regla de line-height de titulares: 1.25× en rejilla de 4). Primitivos nuevos en Base: `typography/fontSize/64`, `/128`, `typography/fontLheight/80`, `/160`. El texto corriente de la doc (cuerpo 14/16, etiquetas 12) usa los tokens Device constantes (`body/xs`, `body/sm`, `label/xs`), que no cambian por device.

---

## Estado de temas

| Tema | Estado |
|---|---|
| Overall (Retail) | ✅ Activo · Auditado · 0 KOs |
| Youth | ✅ Activo · Auditado · 0 KOs · 148 tokens cambiados |
| Wholesale Banking | 🗑️ Eliminado de la colección 15/07/2026 |
| Business Banking | 🗑️ Eliminado de la colección 15/07/2026 |
| Private Banking | 🗑️ Eliminado de la colección 15/07/2026 |
| Wireframe | 🗑️ Eliminado de la colección 15/07/2026 |
| Legacy | — Nunca llegó a exportarse como archivo (figuraba en tablas antiguas sin `.tokens.json` real) |

**Decisión abierta:** los 4 temas eliminados el 15/07/2026 pueden volver a añadirse más adelante, o no. No es una eliminación definitiva — se trató como reducción de alcance del sistema (solo Retail + Youth activos). Los `.tokens.json` correspondientes se borraron del repo en la misma sesión.

---

## Reglas de consumo en código React

```css
/* ✅ Correcto — JSX usa Component token */
color: var(--ds-button-fg-accent-outline);
background: var(--ds-amount-view-bg-positive-solid);

/* ✅ Correcto — tokens.css usa Mode token */
--ds-button-fg-accent-outline: var(--ds-fg-primary);
--ds-amount-view-bg-positive-solid: var(--ds-bg-success);

/* ❌ Incorrecto — JSX salta la cascada usando Mode directamente */
color: var(--ds-fg-primary);

/* ❌ Incorrecto — salta todas las capas */
color: #286371;
```

---

## Drawer + Sidebar Menu (15–17/09/2026)

**Drawer** — 16 tokens de icono por posición (`iconLeftTop`/`iconTopLeft`/etc.) resultaron ser 12 orphans sin `boundVariables` en ningún nodo real, más un namespace `web` vacío. Colapsados a 4 tokens reales (`drawer/all/root/bg-primary/-secondary`, `border/color`/`width`) + 1 nuevo (`icon/fg/generic`, no existía pese a que 12 iconos lo necesitaban). Radio de esquina (8px) se quedó literal — confirmado por dato que solo pinta en el borde opuesto al anclaje, no es una Variable en Figma.

**Sidebar Menu** — primer organismo con tokens de ESPACIADO propios, no de color: `sidebarMenu/all/title/padding/horizontal-top-bottom` (16/16/8) y `sidebarMenu/all/indent/step` (16px). Sin tokens de color propios a propósito — Drawer/Headline/ListView ya aportan los suyos, añadir uno propio habría sido duplicar sin necesidad.

**Lección real de la API de Figma:** `setBoundVariable('x', variable)` falla (`Unknown field: 'x'`) — Figma no permite enlazar la posición de un nodo a una variable, solo propiedades como padding/gap/tamaño/radio. El indent por nivel del árbol (Parent/Child/Gran son) no se pudo aplicar como token sobre coordenadas sueltas — la solución real fue anidar frames por nivel con `paddingLeft` enlazado al mismo token (`Gran son` = 2 niveles de nesting = 2×step). Aplica a cualquier futuro componente que necesite "indentación por profundidad" como token real, no solo a Sidebar Menu.

---

## Slider family (09/09/2026) — primer componente con arrastre real

4 bugs reales en Figma antes de CODE, todos encontrados por dato: (1) 4 variantes del tooltip de valor tenían el texto literal `"%"` sin el `"0"` — el frame del knob hace HUG sobre burbuja+círculo, así que el texto vacío estrechaba el frame y descuadraba la posición absoluta del knob 10px fuera del track; (2) 16 variantes de Continuous (`Primary`×Hover/Focus) tenían el relleno enlazado directo a `color/primary` (capa Base), saltándose Component y Mode — reenlazado a `slider/all/indicator/fg/primary`; (3) un renombrado en bloque inicial (`Slider (adjustable)`→`.Track`, `Base`→`.Indicator`) hecho por analogía sin comprobar el bind real salió AL REVÉS en Continuous — la capa exterior es la que pinta el color completo, la interior es una máscara gris con `paddingLeft` variable; en Range el mecanismo es el opuesto. Corregido capa por capa verificando el bind real, no por analogía; (4) `.Segment` (Point+Tail del slider de pasos) se había borrado por error en una sesión anterior — restaurado desde el historial de Figma, sin eje `Variant` (solo pintaba rosa, saltándose Component igual que el bug 2) — añadido el eje `Primary`/`Secondary` real, reenlazado a los mismos tokens `indicator`/`track` del resto de la familia, sin tokens nuevos.

**Continuous y Segmented se quedan como componentes separados a propósito**, en Figma y en código — un intento real de fusionarlos (`With Steps` en Continuous) rompió el posicionamiento del knob dos veces y fue lo que expuso el bug 3 de arriba. El mecanismo interno es realmente distinto (relleno+máscara vs. cadena de instancias `.Segment`), no una variación visual — comparten tokens (`--ds-slider-*`), no componente.

`_sliderKnob.jsx` (helper interno no exportado, compartido por `Slider`/`RangeSlider`/`SteppedSlider`) instancia `Tooltip` para la burbuja de valor — que ganó `forceVisible` y `style` para cubrir el caso de arrastre con ratón, que el mecanismo `:hover`/`:focus-within` original de `Tooltip` no cubre.

---

## Combobox (10/09/2026) — saltado de orden a petición de Carol

Tokens simplificados antes de CODE, mismo criterio que Accordion/Slider: `inputIconLeft`+`iconDropdown` (mismo valor teal, mismo concepto de icono genérico) fusionados en `combobox/all/icon/fg/generic`; `valueText` renombrado a `combobox/all/text/fg/generic`. `caret` se queda con SU PROPIO token a propósito — no es un icono, es el vector del cursor de texto parpadeante (un trazo de 30×0, confirmado inspeccionando la capa), coincide en valor hoy por casualidad pero es un elemento distinto.

**Bug real en `List View`, encontrado de paso:** sus dos hijos directos (`.Left Panel`/`Center + Right Content`) estaban en `layoutPositioning: ABSOLUTE` dentro de un padre que SÍ es auto-layout — el auto-layout existía pero estaba completamente inerte. Corregido en las 20 variantes pasando ambos a `AUTO`.

**Vaivén real de arquitectura del Picker.** Primer hallazgo: "Selection Cells" fingía su estado `Selected` con un borde manual de 4 lados (`borderColor/primary`, capa Mode, saltándose Component) en vez de usar la property `Selected` real de `ListView` — corregido, pero Carol prefirió pivotar el Picker a `SelectorListItem` (Sprint 1) en vez de `ListView`: el borde completo es su mecanismo legítimo de selección, más evidente en un desplegable que el ribbon fino de `ListView`.

---

## Country Flag + Country Picker (11/09/2026) — cierra deuda técnica

Confirmado que `Selector List Item` (component set `3347:7310`) ya soportaba `Right Panel=false` — el gap real era de código, no de Figma: `SelectorListItem.jsx` no exponía `icon` (slot) ni `showControl` (booleano) para sustituir el `file-text` fijo por una bandera y ocultar el Radio/Checkbox. Añadidos ambos.

**Bandera real vía export masivo, no vía Icon.jsx.** El component set `CountryFlag` de Figma (node `30831:2867`) ya tenía las 201 banderas reales con vector propio — el bloqueo real era que `Icon.jsx` es un wrapper exclusivo de lucide-react (un color vía `currentColor`), incompatible con arte multicolor. Exportadas las 201 vía `node.exportAsync({format:'SVG_STRING'})` a `flags.js` (slug→SVG crudo). **Lección operativa:** pedir SVGs en lotes de ~23 trunca silenciosamente la respuesta a los ~20KB sin avisar — lotes de 5 o menos; banderas muy complejas (`sri-lanka`, `saudi-arabia`) hay que pedirlas solas, y `saudi-arabia` superaba el límite incluso sola (resuelta con `download_assets`). Un intento de reconstruir `sri-lanka` de memoria produjo contenido incorrecto — nunca reconstruir de memoria un dato ya obtenido.

`CountryFlag.jsx` inyecta el SVG vía data URI en `<img>` (nunca `dangerouslySetInnerHTML`); el radio de esquina vive en el wrapper, no depende del propio SVG. `CountryPicker.jsx` compone `SelectorListItem` (`icon`=`CountryFlag`, `showControl={false}`) + mismo chrome de panel que Combobox (`combobox/all/root/bg/generic`, sin token nuevo).

---

## Popover Sheet (14–15/09/2026) — v1.1, reescrito tras el primer review

**Dos limpiezas de Figma antes de CODE:** 6 tokens de padding fragmentados y sin `boundVariables` real (`paddingHor/top-generic`, etc., los 6 valen 8) consolidados en un único `popoverSheet/all/root/padding/generic` — un séptimo huérfano (`paddingHor/bottom-generic`) apareció solo en un segundo barrido; y un namespace `web` sin sentido (el componente no tiene ningún eje Device real), renombrado a `all`.

**Fuga de IP real, más seria que las de padding — sombra enlazada EN VIVO a la librería real de La Empresa** (no una referencia rota, como `Dialog/DialogShadow` — `getStyleByIdAsync` la resolvía con normalidad porque seguía conectada de verdad a un archivo externo). Creado un estilo local nuevo, `Popover Sheet/Shadow`, reasignado a las 12 `Shadow Frame`, verificado por dato (`remote: false`).

**`root`/`pointer` bg pasaron de `bg/default` a `bg/container`** — mismo bug de superficie elevada ya cazado en la familia Cell (agosto), esta vez en el panel flotante de Combobox/Country Picker también — corregido en Figma y en `tokens.css` para los tres a la vez.

**v1.1 tras el primer `code-review` + verificación: 2 bugs reales.** (1) la flecha `pointer="center"` centraba contra el ancho de la propia tarjeta, no del trigger — corregido envolviendo el `trigger` real (`ResizeObserver`, nuevos `--ds-popover-anchor-width/-height`, la flecha consume `calc()` en vez de `%` de sí misma); desalineación real medida: ~82px en v1.0 → 0.08px en v1.1. (2) sin cierre por Escape/click-fuera — extraído `_popoverDismiss.js` (helper interno compartido con Combobox/CountryPicker, que antes duplicaban el mismo listener `mousedown` a mano; CountryPicker gana Escape).

**Deuda nueva, no resuelta aquí:** `Button.jsx`/`IconButton.jsx` no reenvían props desconocidas al DOM (sin rest-spread) — un intento de anotar `aria-expanded`/`aria-haspopup` en el `trigger` vía `cloneElement` confirmó por dato que no llega al `<button>` real. Mismo hueco ya existe en `Tooltip.jsx` desde Sprint 4 (`aria-describedby` nunca conectado de verdad). Anotada como deuda separada, no arreglada en esta sesión.

---

## Step Elements, Step Navigator, Step Indicator (17–21/09/2026)

**Dos rondas de reorganización real de tokens.** Primera ronda: los 34 tokens `steps/all/*` existentes se repartieron en `steps/common/*` (compartido de verdad entre Navigator e Indicator, confirmado componente a componente) y `steps/navigator/*` (exclusivo de la jerarquía de menú) — sin bucket "Indicator" porque no quedó ningún token exclusivo suyo tras el reparto (regla explícita de Carol: "si un grupo queda vacío, no se hace grupo"). De paso, 3 simplificaciones reales: `fg/text` y `fg/icon` resolvían al mismo color en los 3 estados → fusionados en un único `fg`; `borderWidth` estaba triplicado (círculo/conector/subStepConnector) → fusionado en 1; el label de `Substep Navigator` estaba enlazado a `node/fg/incomplete` (el color del NÚMERO, coincidía en negro por casualidad) → token propio `root/fg/label` creado. Segunda ronda, corrección de Carol: `root/bg` y los 3 tokens de foco SÍ son comunes (`Step Indicator Small` también los consume) — movidos de `navigator` a `common`, y la jerarquía anidada bajo un único padre `steps`.

**Bug de re-colocación al ocultar un conector, encontrado DOS VECES (vertical y horizontal) por el mismo patrón** — los booleanos `Show */* connector` estaban enlazados a `visible` en Figma, y un hijo invisible se saca del cálculo de auto-layout, recolocando el `Node`. Fix vertical: conectores a `layoutPositioning: ABSOLUTE` con posición fija (geometría inmune a la visibilidad, `StepVer` no necesita estirarse). Fix horizontal, más elaborado porque `StepHor` SÍ necesita estirarse: conectores `FILL` simétricos a cada lado de `Node`, con el hueco del texto resuelto envolviendo cada línea en un spacer siempre visible y siempre simétrico (el booleano solo apaga el pintado de la línea, nunca el spacer).

**`Step Indicator Large` — dos arquitecturas a propósito.** Figma tiene un componente con variantes fijas `Number of steps=2..7` (comodidad real para diseñadoras + límite real de ancho de pantalla); código sigue el patrón de composición sin límite ya usado en Table/CellActions/SegmentedControl (`array.map()` + dev-warn a partir de 7, nunca bloqueo).

Tokens nuevos en `tokens.css`: solo `--ds-steps-border-width` y los literales de padding/gap/iconSize (con precedente directo en Figma, `spacing/xl`) — el resto reusa Mode-layer existente (`--ds-bg-primary`, `--ds-fg-success`, `--ds-borderColor-emphasis`).

---

## Top Navigation, Card, Image (22–25/09/2026)

**`Card` (átomo nuevo)** — carcasa del panel Flydown de Top Navigation. Sombra propia (`--ds-card-root-shadow`, Effect Style real "Card/Shadow") — hasta el 23/09 aliasaba a Popover Sheet por coincidencia de valor, desacoplada para no depender de otro componente sin motivo real.

**Un grupo del flydown puede llevar `featured: {...}` en vez de `links`** (25/09) — instancia `Image` tal cual. `flydownToSidebarChildren` filtra esos grupos antes de aplanar el árbol de `SidebarMenu` móvil (contenido decorativo, no navegable) — sin el filtro, `group.links.map` crasheaba con `undefined`, bug real encontrado al verificar.

**`Image` (átomo nuevo)** — `size`(1:1/3:2/4:3/16:9)×`variant`(roundedCorners/circle) mismo eje que `.Container` en Figma antes de fusionarse en el component set real (24/09). `objectFit: cover` fijo, corregido en Figma el mismo día desde `scaleMode=FIT` (dejaba huecos de letterbox con fotos reales). `borderRadius` reusa literalmente `--ds-card-root-border-radius` (mismo token que Figma, `cards/all/root/borderRadius/basic`) — sin token propio nuevo. Fondo de fallback (`--ds-bg-subtle`) cuando no hay `src` es decisión de código, no réplica del placeholder gráfico de Figma.

---

## Page Title (22–28/09/2026) — nace el 3er tier responsive de Headline

**Bug de "variable fantasma" real, encontrado antes de CODE.** Los iconos de nav/acciones estaban enlazados a `topNavigation/android/iconLeft|iconRight/fg|size/generic` — variables que resuelven bien por ID y reportan `remote:false` (genuinamente locales) pero están ausentes del listado `variableIds` de su propia colección, invisibles a cualquier barrido por colección aunque sigan enlazadas a 274+623 nodos reales. Único fix fiable: escanear `boundVariables` de cada nodo directamente, nunca fiarse de un listado de colección. Creados `pageTitle/nav/icon/fg|size/generic`, re-enlazados los nodos afectados, borradas las 4 variables fantasma. De paso se eliminaron 5 component sets legacy Android/iOS/`.System nav` (0 consumidores externos confirmado).

**Desborde real medido, no intuido:** título (202px) + botones de acción (112px) pedían 314px dentro de un `Content` de 256-288px en el dispositivo más estrecho. Carol rechazó truncar ("no es accesible") y quitar elementos — la propiedad `Layout` se convirtió en `Device` real (Mobile/Tablet/Desktop), `Vertical` se eliminó (7 variantes, "carece de sentido" — solo movía la zona `nav`, no resolvía el desborde), y el componente se reconstruyó con nav+acciones en fila superior y el Headline a ancho completo debajo, root en alto automático (hug).

**Decisión de accesibilidad de Carol, con consecuencia directa en tokens:** el nivel semántico del Headline se queda fijo en `h1` en los 3 devices — solo cambia el tamaño visual. Implementado en Figma vinculando `fontSize`/`lineHeight` por instancia (Typography panel, sin tocar el binding de `Variant`) vía 6 tokens nuevos (`pageTitle/headline/fontSize|lineHeight/{mobile,tablet,desktop}`), aliasados a los valores que Mobile=h6(19)/Tablet=h4(28)/Desktop=h1(48) ya usaban.

**En código, la solución se simplificó de verdad respecto al plan inicial.** `Headline.jsx` ya tenía un mecanismo responsive de 2 tiers para `h1` desde una sesión anterior — extendido a 3 tiers reales (`<768px`→19px, `768-1023px`→28px, `≥1024px`→48px, corte a 768px nuevo en el repo, confirmado con Carol como estándar de industria/ancho de iPad portrait). Como el mecanismo ya vive dentro de `Headline.jsx`, los 6 tokens `pageTitle/headline/*` creados en Figma NO se portaron a `tokens.css` como variables propias — `PageTitle.jsx` simplemente instancia `<Headline level={1}>` y el tamaño se resuelve solo, beneficiando también a cualquier otro consumidor de `level={1}` del repo, no solo a Page Title. Tokens nuevos reales en `tokens.css`: `--ds-page-title-root-padding-*`/`-gap`/`-buttons-gap` y 3 tamaños de icono por device (`--ds-page-title-nav-icon-size-{mobile,tablet,desktop}` = 20/24/32px, aliasados a `sizing/xs|sm|md`).

---

## Deuda técnica de tokens

- ~~**Mode tokens dark mode** — varios tokens rotos o sin función clara en dark mode.~~ ✅ **Resuelto 11/08/2026** para la escala neutra `bg/*` (default/page/subtle/disabled/container), la familia de marca/feedback `bg/*` (primary/-bold/-medium, secondary, tertiary, error, success, hover-primary, inverse, accent, warning, info, highlight), y la trampa `*/inverse` vs `*/onColor` en `fg/label`, `fg/body` y `fg/icon` (ver secciones arriba). **Pendiente real:** `borderColor/*` dark no se ha auditado todavía contra Figma — mismo tipo de revisión, sesión aparte.
- **Notification Count description** — campo Description del componente apunta a dominio interno de Sistema Origen. Pendiente de borrar en Figma.
- **Placeholder/Placeholder** (node 2355:4239) — descripción del contenedor de iconos apunta a dominio interno. Pendiente de borrar en Figma.
