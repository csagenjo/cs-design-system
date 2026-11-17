# Deuda técnica abierta

Solo lo que sigue pendiente (17/11/2026). Lo resuelto y el detalle de cada
punto, con su historia, están en `docs/changelog.md` → "Registro de deuda
técnica". Al cerrar un punto: se borra de aquí y se apunta en el changelog.

## Documentación

- **Inventario completo (12/11).** Todas las piezas tienen entrada en `component-inventory.md` y frame en Figma, más el índice `component-index.md`. Al tocar un componente, actualizar los tres.

## Componentes

- **Área de foco de Button / Icon Button en otros componentes.** Las instancias crecieron 8 px (08/10). Revisar cada padre (TopNavigation, PageTitle…; InlineNotification revisado 10/11; Collapsible revisado 12/11: el área la pone el Button anidado y no hay gap que restar: Figma ya cuenta el área en el Button Container); si un gap se diseñó con el botón pegado al borde, restar 4 en el token del padre, nunca quitar el área.
- **Drawer: icono + título en la misma fila del toggle.** Hoy el título de SidebarMenu va como primera línea del contenido.
- **Tamaño 19 heredado de Sistema Origen.** body/md pasó a 20 (17/11), pero `typography/fontSize/19` sigue en label/lg, headline/sm (móvil), headline/xs (desktop), subheadline/sm y title/md. Llevarlos a la escala de 4 (20) en la tanda 2 o 3 de la rejilla de 8.
- **SidebarMenu: límites conocidos.** Colapsado oculta el árbol entero (sin vista solo iconos con tooltip) y no tiene slot de pie (perfil, salir, versión).

## Tokens

- **249 Component tokens publicados en la librería.** Decidir si es intencionado o hay que ocultarlos (en junio solo se publicaban ~41).
- **Enlaces a variables borradas en páginas ⚠.** Bottom Sheet, Calendar, Videoplayer, Paragraph y Changelog conservan ~100 enlaces muertos (sin construir). Regla: antes de borrar una variable, re-enlazar sus usos.

- **Rejilla de 8 · tanda 2 (botones y navegación).** Fuera de rejilla tras la tanda 1: IconButton 52/76, CTA link 52, Tab Item y Tabs 52, Segmented Control 36/52, Snackbar 52, TopNavigation 52, Collapsible Icon Button 52, PageTitle 84.
- **Rejilla de 8 · tanda 3 (datos y paneles).** Table (celdas 36), List View (paneles 36/59), Selector (116/188/212), Description List (65–197), Steps (60/84), Dialog header (44/60), Picker (100–476), Country/Currency Picker (122–238), Tooltip (20/26), Slider knob (58), AmountView (.Amount 20–36), flydown de TopNavigation (203–299, 12 textos con line-height suelto), Checkmark List (28–44). En código: textarea Adaptive (77) y Combobox con chips (71) crecen fuera de rejilla.
- **Frames *How to use* de Card y Accordion:** mencionar el slot `Content` (ya está en el inventario).

- **No hay token de font-family en código (17/11).** Figma tiene `fontFamily/default` (Nunito) y `fontFamily/narrow`, pero `tokens.css` no expone ninguna `--ds-font-family-*`: los componentes heredan la fuente de la página y cada app la declara a mano (el portfolio pone `'Nunito Variable'` en `body`). Añadir `--ds-font-family-default` (y `narrow` si llega a tener uso) desde Device, como el resto de la tipografía, y aplicarlo en la raíz de cada componente o en `foundations.css`. Decidir también cómo se carga la fuente (el sistema no la empaqueta).
- **El rosa de la forma del Hero va en un tema Portfolio (17/11).** `hero/all/bg/backdrop/generic` apunta a `bg/surface/secondary-medium`: rosa en Retail (`#FED8E8`, dark `#631C39`), pero con `data-theme="youth"` pasa a teal (`#CBE7EE`), porque Youth intercambia primary↔secondary. El rosa es la marca del portfolio, no del sistema: crear un tema **Portfolio** en Theme (con su paleta secondary) y aplicarlo con `<html data-theme="portfolio">` en el portfolio, en lugar de depender de que Retail sea rosa. Mismo caso para la fuente (punto anterior) si el portfolio llega a usar otra.

## Figma e IP

- **Sección `Web - Sistema Origen (Copy)`.** 6 component sets antiguos que no son nuestros. Revisar y archivar.
- **Copia de la librería de Sistema Origen en la cuenta de Figma.** Revisar y archivar.
- **Barrido de `Placeholder/Placeholder` y `Notification Count`.** Descripciones con un enlace externo que hay que quitar; solo se limpió Description List.
- **Instancia suelta de `Image`** en la página 🟢 Image, fuera de cualquier frame. Confirmar si se borra.
- **Filete `borderColor/elevated` en el resto de superficies flotantes** (Dialog, Drawer primary): en dark su sombra negra no se ve. Ya lo llevan la Card Basic (11/11), Popover Sheet y el Picker de Combobox, Country y Currency (12/11).
