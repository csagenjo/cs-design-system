# Deuda técnica abierta

Solo lo que sigue pendiente (30/10/2026). Lo resuelto y el detalle de cada
punto, con su historia, están en `docs/changelog.md` → "Registro de deuda
técnica". Al cerrar un punto: se borra de aquí y se apunta en el changelog.

## Documentación

- **"How to use & Accessibility" por componente.** Hechos: Accordion, Form Elements, Radio/Checkbox Group, Button, Icon Button, Button Bar, Checkbox, Radio, Chip, Link, LinkList, CTALink, Table + Celda, Description List, Snackbar, Selector, Account Selector, los 6 inputs, Dialog + familia, List View, Switch, File Upload, Tabs. Siguientes: Page Title, Combobox; después el resto, críticos primero. Regla: antes de documentar se cierran las diferencias con Figma ("Known gaps: None").

## Componentes

- **InputCombobox con el foco antiguo.** No usa la caja común de los inputs: borde blanco en foco, sin área de foco ni Hover de Figma.
- **Área de foco de Button / Icon Button en otros componentes.** Las instancias crecieron 8 px (08/10). Revisar cada padre (InlineNotification, Collapsible, TopNavigation, PageTitle…); si un gap se diseñó con el botón pegado al borde, restar 4 en el token del padre, nunca quitar el área.
- **Popover: geometría compartida.** El cierre (Escape, click fuera) ya es común (`_popoverDismiss.js`); la posición no: Combobox, Country/Currency Picker y PopoverSheet calculan la suya, sin "flip" en el borde del viewport. Construirlo cuando un caso real lo pida.
- **Drawer: icono + título en la misma fila del toggle.** Hoy el título de SidebarMenu va como primera línea del contenido.
- **SidebarMenu: límites conocidos.** Colapsado oculta el árbol entero (sin vista solo iconos con tooltip) y no tiene slot de pie (perfil, salir, versión).
- **PageTitle: tamaño de icono responsive.** `pageTitle/nav/icon/size/*` (20/24/32) no tiene token Device; si otro componente lo necesita, crear `sizing/icon/*` responsive.
- **Country Picker / Selector: verificar.** Dos notas antiguas sin comprobar tras A11y-1: focus-inner en teal en las filas, y tokens `iconLeft/fg` / `borderColor/focus-inner` de Selector pendientes de crear.

## Tokens

- **Youth sin implementar en código.** `tokens.css` solo tiene Retail; Youth existe en Figma (102 tokens de Theme distintos) y mantiene sus alias antiguos de la paleta por contraste.
- **249 Component tokens publicados en la librería.** Decidir si es intencionado o hay que ocultarlos (en junio solo se publicaban ~41).
- **`borderColor/*` en dark.** Corregidos `subtle` (21/10) y `disabled` (26/10); falta auditar el resto de la familia contra Figma.
- **Enlaces a variables borradas en páginas ⚠.** Bottom Sheet, Calendar, Videoplayer, Paragraph y Changelog conservan ~100 enlaces muertos (sin construir). Regla: antes de borrar una variable, re-enlazar sus usos.

## Figma e IP

- **Sección `Web - Sistema Origen (Copy)`.** 6 component sets antiguos de referencia, con el naranja de marca de La Empresa. Revisar y archivar.
- **Copia de la librería de Sistema Origen en la cuenta de Figma.** Revisar y archivar.
- **Barrido de `Placeholder/Placeholder` y `Notification Count`.** Descripciones con el dominio interno de Sistema Origen; solo se limpió Description List.
- **Instancia suelta de `Image`** en la página 🟢 Image, fuera de cualquier frame. Confirmar si se borra.
