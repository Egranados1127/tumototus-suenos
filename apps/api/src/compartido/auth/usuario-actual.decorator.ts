// Decorator para extraer el usuario del JWT desde el contexto de la request
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Viene de JwtStrategy.validate()
  },
);
