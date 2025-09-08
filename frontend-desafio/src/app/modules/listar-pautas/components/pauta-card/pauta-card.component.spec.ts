import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PautaCardComponent } from './pauta-card.component';
import { IPauta } from '@app/shared/interfaces/pautas.interface';
import { PautaAcaoType } from '@app/shared/types/pauta-acao.type';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({ selector: 'app-badge', template: '' })
class BadgeStubComponent {
  @Input() variant!: string;
  @Input() text!: string;
}

@Component({
  selector: 'app-button',
  template: '<button (click)="clicked.emit()"><ng-content></ng-content></button>',
})
class ButtonStubComponent {
  @Input() variant!: string;
  @Input() size!: string;
  @Output() clicked = new EventEmitter<void>();
}

describe('PautaCardComponent', () => {
  let component: PautaCardComponent;
  let fixture: ComponentFixture<PautaCardComponent>;

  const pautaMock: IPauta = {
    id: '1',
    nome: 'Pauta Teste',
    descricao: 'Descrição da pauta',
    status: 'ABERTA',
    tempo_restante: 45,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PautaCardComponent, BadgeStubComponent, ButtonStubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PautaCardComponent);
    component = fixture.componentInstance;
    component.pauta = pautaMock;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o nome da pauta', () => {
    const nameEl = fixture.debugElement.query(By.css('.card-title')).nativeElement;
    expect(nameEl.textContent).toContain(pautaMock.nome);
  });

  it('deve exibir a descrição da pauta', () => {
    const descEl = fixture.debugElement.query(By.css('.card-text')).nativeElement;
    expect(descEl.textContent).toContain(pautaMock.descricao);
  });

  it('deve passar status corretamente para app-badge', () => {
    const badgeDebugEl = fixture.debugElement.query(By.css('app-badge'));
    expect(badgeDebugEl).toBeTruthy();

    const badgeInstance = badgeDebugEl.componentInstance as BadgeStubComponent;
    expect(badgeInstance.text).toBe(pautaMock.status);
    expect(badgeInstance.variant).toBe('success');
  });

  it('deve exibir tempo restante', () => {
    const tempoEl = fixture.debugElement.query(By.css('small')).nativeElement;
    expect(tempoEl.textContent).toContain('45'); // assumindo pipe 'tempoRestante' retorna algo contendo 45
  });

  it('deve emitir ação "votar" ao clicar no botão Votar', () => {
    spyOn(component.acao, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const buttonVotar = buttons.find(btn => btn.nativeElement.textContent.includes('Votar'));
    expect(buttonVotar).toBeTruthy(); // garante que encontrou

    buttonVotar!.triggerEventHandler('click', null);

    expect(component.acao.emit).toHaveBeenCalledWith({
      pauta: pautaMock,
      tipo: 'votar' as PautaAcaoType,
    });
  });

  it('deve emitir ação "detalhes" ao clicar no botão Acessar detalhes', () => {
    spyOn(component.acao, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const buttonDetalhes = buttons.find(btn =>
      btn.nativeElement.textContent.includes('Acessar detalhes'),
    );
    expect(buttonDetalhes).toBeTruthy();

    buttonDetalhes!.triggerEventHandler('click', null);

    expect(component.acao.emit).toHaveBeenCalledWith({
      pauta: pautaMock,
      tipo: 'detalhes' as PautaAcaoType,
    });
  });
});
