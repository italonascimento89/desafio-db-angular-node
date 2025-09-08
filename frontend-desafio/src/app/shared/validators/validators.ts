import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ValidationMessages, ValidatorKeys } from './validtors.type';

export class FormValidations {
  public static onlyText = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isValid = /^[a-zA-Zà-úÀ-Ú\s]*$/.test(value); // Apenas letras e espaços

      return isValid ? null : { invalidText: true };
    };
  };

  public static onlyNumbers = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isValid = /^[0-9]*$/.test(value); // Apenas números

      return isValid ? null : { invalidNumber: true };
    };
  };

  public static cpfValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return this._isValidCPF(value) ? null : { invalidCPF: true };
    };
  };

  private static _isValidCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/[^\d]+/g, '');

    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }

    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleaned.charAt(10))) return false;

    return true;
  }

  public static minSessionTime = (min: number = 1): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isValid = Number(value) >= min;
      return isValid ? null : { minSessionTime: { requiredMin: min } };
    };
  };

  public static getErrorMsg = (
    fieldName: string,
    validatorName: ValidatorKeys,
    validatorValue?: any,
    skipValidation: boolean = false,
  ): string | null => {
    // Se skipValidation for verdadeiro, não retorna a mensagem de erro
    if (skipValidation) {
      return null;
    }

    const config: ValidationMessages = {
      required: `O campo ${fieldName} é obrigatório.`,
      minlength: `${fieldName} precisa ter no mínimo ${
        validatorValue?.requiredLength || ''
      } caracteres.`,
      maxlength: `${fieldName} precisa ter no máximo ${
        validatorValue?.requiredLength || ''
      } caracteres.`,
      invalidText: 'O campo deve conter apenas letras',
      invalidNumber: 'O campo deve conter apenas números',
      invalidCPF: 'CPF inválido',
      minSessionTime: `${fieldName} deve ser de no mínimo ${
        validatorValue?.requiredMin || 1
      } minuto.`,
      pattern: 'Campo inválido',
    };

    return config[validatorName] || null;
  };
}
