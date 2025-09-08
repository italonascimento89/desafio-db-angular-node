import { Component } from '@angular/core';

import { FeedbackComponent } from '@app/shared/components/feedback/feedback.component';

@Component({
  selector: 'app-not-found',
  imports: [FeedbackComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
