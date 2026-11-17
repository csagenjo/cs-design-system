/**
 * Footer — Organismo
 * CS Design System · v1 (17/11/2026, igual que Figma: set "Footer", Layout)
 *
 * Bloque de cierre de una página: enlaces de contacto y redes, una acción
 * opcional y una nota (firma o copyright), centrados, con una ola decorativa
 * abajo, de borde a borde. Responsive de verdad: Desktop y Stacked de Figma
 * son la misma pieza a dos anchos; aquí solo cambia el alto de la ola.
 *
 * links: cualquier contenido (Figma: slot Links). Por defecto, Links de
 *   texto. Un sitio puede poner sus logos de marca, cada uno con nombre
 *   accesible: Lucide no tiene iconos de marcas y el sistema no los trae.
 * action: { label, icon?, href? | onClick? } → Button Accent Primary Small
 *   (Figma: instancia Action expuesta, "Download CV"). Sin action, no hay botón.
 * note: texto corto → Text 14 Regular.
 * decoration: la ola, en footer/all/bg/decoration/generic. Decorativa
 *   (aria-hidden).
 *
 * Accesibilidad: <footer> (landmark contentinfo si es el pie de la página) y
 * los enlaces dentro de un <nav> con nombre (`linksLabel`, inglés por defecto).
 *
 * USO:
 *   <Footer
 *     links={<>
 *       <Link href="https://www.linkedin.com/in/…" rightIcon={false}>LinkedIn</Link>
 *       <Link href="mailto:…" rightIcon={false}>Email</Link>
 *     </>}
 *     action={{ label: 'Download CV', icon: 'download', href: '/cv.pdf' }}
 *     note="© 2026 Carol Sánchez"
 *   />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { Button } from '../components/Button';
import { Text } from '../components/Text';

/* Ola de Figma (1280 × 160); se estira al ancho y al alto del token. */
const WAVE_PATH = 'M 0 96 C 213 32 427 32 640 80 C 853 128 1067 128 1280 48 L 1280 160 L 0 160 Z';

const css = `
.ds-footer {
  display: flex;
  flex-direction: column;
}
.ds-footer__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--ds-footer-gap-generic);
  padding: var(--ds-footer-padding-top-generic) 0;
}
.ds-footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--ds-footer-gap-links-generic);
}
.ds-footer__decoration {
  display: block;
  width: 100%;
  height: var(--ds-footer-height-decoration-stacked);
  fill: var(--ds-footer-bg-decoration-generic);
}
@media (min-width: 1024px) {
  .ds-footer__decoration { height: var(--ds-footer-height-decoration-desktop); }
}
`;

injectStyles('ds-footer', css);

export function Footer({
  links,                       // nodos: Link, o enlaces con logo (cada uno con nombre accesible)
  linksLabel = 'Contact',      // nombre del <nav> de enlaces
  action,                      // { label, icon?, href?, onClick? }
  note,                        // firma o copyright
  decoration = true,           // la ola
  className,
  style,
}) {
  return (
    <footer className={`ds-footer ${className || ''}`} style={style}>
      <div className="ds-footer__content">
        {links && <nav className="ds-footer__links" aria-label={linksLabel}>{links}</nav>}
        {action && (
          <Button size="sm" iconLeft={action.icon} href={action.href} onClick={action.onClick}>{action.label}</Button>
        )}
        {note && <Text size="14" weight="regular">{note}</Text>}
      </div>
      {decoration && (
        <svg className="ds-footer__decoration" viewBox="0 0 1280 160" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={WAVE_PATH} />
        </svg>
      )}
    </footer>
  );
}

export default Footer;
