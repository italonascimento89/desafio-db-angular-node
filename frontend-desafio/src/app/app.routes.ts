import { Routes } from '@angular/router';

import { PathRoutes } from '@shared/constants/routes.contant';
import { adminGuard, authGuard } from '@core/guards/admin.guard';

export const routes: Routes = [
  {
    path: PathRoutes.login,
    loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: PathRoutes.criarPauta,
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./modules/criar-pauta/criar-pauta.component').then(m => m.CriarPautaComponent),
  },
  {
    canActivate: [authGuard, adminGuard],
    path: PathRoutes.cadastrarUsuario,
    loadComponent: () =>
      import('./modules/cadastrar-usuario/cadastrar-usuario.component').then(
        m => m.CadastrarUsuarioComponent,
      ),
  },
  {
    path: PathRoutes.listarPautas,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/listar-pautas/listar-pautas.component').then(m => m.ListarPautasComponent),
  },
  {
    path: `${PathRoutes.votarPautas}/:id`,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/votar-pauta/votar-pauta.component').then(m => m.VotarPautaComponent),
  },
  {
    path: `${PathRoutes.detalhesPauta}/:id`,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/detalhes-pauta/detalhes-pauta.component').then(
        m => m.DetalhesPautaComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: PathRoutes.login,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./modules/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
