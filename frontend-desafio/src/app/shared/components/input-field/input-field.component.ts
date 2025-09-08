import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskDirective } from 'ngx-mask';

import { ValidationStateDirective } from '@app/shared/directives/validation-state.directive';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationStateDirective, InputErrorComponent, NgxMaskDirective],

  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input() public class?: string;
  @Input() public mask?: string;
  @Input() public id!: string;
  @Input() public name!: string;
  @Input() public type!: 'password' | 'text' | 'number' | 'time';
  @Input() public label!: string;
  @Input() public placeholder: string = '';
  @Input() public skipValidation: boolean = false;
  @Input() public control: FormControl = new FormControl();

  @Output() public blurred: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  public onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }
}
