/** Remove tudo que não for dígito. */
export const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');

/** Remove pontuação e deixa apenas [0-9A-Z] em maiúsculas. */
export const onlyAlnum = (value) => String(value ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '');

export const allSame = (value) => /^(.)\1*$/.test(value);
