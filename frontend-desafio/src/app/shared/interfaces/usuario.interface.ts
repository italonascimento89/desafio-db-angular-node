import { UsuarioType } from '@shared/types/usuario.type';

export interface IUsuario {
  id: string;
  cpf: string;
  tipo: UsuarioType;
}
