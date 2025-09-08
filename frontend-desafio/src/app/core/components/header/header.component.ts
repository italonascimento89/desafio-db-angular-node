import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { INavRoute } from '@app/interfaces/nav-route.inteface';

import { StorageService } from '@app/core/services/storage.service';

import { ButtonComponent } from '@app/shared/components/button/button.component';
import { PathRoutes } from '@app/shared/constants/routes.contant';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() public routes: INavRoute[] = [];
  public collapsed: boolean = true;

  constructor(private _storage: StorageService, private _router: Router) {}

  public logout(): void {
    this._storage.clearAll();
    this._router.navigate([PathRoutes.login]);
  }

  public get isLogado(): boolean {
    return !!this._storage.usuario?.tipo;
  }
}
