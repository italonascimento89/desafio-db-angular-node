import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-text-filter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-text-filter.component.html',
  styleUrl: './input-text-filter.component.scss',
})
export class InputTextFilterComponent implements OnInit, OnDestroy {
  @Input() public id: string = '';
  @Input() public name: string = '';
  @Input() public type: 'text' | 'search' = 'text';
  @Input() public class: string = 'form-control';
  @Input() public placeholder: string = 'Digite para buscar...';
  @Input() public maxlength?: number;
  @Input() public minlength?: number;
  @Input() public autocomplete: 'on' | 'off' = 'off';
  @Input() public autofocus: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public debounce: number = 300;

  @Output() public filterChange = new EventEmitter<string>();
  @Output() public blurred = new EventEmitter<FocusEvent>();

  public searchControl: FormControl<string> = new FormControl<string>('', { nonNullable: true });
  private readonly _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this._setupFilterListener();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }

  private _setupFilterListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe(value => this.filterChange.emit(value.trim()));
  }
}
