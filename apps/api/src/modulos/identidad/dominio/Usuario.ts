// ══════════════════════════════════════════════════════════════════
// MÓDULO IDENTIDAD — Dominio: entidad Usuario
// ══════════════════════════════════════════════════════════════════

export type RolUsuario = 'ADMIN' | 'CONDUCTOR' | 'COMERCIO';

export interface UsuarioProps {
  id: string;
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: Date;
}

export class Usuario {
  private constructor(private readonly props: UsuarioProps) {}

  static crear(props: Omit<UsuarioProps, 'creadoEn' | 'activo'>): Usuario {
    return new Usuario({
      ...props,
      activo: true,
      creadoEn: new Date(),
    });
  }

  static reconstituir(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get rol(): RolUsuario { return this.props.rol; }
  get activo(): boolean { return this.props.activo; }

  estaActivo(): boolean {
    return this.props.activo;
  }

  esAdmin(): boolean {
    return this.props.rol === 'ADMIN';
  }
}
