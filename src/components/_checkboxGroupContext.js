/**
 * Contexto interno de CheckboxGroup (A11y-4). Checkbox lo lee para tomar el
 * `name`, si está marcado (`values` incluye su `value`), el estado y la
 * descripción del grupo; fuera de un CheckboxGroup vale `null` y Checkbox
 * funciona como siempre.
 */
import { createContext } from 'react';

export const CheckboxGroupContext = createContext(null);
