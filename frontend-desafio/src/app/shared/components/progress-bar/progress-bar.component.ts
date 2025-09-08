import { Component, Input } from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  imports: [NgClass, NgStyle, NgIf],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
  @Input() public value: number = 0; // de 0 a 100
  @Input() public label?: string | number;
  @Input() public striped: boolean = false;
  @Input() public animated: boolean = false;
  @Input() public variant: 'primary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
  @Input() public height: string = '1rem';
}
