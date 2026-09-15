# TuMotoTus Sueños — Especificaciones Funcionales
### Documento de Presentación para Socios Capitalistas
**Versión 1.0 · Septiembre 2026 · Confidencial**

---

## 1. RESUMEN EJECUTIVO

**TuMotoTus Sueños** es una plataforma tecnológica colombiana de **Rent-to-Own (RTO)** de motocicletas, diseñada para democratizar el acceso a un activo productivo para conductores del sector informal (mototaxismo, delivery, mensajería).

El modelo resuelve la brecha de inclusión financiera: el conductor que hoy paga un "alquiler" diario a un dueño — sin construir patrimonio — puede, con la misma capacidad de pago, convertirse en propietario de su moto al cabo de 6, 12 o 18 meses.

La plataforma digitaliza y automatiza toda la cadena: desde la simulación del plan financiero, la postulación y verificación del conductor (KYC), hasta la gestión del contrato, el seguimiento de pagos, la geolocalización del activo y un canal de comunicación en tiempo real.

---

## 2. PROBLEMA QUE RESUELVE

> *"El 56% de los mototaxistas no propietarios señala que adquirir una moto propia es su principal meta de capitalización."*
> — Banco de la República, Estudio Mototaxismo Sincelejo

| Situación actual del conductor | Con TuMotoTus Sueños |
|---|---|
| Paga $11.000/día al dueño de la moto | Cada pago abona a su propio activo |
| Al final del día: $0 patrimonio acumulado | Al finalizar el contrato: moto propia |
| Sin historial crediticio = sin banco | Sin banco, sin cuota inicial, sin fiador |
| Dependiente del dueño | Independiente y propietario |

---

## 3. MODELO DE NEGOCIO

### 3.1 Propuesta de Valor

La cuota diaria del conductor tiene **dos componentes transparentes:**

$$\text{Cuota Diaria} = \underbrace{\text{Abono Capital}}_{\text{Paga la moto}} + \underbrace{\text{Alquiler Diario}}_{\text{Ingresos TuMotoTus Sueños}}$$

El **capital** incluye: precio de la moto + matrícula + SOAT + seguro todo riesgo + GPS tracker + casco. Todo financiado sin cuota inicial.

### 3.2 Planes Comerciales (Modelo v3)

> Vehículo de referencia: **Bajaj Boxer CT 100** — la moto de trabajo más vendida de Colombia (42% del mercado mototaxista)

| Plan | Capital financiado | Cuota diaria | Cuota mensual | Ganancia mensual/moto |
|---|---|---|---|---|
| **6 meses** | $7.970.000 | $69.278 | $2.078.340 | $695.000 |
| **12 meses** | $7.970.000 | $44.139 | $1.324.170 | $605.000 |
| **18 meses** ⭐ | $7.970.000 | $36.760 | $1.102.800 | $605.000 |

> ⭐ El plan de 18 meses es el **producto estrella**: cuota más accesible, menor rotación, moto en excelente estado (≈49% de vida útil consumida) al finalizar.

### 3.3 Estructura de Costos Operativos (por moto)

| Rubro | Responsable | Costo/mes |
|---|---|---|
| Mantenimiento, combustible, llantas | Conductor | ~$381.000 |
| GPS plan SIM (rastreo del activo) | TuMotoTus Sueños | $20.000 |
| Plataforma tecnológica (prorrateado) | TuMotoTus Sueños | $5.000 |
| Provisión riesgo (impago/hurto) | TuMotoTus Sueños | $30.000 |
| **Costo total nuestro por moto** | | **$55.000/mes** |

### 3.4 Proyección de Rentabilidad por Escala

| Motos en flota | Ganancia mensual | Ganancia anual |
|---|---|---|
| 5 motos | $3.025.000 | $36.300.000 |
| 10 motos | $6.050.000 | $72.600.000 |
| 25 motos | $15.125.000 | $181.500.000 |
| 50 motos | $30.250.000 | $363.000.000 |

---

## 4. ARQUITECTURA TECNOLÓGICA

### 4.1 Visión General

TuMotoTus Sueños es una plataforma **SaaS multi-módulo** construida sobre una arquitectura de microservicios desacoplados, lista para escalar en la nube.

