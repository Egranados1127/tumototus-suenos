import { Usuario } from '../../dominio/Usuario';

export interface UsuarioRepositorioPort {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
  crear(usuario: Usuario): Promise<void>;
}
