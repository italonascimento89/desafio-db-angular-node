import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonSize, ButtonType } from '@app/shared/types/button.type';

@Component({
  selector: 'app-button',
  imports: [NgClass, NgIf],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public variant: ButtonType = 'primary';
  @Input() public size: ButtonSize = 'default';
  @Input() public disabled = false;
  @Input() public block = false;
  @Input() public outline = false;
  @Input() public iconPosition: 'left' | 'right' = 'left';
  @Input() public icon?: string; // Ex: 'bi bi-check' ou 'fa fa-plus'
  @Output() public clicked = new EventEmitter<Event>();

  get buttonClasses(): string[] {
    const baseClass = this.outline ? `btn-outline-${this.variant}` : `btn-${this.variant}`;

    let styles = ['btn', baseClass];

    if (this.size === 'sm') {
      styles.push('btn-sm');
    } else if (this.size === 'lg') {
      styles.push('btn-lg');
    }

    if (this.block) {
      styles.push('w-100');
    }

    return styles;
  }

  public onClick(event: Event): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
