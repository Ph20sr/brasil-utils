import { isValidCpf } from './cpf.js';
import { isValidCnpj } from './cnpj.js';

export { onlyDigits } from './digits.js';
export { isValidCpf, formatCpf, generateCpf } from './cpf.js';
export { isValidCnpj, isAlphanumericCnpj, formatCnpj, generateCnpj, cnpjCheckDigits } from './cnpj.js';
export { DDDS, parsePhone, isValidPhone, formatPhone, whatsappLink } from './phone.js';
export { isValidCep, formatCep, lookupCep } from './cep.js';
export { formatBRL, formatCents, parseBRL, splitInstallments } from './money.js';

/** Valida um documento que pode ser CPF ou CNPJ. */
export function isValidDocument(value) {
  return isValidCpf(value) || isValidCnpj(value);
}
