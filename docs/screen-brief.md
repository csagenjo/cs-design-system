# Brief de pantalla

Plantilla para pedir una pantalla de Figma en código. Rellena lo que el conector
de Figma no puede leer; lo que sí lee (tokens, estructura, textos visibles,
estados de los componentes) no hace falta repetirlo.

Copia el bloque "Plantilla", borra lo que no aplique y pégalo en el prompt.
Abajo hay un ejemplo relleno (alta de proveedor).

Cada apartado tapa un hueco medido en la pasada A (`docs/pipeline-figma-mcp.md`).
Cuando esté Code Connect (pasada B), el apartado 2 sobra.

## Plantilla

```markdown
## Pantalla
- Nombre:
- Nodos de Figma: (una línea por variante: filled, errors, empty, loading…)
- Layout (docs/layouts.md): Basic | Filter a report | Search for results | Step process | Dashboard grid | Dashboard main & related
- Device de las pantallas en Figma: Desktop | Tablet | Mobile
- Dónde va el código: App.jsx | src/screens/… | …

## 1. Contenido oculto
Lo que no se ve en el frame: otras pestañas, acordeones cerrados, pasos
siguientes, menús, diálogos, panel de filtros.
- (pieza): nodo XXXX:XXXX | "igual que la sección X de la pantalla Y" | lo describo aquí:

## 2. Componentes dudosos (solo hasta tener Code Connect)
Capas cuyo componente no es obvio por el nombre.
- (nombre de capa) → (componente del sistema y variante)

## 3. Títulos (solo si los Headline no tienen la propiedad Level puesta)
- h1: (el de PageTitle, o el del Hero)
- h2:
- h3:

## 4. Datos
- Opciones de cada desplegable / radio: campo → [opciones], cuál viene por defecto
- Campos de solo lectura o deshabilitados, y por qué:
- Mínimo y máximo de los numéricos y de los grupos repetibles (contactos, direcciones…):
- Datos de ejemplo: los del frame | otros:

## 5. Validación
| Campo | Obligatorio | Regla | Mensaje (inglés) |
|---|---|---|---|
|  |  |  |  |
- Cuándo valida: al enviar | al salir del campo | en vivo tras el primer envío
- Resumen de errores: dónde y con qué texto

## 6. Comportamiento
Qué pasa al pulsar cada acción.
- (acción): resultado | confirmación | adónde lleva
- Foco tras enviar con errores:
- Estado de éxito:
- Acciones sin hacer todavía (se quedan sin efecto):

## 7. Fuera de alcance
- 
```

## Ejemplo: alta de proveedor (pestañas)

```markdown
## Pantalla
- Nombre: Supplier form · Tabs
- Nodos: Filled 32936:9544 · With errors 32955:5660
- Layout: Basic (formulario en una Card con pestañas Contained)
- Device en Figma: Desktop
- Código: App.jsx

## 1. Contenido oculto
- Pestañas Contact, Tax and accounting, Bank details, Commercial terms: igual
  que sus tarjetas en "Supplier form · Cards · Filled" (32924:574)

## 2. Componentes dudosos
- "Phone", "Direct phone" → InputTelephone selectable, España por defecto
- "Withholding tax (%)", "Commercial discount (%)" → InputStepper
- "Operation type" → RadioGroup horizontal
- "Attachments" → FileUpload stacked

## 3. Títulos
- h1: New supplier
- h2: nombre de cada pestaña (Identification…)
- h3: Registered address, Contact person, Contact person 2

## 4. Datos
- Country: Spain, Portugal, France (Spain)
- Role: Sales, Accounts, Logistics
- Default VAT rate: 21 % Standard, 10 % Reduced, 4 % Super-reduced, 0 % Exempt (21 %)
- Payment term: On receipt, 30, 60, 90 days (60)
- Internal code: deshabilitado, lo asigna el sistema
- Contactos: mínimo 1, sin máximo; el primero no se puede quitar
- Withholding y discount: 0–100

## 5. Validación
| Campo | Obligatorio | Regla | Mensaje |
|---|---|---|---|
| Tax ID | sí | letra + 7 dígitos + letra o dígito, o 8 dígitos + letra | Enter a valid tax ID: 9 characters, for example B12345674. |
| Postcode | sí | 5 dígitos si el país es España | Enter a 5-digit postcode. |
| IBAN | sí | dígitos de control (mod 97) | Check the IBAN: the control digits don't match. |
| Emails | no | formato de email | Enter an email like name@company.com. |
- Cuándo: al pulsar Create supplier; después, en vivo
- Resumen: en la ButtonBar, "N fields need your attention: x in A and y in B."
  Icono de error en cada pestaña afectada

## 6. Comportamiento
- Create supplier: siempre activo; valida y, si todo está bien, "Supplier created."
- Foco: primera pestaña con errores, primer campo con error
- Add contact / Remove: añade o quita un bloque de contacto
- Delete, Cancel, Save draft, Add address, selector de país: sin efecto todavía

## 7. Fuera de alcance
- Guardar en servidor, Country Picker, subida real de ficheros
```
