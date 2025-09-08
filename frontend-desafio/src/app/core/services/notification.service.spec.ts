import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { ToastType } from '@app/shared/types/toast.type';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    mockToastr = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
      'warning',
      'clear',
    ]);

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: ToastrService, useValue: mockToastr }],
    });

    service = TestBed.inject(NotificationService);
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve exibir uma notificação com configuração padrão', () => {
    service.show('success', 'Mensagem de sucesso', 'Título');

    expect(mockToastr.success).toHaveBeenCalledWith(
      'Mensagem de sucesso',
      'Título',
      jasmine.objectContaining({
        closeButton: true,
        progressBar: true,
        timeOut: 3000,
        positionClass: 'toast-top-right',
      }),
    );
  });

  it('deve sobrescrever a configuração padrão se fornecida', () => {
    const customConfig: Partial<IndividualConfig> = {
      timeOut: 5000,
      positionClass: 'toast-bottom-left',
    };

    service.show('info', 'Mensagem personalizada', 'Info', customConfig);

    expect(mockToastr.info).toHaveBeenCalledWith(
      'Mensagem personalizada',
      'Info',
      jasmine.objectContaining({
        closeButton: true,
        progressBar: true,
        timeOut: 5000,
        positionClass: 'toast-bottom-left',
      }),
    );
  });

  it('deve limpar uma notificação específica', () => {
    service.clear(42);
    expect(mockToastr.clear).toHaveBeenCalledWith(42);
  });

  it('deve limpar todas as notificações se nenhum ID for passado', () => {
    service.clear();
    expect(mockToastr.clear).toHaveBeenCalledWith(undefined);
  });
});
