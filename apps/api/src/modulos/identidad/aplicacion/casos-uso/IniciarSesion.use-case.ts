// ══════════════════════════════════════════════════════════════════
// MÓDULO IDENTIDAD — Use Case: Iniciar Sesión
// ══════════════════════════════════════════════════════════════════

import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USUARIO_REPO } from '@modulos/identidad/composicion/tokens';
import { UsuarioRepositorioPort } from '@modulos/identidad/puertos/salida/UsuarioRepositorio.port';

export interface IniciarSesionCommand {
  email: string;
  password: string;
}

export interface SesionDTO {
  accessToken: string;
  expiraEn: string;
  usuario: {
    id: string;
    email: string;
    rol: string;
  };
}

@Injectable()
export class IniciarSesionUseCase {
  constructor(
    @Inject(USUARIO_REPO)
    private readonly usuarioRepo: UsuarioRepositorioPort,
    private readonly jwtService: JwtService,
  ) {}

  async ejecutar(cmd: IniciarSesionCommand): Promise<SesionDTO> {
    // 1. Buscar usuario por email
    const usuario = await this.usuarioRepo.buscarPorEmail(cmd.email);
    if (!usuario) {
      // Mensaje genérico — no revela si el email existe
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar que está activo
    if (!usuario.estaActivo()) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // 3. Verificar contraseña
    const passwordValida = await bcrypt.compare(cmd.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 4. Generar JWT
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const expiracion = process.env.JWT_EXPIRACION ?? '8h';
    const accessToken = this.jwtService.sign(payload, { expiresIn: expiracion as any });

    return {
      accessToken,
      expiraEn: expiracion,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
