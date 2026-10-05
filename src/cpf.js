import { onlyDigits, allSame } from './digits.js';

function checkDigit(base) {
  let sum = 0;
  for (let i = 0; i < base.length; i++) sum += Number(base[i]) * (base.length + 1 - i);
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

/** Valida um CPF com ou sem máscara. */
export function isValidCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || allSame(cpf)) return false;
  const d1 = checkDigit(cpf.slice(0, 9));
  const d2 = checkDigit(cpf.slice(0, 10));
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

/** Formata como 000.000.000-00 (retorna a entrada limpa se incompleta). */
export function formatCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return cpf;
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/** Gera um CPF válido aleatório (útil para testes e seeds). */
export function generateCpf({ formatted = false } = {}) {
  let base;
  do {
    base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  } while (allSame(base));
  const withD1 = base + checkDigit(base);
  const cpf = withD1 + checkDigit(withD1);
  return formatted ? formatCpf(cpf) : cpf;
}
