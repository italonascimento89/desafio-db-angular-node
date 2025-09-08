import { isValidCPF } from '../../../src/validators/cpfValidator.js';

describe('isValidCPF', () => {

  it('should return true for a valid CPF', () => {
    const validCpf = '52998224725'; // CPF válido
    expect(isValidCPF(validCpf)).toBe(true);
  });

  it('should return true for a valid CPF with punctuation', () => {
    const validCpf = '529.982.247-25';
    expect(isValidCPF(validCpf)).toBe(true);
  });

  it('should return false for CPF with all digits the same', () => {
    const invalidCpf = '11111111111';
    expect(isValidCPF(invalidCpf)).toBe(false);
  });

  it('should return false for CPF with incorrect check digits', () => {
    const invalidCpf = '52998224724'; // último dígito incorreto
    expect(isValidCPF(invalidCpf)).toBe(false);
  });

  it('should return false for CPF with less than 11 digits', () => {
    const shortCpf = '1234567890';
    expect(isValidCPF(shortCpf)).toBe(false);
  });

  it('should return false for CPF with more than 11 digits', () => {
    const longCpf = '123456789012';
    expect(isValidCPF(longCpf)).toBe(false);
  });

  it('should return false for CPF with letters or symbols', () => {
    const invalidCpf = '52998a2472#';
    expect(isValidCPF(invalidCpf)).toBe(false);
  });

});