```
┌─────────────────────────────────────────────────────┐
│                  CAPA DE PRESENTACIÓN                │
│  PWA Next.js (Vercel) — Mobile-first · Colombia      │
│  Conductores │ Clientes QR │ Panel Admin             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / WebSocket
┌──────────────────────▼──────────────────────────────┐
│                    CAPA DE API                       │
│  NestJS (Render) — REST + WebSocket (Socket.IO)     │
│  Autenticación JWT · CORS · Rate Limiting            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  CAPA DE DATOS                       │
│  PostgreSQL (Render) — 4 Schemas                    │
│  plataforma │ flota │ marketplace │ finanzas         │
└─────────────────────────────────────────────────────┘
```

### 4.2 Stack Tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Frontend | Next.js 15 + TailwindCSS | PWA mobile-first |
| Backend | NestJS + TypeScript | API REST + WebSockets |
| Base de datos | PostgreSQL + Prisma ORM | Persistencia multi-schema |
| Autenticación | JWT (JSON Web Token) | Sesiones seguras |
| Tiempo real | Socket.IO | Chat y notificaciones live |
| Infraestructura | Vercel + Render | Producción en la nube |
| Rastreo GPS | Hardware IoT + SIM API | Geolocalización de activos |
| Documentos | Cloudinary / S3 | Almacenamiento KYC |

### 4.3 Schemas de Base de Datos

| Schema PostgreSQL | Contiene |
|---|---|
| `plataforma` | Usuarios, roles, autenticación, sesiones |
| `flota` | Vehículos, documentos, GPS, historial técnico |
| `contratos` | Contratos RTO, cuotas, pagos, mora |
| `marketplace` | Comercios QR, pedidos de domicilio, tracking |
| `finanzas` | Resumen financiero, ingresos, reportes |

---

## 5. MÓDULOS FUNCIONALES

### Módulo 1 — ONBOARDING Y KYC (Conoce a Tu Cliente)

**Descripción:** Canal digital para que un candidato a conductor simule su plan, se postule y envíe sus documentos de verificación sin necesidad de visitar una oficina.

**Funcionalidades:**
- Simulador interactivo de cuotas (slider de valor de moto, selección de plazo)
- Desglose transparente: abono a capital vs. alquiler diario
- Formulario de postulación con validación en tiempo real
- Carga de documentos KYC: cédula (frontal/reverso), licencia de conducción, recibo público, selfie
- Consentimiento de tratamiento de datos (Ley 1581/2012)
- Notificación automática al equipo admin
- Estado de postulación en tiempo real para el candidato

**Usuarios:** Candidato a conductor (público)

---

### Módulo 2 — GESTIÓN DE CONTRATOS RTO

**Descripción:** Motor financiero central de la plataforma. Administra el ciclo de vida completo de cada contrato desde la firma hasta la transferencia de propiedad.

**Funcionalidades:**
- Creación de contrato vinculado a conductor + vehículo + plan financiero
- Calendario automático de cuotas (diario/semanal/mensual)
- Registro de pagos con fecha, monto y medio de pago
- Cálculo de mora automático (días vencidos × tasa configurada)
- Dashboard de estado: al día / en mora / pagado / cancelado
- Generación de comprobante de pago (PDF)
- Alertas automáticas: 1 día antes del vencimiento, al entrar en mora
- Historial completo de transacciones por conductor
- Liquidación anticipada con cálculo de descuento
- Transferencia de propiedad al completar el 100% del capital

**Usuarios:** Administrador, Conductor

---

### Módulo 3 — GESTIÓN DE FLOTA

**Descripción:** Inventario digital de todos los activos (motos) de la empresa con trazabilidad completa desde la compra hasta la transferencia.

**Funcionalidades:**
- Registro de vehículos: placa, marca, modelo, cilindraje, VIN, color
- Gestión documental por placa: SOAT, seguro, revisión técnico-mecánica
- Alertas de vencimiento de documentos (30, 15 y 5 días antes)
- Hoja de vida digital: historial de mantenimientos, reparaciones, km
- Estado del vehículo: disponible / en contrato / en mantenimiento / recuperado
- Ficha de entrega y recepción con fotografías
- Integración GPS: ubicación en tiempo real, historial de recorridos
- Botón de alerta/bloqueo remoto del vehículo (anti-hurto)

**Usuarios:** Administrador

---

### Módulo 4 — PORTAL DEL CONDUCTOR

