# brasil-utils

[![CI](https://github.com/Ph20sr/brasil-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/Ph20sr/brasil-utils/actions/workflows/ci.yml)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

Validação e formatação de dados brasileiros para formulários, CRMs e checkouts. **Zero dependências**, ESM, com tipos TypeScript.

- **CPF**: validação, máscara e gerador para seeds e testes
- **CNPJ**: numérico **e alfanumérico** (novo formato da Receita Federal, em vigor desde julho de 2026)
- **Telefone**: normaliza `+55`, `0` de discagem e máscaras; valida DDD (lista da Anatel) e o 9º dígito; gera link `wa.me`
- **CEP**: validação, máscara e consulta na ViaCEP com `fetch` injetável
- **Moeda**: `R$` para exibição, parse de valores digitados e divisão de parcelas sem perder centavos

## Instalação

```bash
npm install github:Ph20sr/brasil-utils
```

## Uso

```js
import {
  isValidCpf, isValidCnpj, formatCnpj,
  formatPhone, whatsappLink,
  lookupCep, formatBRL, splitInstallments,
} from 'brasil-utils';

isValidCpf('529.982.247-25');          // true
isValidCnpj('12.ABC.345/01DE-35');     // true  (alfanumérico)
formatCnpj('12abc34501de35');          // '12.ABC.345/01DE-35'

formatPhone('+55 11 98765 4321');      // '(11) 98765-4321'
whatsappLink('11987654321', 'Olá!');   // 'https://wa.me/5511987654321?text=Ol%C3%A1!'

await lookupCep('01310-100');          // { street: 'Avenida Paulista', city: 'São Paulo', ... }

formatBRL(1234.5);                     // 'R$ 1.234,50'
splitInstallments(100, 3);             // [33.34, 33.33, 33.33]
```

## CNPJ alfanumérico

Desde julho de 2026, os 12 primeiros caracteres do CNPJ podem ser letras ou números. Os dois dígitos verificadores continuam numéricos. O cálculo segue o módulo 11 de sempre, com cada caractere valendo `código ASCII − 48`. Assim, todo CNPJ numérico antigo continua válido com o mesmo código, sem tratamento especial.

```js
import { cnpjCheckDigits, generateCnpj, isAlphanumericCnpj } from 'brasil-utils';

cnpjCheckDigits('12ABC34501DE');             // '35'
generateCnpj({ alphanumeric: true });        // ex.: 'K3P9X2QA000187'
isAlphanumericCnpj('11.222.333/0001-81');    // false
```

Se o seu banco guarda CNPJ como `BIGINT` ou `CHAR(14)` só de dígitos, revise o schema: o campo precisa aceitar letras.

## API

| Função | Retorno |
| --- | --- |
| `isValidCpf(v)` / `formatCpf(v)` / `generateCpf({ formatted })` | `boolean` / `string` / `string` |
| `isValidCnpj(v)` / `formatCnpj(v)` / `generateCnpj({ alphanumeric, formatted })` | `boolean` / `string` / `string` |
| `isAlphanumericCnpj(v)` / `cnpjCheckDigits(base12)` | `boolean` / `string` |
| `isValidDocument(v)` | `boolean` (CPF ou CNPJ) |
| `parsePhone(v)` | `{ ddd, number, mobile, e164 } \| null` |
| `isValidPhone(v)` / `formatPhone(v)` / `whatsappLink(v, msg?)` | `boolean` / `string` / `string` |
| `isValidCep(v)` / `formatCep(v)` / `lookupCep(v, { fetch, signal })` | `boolean` / `string` / `Promise<Address \| null>` |
| `formatBRL(n)` / `formatCents(c)` / `parseBRL(s)` / `splitInstallments(total, n)` | `string` / `string` / `number` / `number[]` |

## Desenvolvimento

```bash
npm test
```

Os testes usam apenas o `node:test` nativo (Node 20+).

## Licença

MIT
