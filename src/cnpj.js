import { onlyAlnum, allSame } from './digits.js';

// A partir de julho/2026 a Receita Federal emite CNPJs alfanuméricos:
// as 12 primeiras posições aceitam [0-9A-Z] e os 2 dígitos verificadores
// continuam numéricos. O valor de cada caractere é (código ASCII - 48),
// o que mantém 100% de compatibilidade com o CNPJ numérico.
const WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SHAPE = /^[0-9A-Z]{12}\d{2}$/;
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const charValue = (ch) => ch.charCodeAt(0) - 48;

function checkDigit(base, weights) {
  let sum = 0;
  for (let i = 0; i < base.length; i++) sum += charValue(base[i]) * weights[i];
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** Calcula os dois dígitos verificadores para uma base de 12 caracteres. */
export function cnpjCheckDigits(base12) {
  const base = onlyAlnum(base12);
  if (!/^[0-9A-Z]{12}$/.test(base)) throw new TypeError('A base do CNPJ deve ter 12 caracteres [0-9A-Z]');
  const d1 = checkDigit(base, WEIGHTS_1);
  const d2 = checkDigit(base + d1, WEIGHTS_2);
  return `${d1}${d2}`;
}

/** Valida CNPJ numérico ou alfanumérico, com ou sem máscara. */
export function isValidCnpj(value) {
  const cnpj = onlyAlnum(value);
  if (!SHAPE.test(cnpj) || allSame(cnpj)) return false;
  return cnpjCheckDigits(cnpj.slice(0, 12)) === cnpj.slice(12);
}

/** Indica se o CNPJ usa o novo formato alfanumérico. */
export const isAlphanumericCnpj = (value) => /[A-Z]/.test(onlyAlnum(value).slice(0, 12));

/** Formata como AA.AAA.AAA/AAAA-00. */
export function formatCnpj(value) {
  const cnpj = onlyAlnum(value);
  if (cnpj.length !== 14) return cnpj;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

/** Gera um CNPJ válido (matriz /0001). Use alphanumeric: true para o novo formato. */
export function generateCnpj({ alphanumeric = false, formatted = false } = {}) {
  const pool = alphanumeric ? ALPHABET : ALPHABET.slice(0, 10);
  const pick = () => pool[Math.floor(Math.random() * pool.length)];
  let root;
  do {
    root = Array.from({ length: 8 }, pick).join('');
  } while (allSame(root) || (alphanumeric && !/[A-Z]/.test(root)));
  const base = `${root}0001`;
  const cnpj = base + cnpjCheckDigits(base);
  return formatted ? formatCnpj(cnpj) : cnpj;
}
