# Deuda técnica abierta

Solo lo que sigue pendiente (30/10/2026). Lo resuelto y el detalle de cada
punto, con su historia, están en `docs/changelog.md` → "Registro de deuda
técnica". Al cerrar un punto: se borra de aquí y se apunta en el changelog.

## Documentación

- **Inventario completo (12/11).** Todas las piezas tienen entrada en `component-inventory.md` y frame en Figma, más el índice `component-index.md`. Al tocar un componente, actualizar los tres.

## Componentes

- **Área de foco de Button / Icon Button en otros componentes.** Las instancias crecieron 8 px (08/10). Revisar cada padre (TopNavigation, PageTitle…; InlineNotification revisado 10/11; Collapsible revisado 12/11: el área la pone el Button anidado y no hay gap que restar: Figma ya cuenta el área en el Button Container); si un gap se diseñó con el botón pegado al borde, restar 4 en el token del padre, nunca quitar el área.
- **Drawer: icono + título en la misma fila del toggle.** Hoy el título de SidebarMenu va como primera línea del contenido.
- **SidebarMenu: límites conocidos.** Colapsado oculta el árbol entero (sin vista solo iconos con tooltip) y no tiene slot de pie (perfil, salir, versión).

## Tokens


- **Auditar a fondo Theme.** Device y Mode auditados el 12/11 (ver `docs/token-architecture.md`); falta Theme con el mismo método, junto con Youth (abajo). Tras borrar las variables quaternary quedan en Theme alias sin usuario (p. ej. `borderColor/info-inverse-dark`).

- **Youth sin implementar en código.** `tokens.css` solo tiene Retail; Youth existe en Figma (102 tokens de Theme distintos) y mantiene sus alias antiguos de la paleta por contraste.
- **249 Component tokens publicados en la librería.** Decidir si es intencionado o hay que ocultarlos (en junio solo se publicaban ~41).
- **Enlaces a variables borradas en páginas ⚠.** Bottom Sheet, Calendar, Videoplayer, Paragraph y Changelog conservan ~100 enlaces muertos (sin construir). Regla: antes de borrar una variable, re-enlazar sus usos.

## Figma e IP

- **Sección `Web - Sistema Origen (Copy)`.** 6 component sets antiguos de referencia, con el naranja de marca de La Empresa. Revisar y archivar.
- **Copia de la librería de Sistema Origen en la cuenta de Figma.** Revisar y archivar.
- **Barrido de `Placeholder/Placeholder` y `Notification Count`.** Descripciones con el dominio interno de Sistema Origen; solo se limpió Description List.
- **Instancia suelta de `Image`** en la página 🟢 Image, fuera de cualquier frame. Confirmar si se borra.
- **Filete `borderColor/elevated` en el resto de superficies flotantes** (Dialog, Drawer primary): en dark su sombra negra no se ve. Ya lo llevan la Card Basic (11/11), Popover Sheet y el Picker de Combobox, Country y Currency (12/11).
