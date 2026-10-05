import { onlyDigits } from './digits.js';

export function isValidCep(value) {
  const cep = onlyDigits(value);
  return /^\d{8}$/.test(cep) && cep !== '00000000';
}

export function formatCep(value) {
  const cep = onlyDigits(value);
  return cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep;
}

/**
 * Consulta o endereço na ViaCEP. Aceita um fetch customizado para testes
 * ou ambientes sem fetch global. Retorna null quando o CEP não existe.
 */
export async function lookupCep(value, { fetch: fetchFn = globalThis.fetch, signal } = {}) {
  if (!isValidCep(value)) throw new TypeError(`CEP inválido: ${value}`);
  const res = await fetchFn(`https://viacep.com.br/ws/${onlyDigits(value)}/json/`, { signal });
  if (!res.ok) throw new Error(`ViaCEP respondeu ${res.status}`);
  const data = await res.json();
  if (data.erro) return null;
  return {
    cep: formatCep(data.cep),
    street: data.logradouro,
    complement: data.complemento,
    district: data.bairro,
    city: data.localidade,
    state: data.uf,
    ibge: data.ibge,
  };
}
