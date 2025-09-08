import { FormErrorMessagesPipe } from './form-error-messages.pipe';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../validators/validators';
import { ValidatorKeys } from '../validators/validtors.type';

describe('FormErrorMessagesPipe', () => {
  let pipe: FormErrorMessagesPipe;

  beforeEach(() => {
    pipe = new FormErrorMessagesPipe();
  });

  it('should return null if skipValidation is true', () => {
    const control = new FormControl('', { validators: [] });
    control.setErrors({ required: true });

    const result = pipe.transform(control, 'Nome', true);
    expect(result).toBeNull();
  });

  it('should return null if there are no errors', () => {
    const control = new FormControl('');
    control.setErrors(null);

    const result = pipe.transform(control, 'Nome');
    expect(result).toBeNull();
  });

  it('should return the correct error message for a single error', () => {
    const control = new FormControl('');
    control.setErrors({ required: true });

    spyOn(FormValidations, 'getErrorMsg').and.returnValue('Nome é obrigatório');

    const result = pipe.transform(control, 'Nome');
    expect(FormValidations.getErrorMsg).toHaveBeenCalledWith('Nome', 'required', true);
    expect(result).toBe('Nome é obrigatório');
  });

  it('should return the first error message when multiple errors exist', () => {
    const control = new FormControl('');
    control.setErrors({ minlength: { requiredLength: 5, actualLength: 2 }, required: true });

    spyOn(FormValidations, 'getErrorMsg').and.returnValue('Nome está muito curto');

    const result = pipe.transform(control, 'Nome');
    const firstErrorKey = Object.keys(control.errors!)[0];

    expect(FormValidations.getErrorMsg).toHaveBeenCalledWith(
      'Nome',
      firstErrorKey as ValidatorKeys,
      control.errors![firstErrorKey],
    );
    expect(result).toBe('Nome está muito curto');
  });
});