**Descripción:** Aplicación móvil progresiva (PWA) para que el conductor gestione su contrato, reporte pagos y se comunique con el equipo desde su celular.

**Funcionalidades:**
- Dashboard personal: cuotas pagadas, saldo pendiente, % de avance hacia la propiedad
- Calendario de pagos con próximas fechas
- Reporte de pago con comprobante fotográfico (Nequi, Daviplata, efectivo)
- Chat directo con el administrador
- Sección "Mi Moto": datos del vehículo, documentos vigentes
- Notificaciones push: recordatorio de cuota, confirmación de pago
- Calculadora de liquidación anticipada
- Estado de postulación (para candidatos en proceso)

**Usuarios:** Conductor activo

---

### Módulo 5 — MARKETPLACE DE DOMICILIOS (QR)

**Descripción:** Servicio paralelo de generación de pedidos de domicilio a través de códigos QR para comercios aliados. Fuente de ingresos adicionales para conductores activos.

**Funcionalidades:**
- Generación de QR único por comercio aliado
- Formulario de pedido para el cliente final (sin app, desde el QR)
- Selector de tipo de servicio: paquete, mercado, documentos, comida
- Asignación automática al conductor disponible más cercano
- Pantalla de tracking en tiempo real para el cliente: SOLICITADO → ACEPTADO → EN CAMINO → ENTREGADO
- Chat cliente ↔ conductor durante el servicio
- Historial de pedidos por comercio y por conductor
- Calificación del servicio al finalizar
- Reportes de ingresos por domicilios para el conductor

**Usuarios:** Cliente final (escanea QR), Conductor activo, Administrador

---

### Módulo 6 — PANEL ADMINISTRATIVO

**Descripción:** Centro de control operativo para el equipo de TuMotoTus Sueños. Visibilidad total de contratos, conductores, flota y finanzas.

**Funcionalidades:**
- Dashboard financiero: ingresos del día/mes, mora total, proyección
- Gestión de postulaciones: revisar, aprobar o rechazar candidatos
- Creación y firma de contratos
- Vista de conductores: filtrar por estado (activo, moroso, completado)
- Alertas de mora: conductores con cuotas vencidas > N días
- Mapa en tiempo real de toda la flota (GPS)
- Reportes exportables: Excel/PDF de pagos, contratos, inventario
- Gestión de usuarios y roles del equipo
- Configuración de parámetros: plazos, alquileres, multas por mora

**Usuarios:** Administrador, Gerencia

---

### Módulo 7 — FINANZAS Y REPORTES

**Descripción:** Motor de inteligencia financiera que consolida todos los ingresos y genera los indicadores clave del negocio.

**Funcionalidades:**
- P&L por moto: ingresos, costos nuestros, ganancia neta
- Flujo de caja proyectado (próximos 30/90/180 días)
- Indicadores clave: tasa de mora, tasa de completación, ROI por moto
- Comparativo real vs. proyectado
- Reporte de contratos en riesgo (mora > 7 días)
- Exportación a Excel para contabilidad
- Integración futura con SIIGO / Alegra (contabilidad colombiana)

**Usuarios:** Gerencia, Administrador financiero

---

### Módulo 8 — COMUNICACIONES EN TIEMPO REAL

**Descripción:** Sistema de mensajería y notificaciones que conecta todos los actores de la plataforma sin necesidad de WhatsApp externo.

**Funcionalidades:**
- Chat conductor ↔ administrador (soporte)
- Chat cliente ↔ conductor (pedidos de domicilio)
- Notificaciones push web: cuotas, pagos confirmados, alertas
- Integración WhatsApp Business API (fase 2): recordatorios automáticos de cuota
- Historial de conversaciones por contrato/pedido
- Mensajes de sistema automatizados: bienvenida, confirmación, mora

**Usuarios:** Todos los roles

---

## 6. FLUJO COMPLETO DEL USUARIO

```
CANDIDATO A CONDUCTOR
        │
        ▼
[1] Simulador de Plan (elige moto y plazo)
        │
        ▼
[2] Formulario de Postulación + KYC (documentos)
        │
        ▼
[3] Revisión Admin (aprobación en 24h)
        │
        ▼
[4] Firma Digital del Contrato RTO
        │
        ▼
[5] Entrega de la Moto (+ GPS instalado)
        │
        ▼
[6] Pagos Diarios/Semanales vía Portal del Conductor
        │
        ▼
[7] Seguimiento GPS + Chat de Soporte
        │
        ▼
[8] Último Pago → Transferencia de Propiedad ✅
```

