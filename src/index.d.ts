export function onlyDigits(value: unknown): string;

export function isValidCpf(value: string): boolean;
export function formatCpf(value: string): string;
export function generateCpf(options?: { formatted?: boolean }): string;

export function isValidCnpj(value: string): boolean;
export function isAlphanumericCnpj(value: string): boolean;
export function formatCnpj(value: string): string;
export function generateCnpj(options?: { alphanumeric?: boolean; formatted?: boolean }): string;
export function cnpjCheckDigits(base12: string): string;

export function isValidDocument(value: string): boolean;

export interface Phone { ddd: number; number: string; mobile: boolean; e164: string }
export const DDDS: ReadonlySet<number>;
export function parsePhone(value: string): Phone | null;
export function isValidPhone(value: string): boolean;
export function formatPhone(value: string): string;
export function whatsappLink(value: string, message?: string): string;

export interface Address {
  cep: string; street: string; complement: string; district: string;
  city: string; state: string; ibge: string;
}
export function isValidCep(value: string): boolean;
export function formatCep(value: string): string;
export function lookupCep(value: string, options?: { fetch?: typeof fetch; signal?: AbortSignal }): Promise<Address | null>;

export function formatBRL(amount: number): string;
export function formatCents(cents: number): string;
export function parseBRL(value: string | number): number;
export function splitInstallments(total: number, count: number): number[];
