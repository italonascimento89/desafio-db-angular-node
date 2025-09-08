import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ValidationStateDirective } from '@app/shared/directives/validation-state.directive';
import { InputErrorComponent } from '../input-error/input-error.component';
import { By } from '@angular/platform-browser';
import { provideNgxMask } from 'ngx-mask';

describe('InputFieldComponent', () => {
  let fixture: ComponentFixture<InputFieldComponent>;
  let component: InputFieldComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InputFieldComponent,
        ReactiveFormsModule,
        ValidationStateDirective,
        InputErrorComponent,
        NgxMaskDirective,
      ],
      providers: [provideNgxMask()],
    });

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind all @Input() properties correctly', () => {
    component.class = 'custom-class';
    component.mask = '000-000';
    component.id = 'input-id';
    component.name = 'input-name';
    component.type = 'text';
    component.label = 'Nome';
    component.placeholder = 'Digite seu nome';
    component.skipValidation = true;
    component.control = new FormControl('valor');

    fixture.detectChanges();

    expect(component.class).toBe('custom-class');
    expect(component.mask).toBe('000-000');
    expect(component.id).toBe('input-id');
    expect(component.name).toBe('input-name');
    expect(component.type).toBe('text');
    expect(component.label).toBe('Nome');
    expect(component.placeholder).toBe('Digite seu nome');
    expect(component.skipValidation).toBeTrue();
    expect(component.control.value).toBe('valor');
  });

  it('should emit blurred event on blur', () => {
    spyOn(component.blurred, 'emit');

    const mockEvent = new FocusEvent('blur');
    component.onBlur(mockEvent);

    expect(component.blurred.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should reflect control value changes', () => {
    const control = new FormControl('');
    component.control = control;
    fixture.detectChanges();

    control.setValue('Novo valor');
    expect(component.control.value).toBe('Novo valor');
  });

  it('should render input element with correct attributes', () => {
    component.id = 'test-id';
    component.name = 'test-name';
    component.type = 'text';
    component.placeholder = 'Digite aqui';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl).toBeTruthy();
    expect(inputEl.attributes['id']).toBe('test-id');
    expect(inputEl.attributes['name']).toBe('test-name');
    expect(inputEl.attributes['type']).toBe('text');
    expect(inputEl.attributes['placeholder']).toBe('Digite aqui');
  });
});
