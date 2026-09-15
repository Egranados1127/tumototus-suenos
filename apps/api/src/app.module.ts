// ══════════════════════════════════════════════════════════════════
// APP MODULE — Rodando Sueños API
// Módulos activados por semana conforme avanza el desarrollo
// ══════════════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Compartido
import { AuthCompartidoModule } from './compartido/auth/auth-compartido.module';
import { PersistenciaModule } from './compartido/persistencia/persistencia.module';
import { CompartidoMinioModule } from './compartido/minio/minio.module';

// ─── Semana 2: Vehículos + Identidad ✅ ──────────────────────────
import { VehiculosModule } from './modulos/vehiculos/composicion/vehiculos.module';
import { IdentidadModule } from './modulos/identidad/composicion/identidad.module';

// ─── Semana 3: Contratos ✅ ─────────────────────────────────────────
import { ContratosModule } from './modulos/contratos/composicion/contratos.module';
// ─── Semana 4: Liquidaciones ✅ ─────────────────────────────────────
import { LiquidacionesModule } from './modulos/liquidaciones/composicion/liquidaciones.module';
// ─── Semana 5: Documentos y Alertas ✅ ──────────────────────────────
import { DocumentosModule } from './modulos/documentos/composicion/documentos.module';
// ─── Semana 6: Finanzas y Dashboard ✅ ──────────────────────────────
import { FinanzasModule } from './modulos/finanzas/composicion/finanzas.module';
// ─── Fase 2: Marketplace QR 🚀 ──────────────────────────────
import { MarketplaceModule } from './modulos/marketplace/composicion/marketplace.module';
import { RegistroModule } from './modulos/registro/composicion/registro.module';

import { SaludController } from './salud.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    // ─── Infraestructura compartida ─────────────────────────────
    PersistenciaModule,
    AuthCompartidoModule,
    CompartidoMinioModule,
    // ─── Módulos de negocio ──────────────────────────────────────
    VehiculosModule,      // Semana 2 ✅
    IdentidadModule,      // Semana 2 ✅
    ContratosModule,      // Semana 3 ✅
    LiquidacionesModule,  // Semana 4 ✅
    DocumentosModule,     // Semana 5 ✅
    FinanzasModule,       // Semana 6 ✅
    MarketplaceModule,    // Fase 2 🚀
    RegistroModule,       // Onboarding de Conductores
  ],
  controllers: [SaludController],
})
export class AppModule {}
