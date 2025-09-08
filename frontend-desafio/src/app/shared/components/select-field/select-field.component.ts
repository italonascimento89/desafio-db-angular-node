import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ISelectOption } from '@app/shared/interfaces/select-options.interface';

import { ValidationStateDirective } from '@app/shared/directives/validation-state.directive';

import { InputErrorComponent } from '@shared/components/input-error/input-error.component';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationStateDirective, InputErrorComponent],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
})
export class SelectFieldComponent {
  @Input() public id!: string;
  @Input() public label!: string;
  @Input() public name!: string;
  @Input() public placeholder?: string;
  @Input() public options: ISelectOption[] = [];
  @Input() public control: FormControl = new FormControl('');
  @Input() public skipValidation: boolean = false;
  @Input() public labelBackgroundColor: string = '#ffffff'; // Cor padrão
}
