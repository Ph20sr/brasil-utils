import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidCpf, formatCpf, generateCpf,
  isValidCnpj, isAlphanumericCnpj, formatCnpj, generateCnpj, cnpjCheckDigits,
  isValidDocument,
} from '../src/index.js';

test('CPF: aceita válidos com e sem máscara', () => {
  assert.equal(isValidCpf('529.982.247-25'), true);
  assert.equal(isValidCpf('52998224725'), true);
});

test('CPF: rejeita DV errado, tamanho errado e sequências repetidas', () => {
  assert.equal(isValidCpf('529.982.247-24'), false);
  assert.equal(isValidCpf('5299822472'), false);
  assert.equal(isValidCpf('111.111.111-11'), false);
  assert.equal(isValidCpf(''), false);
  assert.equal(isValidCpf(null), false);
});

test('CPF: formata e gera documentos válidos', () => {
  assert.equal(formatCpf('52998224725'), '529.982.247-25');
  for (let i = 0; i < 200; i++) assert.equal(isValidCpf(generateCpf()), true);
  assert.match(generateCpf({ formatted: true }), /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
});

test('CNPJ numérico', () => {
  assert.equal(isValidCnpj('11.222.333/0001-81'), true);
  assert.equal(isValidCnpj('11222333000181'), true);
  assert.equal(isValidCnpj('11.222.333/0001-82'), false);
  assert.equal(isValidCnpj('00000000000000'), false);
  assert.equal(isAlphanumericCnpj('11.222.333/0001-81'), false);
});

test('CNPJ alfanumérico (exemplo oficial da Receita Federal)', () => {
  assert.equal(cnpjCheckDigits('12ABC34501DE'), '35');
  assert.equal(isValidCnpj('12.ABC.345/01DE-35'), true);
  assert.equal(isValidCnpj('12.abc.345/01de-35'), true, 'aceita minúsculas');
  assert.equal(isValidCnpj('12.ABC.345/01DE-36'), false);
  assert.equal(isValidCnpj('12.ABC.345/01DE-3A'), false, 'DV deve ser numérico');
  assert.equal(isAlphanumericCnpj('12.ABC.345/01DE-35'), true);
});

test('CNPJ: formata e gera nos dois formatos', () => {
  assert.equal(formatCnpj('12abc34501de35'), '12.ABC.345/01DE-35');
  for (let i = 0; i < 200; i++) {
    assert.equal(isValidCnpj(generateCnpj()), true);
    const alnum = generateCnpj({ alphanumeric: true });
    assert.equal(isValidCnpj(alnum), true);
    assert.equal(isAlphanumericCnpj(alnum), true);
  }
});

test('isValidDocument aceita CPF ou CNPJ', () => {
  assert.equal(isValidDocument('529.982.247-25'), true);
  assert.equal(isValidDocument('12.ABC.345/01DE-35'), true);
  assert.equal(isValidDocument('123'), false);
});