---

## 7. SEGURIDAD Y CUMPLIMIENTO

| Aspecto | Implementación |
|---|---|
| Autenticación | JWT con expiración configurable |
| Datos personales | Ley 1581 de 2012 (Habeas Data) |
| Transmisión | HTTPS / TLS en todos los endpoints |
| Documentos KYC | Almacenamiento cifrado en nube |
| GPS anti-hurto | Bloqueo remoto del vehículo |
| Acceso admin | PIN + roles diferenciados |
| Auditoría | Log de todas las acciones críticas |

---

## 8. ESTADO ACTUAL DEL DESARROLLO

| Módulo | Estado |
|---|---|
| Simulador de Cuotas (v3) | ✅ Producción |
| Postulación y KYC (formulario) | ✅ Producción |
| Marketplace QR + Tracking | ✅ Producción (beta) |
| Chat en tiempo real | 🟡 Base funcional |
| Portal del Conductor | 🟡 Vista básica |
| Panel Admin | 🟡 Dashboard base |
| Gestión de Contratos | 🔴 En desarrollo |
| Gestión de Flota | 🔴 Schema definido |
| GPS integrado | 🔴 Pendiente hardware |
| Finanzas y Reportes | 🔴 Schema definido |
| Notificaciones WhatsApp | 🔴 Fase 2 |

---

## 9. HOJA DE RUTA (ROADMAP)

### Fase 1 — MVP (Actual) ✅
- Plataforma en producción (Vercel + Render + PostgreSQL)
- Simulador financiero v3
- Postulación digital con KYC
- Marketplace de domicilios QR

### Fase 2 — Operación (Q4 2026)
- Portal completo del conductor con historial de pagos
- Panel admin con gestión de contratos y mora
- Integración GPS hardware (tracker IoT)
- Notificaciones WhatsApp Business API
- Primeras 10 motos en operación

### Fase 3 — Escala (Q1-Q2 2027)
- Módulo de finanzas con P&L automatizado
- App nativa Android (para conductores)
- Integración con pasarela de pagos (PSE, Nequi, Daviplata)
- Expansión a 50+ motos / 2 ciudades

### Fase 4 — Ecosistema (Q3 2027+)
- Marketplace B2B para empresas de delivery
- Score crediticio propio basado en historial de pagos
- Alianza con aseguradoras para tarifas preferenciales
- Posible expansión a Ecuador y Perú

---

## 10. REQUERIMIENTOS DE INVERSIÓN

| Rubro | Inversión estimada |
|---|---|
| Flota inicial (10 motos Boxer CT 100) | $79.700.000 |
| GPS hardware (10 unidades) | $3.000.000 |
| Desarrollo tecnológico (Fases 2-3) | $25.000.000 |
| Operación y nómina (6 meses) | $30.000.000 |
| Marketing y adquisición conductores | $10.000.000 |
| **TOTAL INVERSIÓN FASE 2** | **$147.700.000** |

**Retorno proyectado (10 motos × 18 meses):**

$$\text{Ganancia bruta} = 10 \times \$660.000/\text{mes} \times 18 = \$118.800.000$$

$$\text{ROI} = \frac{\$118.800.000}{\$147.700.000} \approx 80\% \text{ en 18 meses}$$

> El punto de equilibrio se alcanza en el mes **9-10** de operación con 10 motos activas.

---

## 11. DIFERENCIADORES COMPETITIVOS

| Factor | Competencia tradicional | TuMotoTus Sueños |
|---|---|---|
| Canal | Presencial / papel | 100% digital desde el celular |
| Transparencia | Contrato verbal o físico | Contrato digital con desglose en tiempo real |
| Seguimiento | Sin control del activo | GPS en tiempo real + alerta anti-hurto |
| Comunicación | WhatsApp informal | Chat integrado en plataforma |
| Escalabilidad | Una ciudad, manual | Multi-ciudad, automatizado |
| Score conductor | Sin historial | Historial de pagos propio (base para crédito futuro) |

---

*Documento preparado por el equipo técnico de TuMotoTus Sueños · Confidencial · No distribuir sin autorización*
