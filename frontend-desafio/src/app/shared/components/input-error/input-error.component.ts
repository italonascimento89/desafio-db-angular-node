import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormErrorMessagesPipe } from '@app/shared/pipes/form-error-messages.pipe';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule, FormErrorMessagesPipe],
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
})
export class InputErrorComponent {
  @Input() public field: FormControl = new FormControl();
  @Input() public label!: string;
  @Input() public skipValidation: boolean = false;
}
