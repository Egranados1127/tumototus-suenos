import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { UsuarioRepositorioPort } from '@modulos/identidad/puertos/salida/UsuarioRepositorio.port';
import { Usuario } from '@modulos/identidad/dominio/Usuario';

@Injectable()
export class UsuarioPostgresRepositorio implements UsuarioRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const u = await this.prisma.usuario.findUnique({ where: { email } });
    if (!u) return null;
    return Usuario.reconstituir({
      id: u.id, email: u.email, passwordHash: u.passwordHash, rol: u.rol as any, activo: u.activo, creadoEn: u.creadoEn
    });
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const u = await this.prisma.usuario.findUnique({ where: { id } });
    if (!u) return null;
    return Usuario.reconstituir({
      id: u.id, email: u.email, passwordHash: u.passwordHash, rol: u.rol as any, activo: u.activo, creadoEn: u.creadoEn
    });
  }

  async crear(usuario: Usuario): Promise<void> {
    await this.prisma.usuario.create({
      data: {
        id: usuario.id,
        email: usuario.email,
        passwordHash: usuario.passwordHash,
        rol: usuario.rol as any,
        activo: usuario.activo,
      },
    });
  }
}
