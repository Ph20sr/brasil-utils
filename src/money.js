const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 1234.5 -> "R$ 1.234,50" (com espaço comum, não o NBSP do Intl). */
export const formatBRL = (amount) => formatter.format(amount).replace(/\s/g, ' ');

/** Formata centavos inteiros (como as APIs de pagamento costumam devolver). */
export const formatCents = (cents) => formatBRL(cents / 100);

/** "R$ 1.234,56" -> 1234.56. Retorna NaN se não for um valor reconhecível. */
export function parseBRL(value) {
  if (typeof value === 'number') return value;
  const clean = String(value ?? '').replace(/R\$|\s/g, '');
  if (!/^-?(\d{1,3}(\.\d{3})*|\d+)(,\d+)?$/.test(clean)) return Number.NaN;
  return Number(clean.replace(/\./g, '').replace(',', '.'));
}

/** Divide um valor em parcelas, jogando a diferença de centavos na primeira. */
export function splitInstallments(total, count) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('count deve ser um inteiro >= 1');
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const parts = Array(count).fill(base);
  parts[0] += cents - base * count;
  return parts.map((c) => c / 100);
}
