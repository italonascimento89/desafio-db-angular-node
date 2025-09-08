import { Component, Input } from '@angular/core';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-feedback',
  imports: [NgIf],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  @Input() public message: string = 'Nenhuma informação encontrada.';
  @Input() public title?: string;
  /** Ícone opcional (classe bootstrap icons, fontawesome etc.) */
  @Input() public icon?: string;
}
