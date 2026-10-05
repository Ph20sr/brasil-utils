import { onlyDigits } from './digits.js';

/** DDDs válidos no Brasil (Anatel). */
export const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/**
 * Normaliza para DDD + número (10 ou 11 dígitos), aceitando +55, 0 de
 * discagem ou máscara. Retorna null se não for um telefone válido.
 */
export function parsePhone(value) {
  let digits = onlyDigits(value);
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2);
  else if ((digits.length === 11 || digits.length === 12) && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length !== 10 && digits.length !== 11) return null;

  const ddd = Number(digits.slice(0, 2));
  const number = digits.slice(2);
  if (!DDDS.has(ddd)) return null;

  const mobile = number.length === 9;
  if (mobile && number[0] !== '9') return null;
  if (!mobile && !/^[2-5]/.test(number)) return null;

  return { ddd, number, mobile, e164: `+55${digits}` };
}

export const isValidPhone = (value) => parsePhone(value) !== null;

/** Formata como (11) 98765-4321 ou (11) 3456-7890. */
export function formatPhone(value) {
  const phone = parsePhone(value);
  if (!phone) return onlyDigits(value);
  const split = phone.number.length - 4;
  return `(${phone.ddd}) ${phone.number.slice(0, split)}-${phone.number.slice(split)}`;
}

/** Monta um link wa.me com mensagem opcional. */
export function whatsappLink(value, message = '') {
  const phone = parsePhone(value);
  if (!phone) throw new TypeError(`Telefone inválido: ${value}`);
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone.e164.slice(1)}${text}`;
}
