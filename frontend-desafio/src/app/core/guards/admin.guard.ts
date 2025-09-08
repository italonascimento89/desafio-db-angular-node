import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { StorageService } from '@core/services/storage.service';
import { NotificationService } from '@core/services/notification.service';

import { PathRoutes } from '@app/shared/constants/routes.contant';

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const usuario = storage.usuario;

  if (!!usuario?.tipo) {
    return true;
  }

  notification.show(
    'error',
    'Você precisa estar logado para acessar esta página.',
    'Acesso negado',
  );

  router.navigate([PathRoutes.login]);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const usuario = storage.usuario;

  if (usuario?.tipo === 'admin') {
    return true;
  }

  notification.show('error', 'Acesso restrito a administradores.', 'Acesso negado');

  router.navigate([PathRoutes.login]);
  return false;
};
