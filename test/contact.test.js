import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parsePhone, isValidPhone, formatPhone, whatsappLink,
  isValidCep, formatCep, lookupCep,
  formatBRL, formatCents, parseBRL, splitInstallments,
} from '../src/index.js';

test('telefone: normaliza celular e fixo em vários formatos', () => {
  const expected = { ddd: 11, number: '987654321', mobile: true, e164: '+5511987654321' };
  assert.deepEqual(parsePhone('(11) 98765-4321'), expected);
  assert.deepEqual(parsePhone('+55 11 98765 4321'), expected);
  assert.deepEqual(parsePhone('011987654321'), expected);
  assert.equal(parsePhone('(21) 3456-7890').mobile, false);
});

test('telefone: rejeita DDD inexistente e números malformados', () => {
  assert.equal(isValidPhone('(20) 98765-4321'), false, 'DDD 20 não existe');
  assert.equal(isValidPhone('(11) 88765-4321'), false, 'celular deve começar com 9');
  assert.equal(isValidPhone('(11) 9876-543'), false);
  assert.equal(isValidPhone('(11) 1234-5678'), false, 'fixo não começa com 1');
});

test('telefone: formata e gera link do WhatsApp', () => {
  assert.equal(formatPhone('11987654321'), '(11) 98765-4321');
  assert.equal(formatPhone('1134567890'), '(11) 3456-7890');
  assert.equal(whatsappLink('(11) 98765-4321'), 'https://wa.me/5511987654321');
  assert.equal(
    whatsappLink('11987654321', 'Olá, quero um orçamento'),
    'https://wa.me/5511987654321?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento',
  );
  assert.throws(() => whatsappLink('123'), TypeError);
});

test('CEP: valida e formata', () => {
  assert.equal(isValidCep('01310-100'), true);
  assert.equal(isValidCep('00000-000'), false);
  assert.equal(isValidCep('1310-100'), false);
  assert.equal(formatCep('01310100'), '01310-100');
});

test('CEP: lookup mapeia a resposta da ViaCEP', async () => {
  const fakeFetch = async (url) => {
    assert.equal(url, 'https://viacep.com.br/ws/01310100/json/');
    return {
      ok: true,
      json: async () => ({
        cep: '01310-100', logradouro: 'Avenida Paulista', complemento: 'de 612 a 1510 - lado par',
        bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP', ibge: '3550308',
      }),
    };
  };
  const address = await lookupCep('01310-100', { fetch: fakeFetch });
  assert.equal(address.city, 'São Paulo');
  assert.equal(address.street, 'Avenida Paulista');

  const notFound = async () => ({ ok: true, json: async () => ({ erro: true }) });
  assert.equal(await lookupCep('99999-999', { fetch: notFound }), null);
  await assert.rejects(lookupCep('123', { fetch: notFound }), TypeError);
});

test('moeda: formata, interpreta e parcela', () => {
  assert.equal(formatBRL(1234.5), 'R$ 1.234,50');
  assert.equal(formatCents(9990), 'R$ 99,90');
  assert.equal(parseBRL('R$ 1.234,56'), 1234.56);
  assert.equal(parseBRL('99,9'), 99.9);
  assert.equal(parseBRL('-10'), -10);
  assert.ok(Number.isNaN(parseBRL('abc')));
  assert.ok(Number.isNaN(parseBRL('1.23,4')));
  assert.deepEqual(splitInstallments(100, 3), [33.34, 33.33, 33.33]);
  assert.equal(splitInstallments(100, 3).reduce((a, b) => a + b, 0).toFixed(2), '100.00');
  assert.throws(() => splitInstallments(100, 0), RangeError);
});
