import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormValidations } from '../validators/validators';
import { ValidatorKeys } from '../validators/validtors.type';

@Pipe({
  name: 'formErrorMessages',
  standalone: true,
  pure: false,
})
export class FormErrorMessagesPipe implements PipeTransform {
  public transform = (
    field: FormControl,
    label: string,
    skipValidation: boolean = false,
  ): string | null => {
    if (skipValidation) {
      return null;
    }

    for (const propertyName in field.errors) {
      if (field.errors.hasOwnProperty(propertyName)) {
        return FormValidations.getErrorMsg(
          label,
          propertyName as ValidatorKeys,
          field.errors[propertyName],
        );
      }
    }

    return null;
  };
}
