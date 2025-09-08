import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import { BadgeVariantType } from '@app/shared/types/badge.type';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() public variant: BadgeVariantType = 'primary';
  @Input() public text = '';

  get styles(): string[] {
    return ['badge', `bg-${this.variant}`];
  }
}
