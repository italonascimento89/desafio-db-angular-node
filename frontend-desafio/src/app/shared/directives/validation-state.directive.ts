import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidationState]',
  standalone: true,
})
export class ValidationStateDirective {
  @Input('appValidationState') control!: AbstractControl;

  @HostBinding('class.is-invalid')
  get isInvalid(): boolean | null {
    return (this.control.errors || this.control.invalid) && this.control.touched;
  }

  @HostBinding('class.is-valid')
  get isValid(): boolean {
    return this.control.valid && this.control.touched;
  }
}
