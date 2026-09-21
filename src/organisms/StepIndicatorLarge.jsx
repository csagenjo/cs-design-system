/**
 * StepIndicatorLarge — Organismo
 * CS Design System · v1
 *
 * Wizard horizontal completo — encadena N `StepHor` desde un array, sin
 * componente rígido de por medio (a diferencia de Figma, donde SÍ existe un
 * componente con variantes `Number of steps=2..7` para comodidad de las
 * diseñadoras — ver CLAUDE.md §9). En código no hace falta ese límite: es
 * composición pura, mismo criterio que Table/CellActions/SidebarMenu.
 *
 * El primer paso oculta su conector izquierdo, el último el derecho —
 * `StepHor` ya reserva el hueco sin recolocar `Node` (ver StepHor.jsx), así
 * que no hace falta ningún cálculo de ancho aquí, cada paso se limita a
 * decir si es el primero/último de la lista.
 *
 * Límite recomendado de 7 pasos por ancho de pantalla — igual que en Figma
 * (donde SÍ es un límite duro, por eso las variantes llegan hasta 7) — aquí
 * es solo un aviso en consola, no bloquea: un caso real con 8 pasos debe
 * poder renderizarse igual.
 *
 * USO:
 *   <StepIndicatorLarge
 *     steps={[
 *       { state: 'completed', label: 'Datos personales' },
 *       { state: 'active', number: '2', label: 'Dirección' },
 *       { state: 'incomplete', number: '3', label: 'Confirmación' },
 *     ]}
 *   />
 */
import React from 'react';
import { injectStyles } from '../components/_inputBase';
import { StepHor } from '../components/StepHor';

const css = `
.ds-step-indicator-large {
  display:     flex;
  align-items: flex-start;
  width:       100%;
}
.ds-step-indicator-large__step {
  flex: 1 1 auto;
  min-width: 0;
}
`;

injectStyles('ds-step-indicator-large', css);

export function StepIndicatorLarge({ steps = [], className, style }) {
  if (process.env.NODE_ENV !== 'production' && steps.length > 7) {
    console.warn('[DS StepIndicatorLarge] Más de 7 pasos puede no caber en pantallas estrechas — se recomiendan hasta 7, se recibieron ' + steps.length + '.');
  }

  return (
    <div className={`ds-step-indicator-large ${className || ''}`} style={style}>
      {steps.map((step, i) => (
        <div className="ds-step-indicator-large__step" key={step.id ?? i}>
          <StepHor
            state={step.state}
            number={step.number ?? String(i + 1)}
            label={step.label}
            showLeftConnector={i !== 0}
            showRightConnector={i !== steps.length - 1}
          />
        </div>
      ))}
    </div>
  );
}

export default StepIndicatorLarge;
