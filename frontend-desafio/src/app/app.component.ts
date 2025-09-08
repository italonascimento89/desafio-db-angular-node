import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { debounceTime } from 'rxjs';

import { LoadingService } from '@core/services/loading-service.service';

import { HeaderComponent } from '@core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _loading = inject(LoadingService);
  public isLoading$ = this._loading.loading$.pipe(debounceTime(1));
}
