import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';

import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    // Mock de rotas
    component.routes = [
      { path: '/home', label: 'Home' },
      { path: '/about', label: 'About' },
    ];

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar todos os links de rota', () => {
    const links = fixture.debugElement.queryAll(By.css('a.nav-link'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.textContent.trim()).toBe('Home');
    expect(links[1].nativeElement.textContent.trim()).toBe('About');
  });

  it('deve alternar o collapse ao clicar no botão toggler', () => {
    const toggler = fixture.debugElement.query(By.css('.navbar-toggler'));
    expect(component.collapsed).toBe(true);

    toggler.nativeElement.click();
    fixture.detectChanges();
    expect(component.collapsed).toBe(false);

    toggler.nativeElement.click();
    fixture.detectChanges();
    expect(component.collapsed).toBe(true);
  });

  it('deve mostrar botão de logout quando logado', () => {
    spyOnProperty(component, 'isLogado', 'get').and.returnValue(true);

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button).toBeTruthy();
  });

  it('deve chamar logout ao clicar no botão', () => {
    spyOnProperty(component, 'isLogado', 'get').and.returnValue(true);
    const logoutSpy = spyOn(component, 'logout');

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('clicked', null);

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('deve chamar logout ao clicar no botão', () => {
    spyOnProperty(component, 'isLogado', 'get').and.returnValue(true);

    fixture.detectChanges();

    const logoutSpy = spyOn(component, 'logout');

    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('clicked', null);

    expect(logoutSpy).toHaveBeenCalled();
  });
});
