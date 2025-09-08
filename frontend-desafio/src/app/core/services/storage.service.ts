import { Injectable } from '@angular/core';

import { IUsuario } from '@app/shared/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public set usuario(value: IUsuario) {
    sessionStorage.setItem('usuario', JSON.stringify(value));
  }

  public get usuario(): IUsuario | null {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  public clearItem(key: 'usuario'): void {
    sessionStorage.removeItem(key);
  }

  public clearAll(): void {
    sessionStorage.clear();
  }
}
