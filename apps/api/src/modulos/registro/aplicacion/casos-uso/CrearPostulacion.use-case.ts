import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';

export interface CrearPostulacionCommand {
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  motoDeseada: string;
  plazoDeseado: number;
}

@Injectable()
export class CrearPostulacionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(cmd: CrearPostulacionCommand) {
    const existe = await this.prisma.postulacionConductor.findUnique({
      where: { cedula: cmd.cedula }
    });

    if (existe) {
      throw new Error('Ya existe una postulación con esta cédula.');
    }

    const postulacion = await this.prisma.postulacionConductor.create({
      data: {
        nombres: cmd.nombres,
        apellidos: cmd.apellidos,
        cedula: cmd.cedula,
        telefono: cmd.telefono,
        ciudad: cmd.ciudad,
        direccion: cmd.direccion,
        motoDeseada: cmd.motoDeseada,
        plazoDeseado: cmd.plazoDeseado,
        estado: 'PENDIENTE',
      }
    });

    return postulacion;
  }
}
