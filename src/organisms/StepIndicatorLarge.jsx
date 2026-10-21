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
  margin:      0;
  padding:     0;
  list-style:  none;
}
.ds-step-indicator-large__step {
  flex: 1 1 auto;
  min-width: 0;
}
`;

injectStyles('ds-step-indicator-large', css);

export function StepIndicatorLarge({ steps = [], ariaLabel = 'Progress', stepLabel, statusLabels, className, style }) {
  if (process.env.NODE_ENV !== 'production' && steps.length > 7) {
    console.warn('[DS StepIndicatorLarge] Más de 7 pasos puede no caber en pantallas estrechas — se recomiendan hasta 7, se recibieron ' + steps.length + '.');
  }

  // A11y-3: lista ordenada (el lector anuncia "lista, 4 elementos") y el paso
  // en curso lleva aria-current="step". Cada Node lee "Step 2, in progress".
  return (
    <ol className={`ds-step-indicator-large ${className || ''}`} style={style} aria-label={ariaLabel}>
      {steps.map((step, i) => (
        <li className="ds-step-indicator-large__step" key={step.id ?? i} aria-current={step.state === 'active' ? 'step' : undefined}>
          <StepHor
            state={step.state}
            number={step.number ?? String(i + 1)}
            label={step.label}
            stepLabel={stepLabel}
            statusLabels={statusLabels}
            showLeftConnector={i !== 0}
            showRightConnector={i !== steps.length - 1}
          />
        </li>
      ))}
    </ol>
  );
}

export default StepIndicatorLarge;
