/**
 * Contexto interno de RadioGroup (A11y-4). Radio lo lee para tomar el
 * `name`, el valor elegido, el estado y la descripción del grupo; fuera de un
 * RadioGroup vale `null` y Radio funciona como siempre.
 */
import { createContext } from 'react';

export const RadioGroupContext = createContext(null);
