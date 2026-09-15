# TuMotoTus Sueños — Especificaciones Funcionales
### Documento de Presentación para Socios Capitalistas
**Versión 2.0 · Septiembre 2026 · Confidencial**

---

## 1. RESUMEN EJECUTIVO

**TuMotoTus Sueños** no es una empresa de alquiler de motos.

Es un **ecosistema digital de movilidad productiva** para el trabajador informal colombiano. Entregamos simultáneamente dos cosas que el conductor necesita y que hoy nadie le da juntas:

> 🏍️ **La moto** — financiada sin banco, sin cuota inicial, sin fiador.
> 📦 **El trabajo** — pedidos de domicilio desde el primer día para pagar la cuota.

El conductor no espera tener dinero para acceder a la moto. **Usa la moto para generar el dinero con el que la paga.** Al finalizar el plazo, es propietario de un activo productivo libre de deuda.

La plataforma que hace posible todo esto es un conjunto de **5 aplicaciones interconectadas** que cubren cada momento del ciclo: desde que el conductor se postula, hasta el día en que la moto es legalmente suya.

---

## 2. EL PROBLEMA QUE RESOLVEMOS

> *"El 56% de los mototaxistas no propietarios señala que adquirir una moto propia es su principal meta de capitalización."*
> — Banco de la República, Estudio Mototaxismo Sincelejo

Hoy el conductor informal enfrenta una trampa:

- **Sin moto propia** → trabaja para enriquecer al dueño (paga $11.000/día sin construir patrimonio)
- **Sin historial crediticio** → el banco no le presta
- **Sin ahorros suficientes** → no puede dar cuota inicial
- **Sin trabajo formal** → tampoco puede demostrar ingresos a una financiera

**Las plataformas actuales que existen en el mercado** (dosR Movilidad, Rappi, PedidosYa, financieras informales) resuelven UNO de estos problemas, nunca todos. Le dan la moto SIN los pedidos, o los pedidos SIN la moto.

**TuMotoTus Sueños resuelve los cuatro al tiempo.**

---

## 3. NUESTRO ECOSISTEMA — LAS 5 PLATAFORMAS

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECOSISTEMA TuMotoTus Sueños                  │
│                                                                  │
│  [1] App Conductor  [2] App Cliente QR  [3] Panel Admin         │
│  [4] Motor RTO      [5] Sistema GPS + Comunicaciones            │
└─────────────────────────────────────────────────────────────────┘
```

Todo conectado. Todo en tiempo real. Todo desde el celular.

---

## 4. PLATAFORMA 1 — APP DEL CONDUCTOR (Portal Móvil)

### ¿Qué es?
La aplicación principal del conductor. Funciona desde el navegador del celular sin necesidad de descargar nada. Es su centro de operaciones: aquí recibe pedidos, ve cuánto lleva pagado, reporta sus cuotas y se comunica con el equipo.

### ¿Qué puede hacer el conductor desde esta app?

**Para ganar dinero (Domicilios):**
- Ver los pedidos disponibles en tiempo real en su zona
- Aceptar un pedido con un toque
- Ver la dirección de recogida y entrega
- Chatear con el cliente durante el servicio
- Marcar el pedido como entregado
- Ver su historial de servicios completados y ganancias del día

**Para pagar su moto (Contrato RTO):**
- Ver cuánto ha pagado y cuánto le falta
- Ver la barra de progreso hacia la propiedad (ej: "llevas el 34% de tu moto")
- Consultar el calendario de próximas cuotas
- Reportar un pago con foto del comprobante (Nequi, Daviplata, efectivo)
- Ver el certificado de pago de cada cuota
- Calcular cuánto costaría liquidar anticipadamente
- Ver los datos de su moto: placa, SOAT, seguro vigente, próximo mantenimiento

**Para comunicarse:**
- Chat directo con el administrador (soporte y acuerdos)
- Notificaciones: recordatorio de cuota, confirmación de pago, alerta de mora
- Notificación cuando le asignan un pedido

**En caso de emergencia:**
- Botón de alerta en caso de accidente o robo
- Datos de contacto de soporte 24/7

---

## 5. PLATAFORMA 2 — APP DE DOMICILIOS (Marketplace QR)

### ¿Qué es?
Una plataforma de pedidos de domicilio donde los **comercios aliados** generan un código QR único. El cliente escanea ese QR con la cámara del celular y hace su pedido en segundos, sin descargar ninguna aplicación. El pedido llega automáticamente al conductor disponible más cercano.

### ¿Por qué es diferente a Rappi o PedidosYa?
- **Sin comisiones abusivas al comercio** (ellos cobran 25%-30%)
- **Sin app para el cliente** — solo escanear el QR
- **El conductor ya tiene la moto** — no necesita buscar conductores externos
- **Los ingresos del domicilio van directo al conductor** — no pasan por intermediarios

### ¿Qué puede hacer el cliente final?
- Escanear el QR del comercio
- Elegir el tipo de servicio: 📦 Paquete · 🛒 Mercado · 📄 Documentos · 🍕 Comida
- Ingresar descripción del pedido y dirección de entrega
- Dejar instrucciones especiales al conductor
- Ver en tiempo real el estado del pedido: **SOLICITADO → ACEPTADO → EN CAMINO → ENTREGADO**
- Chatear con el conductor durante el servicio
- Calificar el servicio al finalizar

### ¿Qué puede hacer el comercio aliado?
- Tener su QR personalizado (impreso o digital)
- Ver el historial de pedidos solicitados desde su establecimiento
- Ver el tiempo promedio de respuesta
- Solicitar nuevos pedidos en cualquier momento

### ¿Qué gana TuMotoTus Sueños?
- **Comisión por pedido** (modelo configurable: fijo o porcentaje)
- **Retención del conductor** — tiene trabajo dentro de nuestra plataforma
- **Reducción del riesgo de mora** — conductor con ingresos activos paga mejor

---

## 6. PLATAFORMA 3 — PANEL ADMINISTRATIVO (Centro de Control)

### ¿Qué es?
El sistema de gestión interna para el equipo de TuMotoTus Sueños. Desde aquí se controla todo el negocio: motos, conductores, contratos, pagos y finanzas.

### Gestión de Conductores
- Ver todos los candidatos postulados con sus documentos KYC
- Aprobar o rechazar postulaciones con un clic
- Ver el perfil completo de cada conductor activo: datos, contrato, historial de pagos
- Filtrar por estado: postulado · activo · en mora · completado · retirado
- Ver el score de cumplimiento de cada conductor (pagos a tiempo vs. tardíos)
- Enviar mensajes o alertas individuales o masivas

### Gestión de Contratos
- Crear un contrato vinculando conductor + moto + plan financiero
- Ver el calendario de cuotas generado automáticamente
- Registrar pagos recibidos con fecha, monto y medio de pago
- Ver conductores con mora: días vencidos, monto adeudado
- Liquidar anticipadamente un contrato con cálculo automático de descuento
- Marcar contrato como completado y generar carta de propiedad

### Gestión de Flota (Motos)
- Inventario de todas las motos: placa, modelo, estado, conductor asignado
- Ver documentos vigentes: SOAT, seguro, revisión técnico-mecánica
- Alertas automáticas de vencimiento de documentos (30, 15 y 5 días antes)
- Historial de mantenimientos de cada moto
- Ficha de entrega con fotografías del estado inicial
- Ver ubicación GPS de cada moto en tiempo real
- Activar alerta o bloqueo remoto en caso de robo

### Control del Marketplace
- Ver todos los pedidos activos, completados y cancelados
- Ver qué conductor atendió cada pedido
- Ver el tiempo de respuesta promedio por zona
- Gestionar comercios aliados: alta, edición, desactivación del QR
- Ver ingresos generados por comisiones del día/semana/mes

### Finanzas y Reportes
- Dashboard financiero: ingresos del día, del mes, proyección del año
- Desglose por fuente: ingresos RTO vs. ingresos Marketplace
- Conductores en mora y monto total adeudado
- P&L por moto: cuánto genera cada activo mensualmente
- Exportación de reportes en Excel/PDF para contabilidad
- Indicadores clave: tasa de completación de contratos, tasa de mora, rotación de motos

---

## 7. PLATAFORMA 4 — MOTOR RTO (Simulador y Contratos)

### ¿Qué es?
El cerebro financiero de la plataforma. Es público para cualquier candidato y privado para el administrador.

### Simulador Público (para candidatos)
- El candidato ingresa el valor de la moto que quiere
- El sistema calcula automáticamente el capital total a financiar (moto + matrícula + SOAT + seguro + GPS + casco)
- Muestra 3 opciones: 6, 12 y 18 meses con cuota diaria, semanal y mensual
- Muestra el desglose: abono al capital vs. alquiler del día
- Permite postularse al plan elegido directamente desde el simulador
- El candidato llena sus datos personales y sube sus documentos KYC (cédula, licencia, recibo, selfie)

### Motor de Contratos (interno)
- Genera el contrato digital con todos los parámetros del plan elegido
- Calcula automáticamente las fechas de cada cuota
- Aplica mora automáticamente si hay retraso (tasa configurable por día)
- Calcula el valor de liquidación anticipada en cualquier momento
- Genera los comprobantes de pago de cada cuota
- Emite la carta de transferencia de propiedad al completar el 100%

---

## 8. PLATAFORMA 5 — GPS + COMUNICACIONES EN TIEMPO REAL

### ¿Qué es?
El sistema de rastreo y comunicación que conecta a todos los actores en tiempo real y protege los activos de la empresa.

### Rastreo GPS de la Flota
- Ubicación en tiempo real de cada moto en el mapa
- Historial de recorridos por fecha y conductor
- Zonas prohibidas: alerta si la moto sale de un área definida (geo-cerca)
- Detección de inactividad prolongada (moto parada más de X horas)
- Botón de bloqueo remoto del motor en caso de robo o impago grave
- Reporte de kilómetros recorridos por mes (para proyectar mantenimientos)

### Comunicaciones en Tiempo Real
- **Chat conductor ↔ administrador:** soporte, acuerdos de pago, notificaciones
- **Chat cliente ↔ conductor:** durante los pedidos de domicilio
- **Notificaciones automáticas del sistema:**
  - "Tu cuota vence mañana" (recordatorio)
  - "Tu pago de $X fue confirmado" (tranquilidad)
  - "Llevas el 50% de tu moto pagada" (motivación)
  - "Tienes un nuevo pedido disponible" (oportunidad)
  - "Tu moto tiene el SOAT próximo a vencer" (alerta)
- **WhatsApp Business API** (Fase 2): todos los mensajes anteriores también por WhatsApp

---

## 9. EL EFECTO VOLANTE (FLYWHEEL)

Este es el diferenciador que convierte TuMotoTus Sueños en un negocio de alto valor para el inversionista:

```
     ┌─────────────────────────────────────┐
     │                                     │
     ▼                                     │
Conductor sin moto                         │
     │                                     │
     ▼                                     │
Se postula → KYC → Contrato RTO            │
     │                                     │
     ▼                                     │
Recibe la moto + acceso al Marketplace     │
     │                                     │
     ▼                                     │
Hace domicilios → Genera ingresos          │
     │                                     │
     ▼                                     │
Paga cuotas RTO con esos ingresos          │
     │                                     │
     ▼                                     │
Termina el contrato → Dueño de la moto ───┘
     │
     ▼
Recomienda la plataforma a otro conductor
(adquisición orgánica de clientes)
```

**Cada conductor activo genera ingresos por DOS vías simultáneas:**
1. **Cuota RTO** → ingreso fijo mensual garantizado por contrato
2. **Comisión por domicilio** → ingreso variable por cada pedido completado

**El Marketplace reduce el riesgo de mora:** un conductor con pedidos activos tiene flujo de caja constante. Un conductor sin trabajo incumple. Nosotros controlamos ambos.

---

## 10. MODELO DE NEGOCIO — DOS FUENTES DE INGRESOS

### Fuente 1: Alquiler RTO (Ingreso Fijo)

| Plan | Alquiler/día | Ganancia mensual/moto |
|---|---|---|
| 6 meses | $25.000 | $695.000 |
| 12 meses | $22.000 | $605.000 |
| 18 meses ⭐ | $22.000 | $605.000 |

### Fuente 2: Comisiones Marketplace (Ingreso Variable)

| Métrica | Estimado conservador |
|---|---|
| Pedidos/día por conductor activo | 5 – 8 pedidos |
| Comisión por pedido | $1.500 – $3.000 |
| Ingreso marketplace/conductor/mes | $225.000 – $720.000 |
| **Ingreso total por moto (RTO + Marketplace)** | **$830.000 – $1.325.000/mes** |

### Proyección de Flota (plan 18 meses + marketplace)

| Motos | Ingresos RTO/mes | Ingresos Marketplace/mes | **Total/mes** |
|---|---|---|---|
| 10 | $6.050.000 | $4.725.000 | **$10.775.000** |
| 25 | $15.125.000 | $11.812.500 | **$26.937.500** |
| 50 | $30.250.000 | $23.625.000 | **$53.875.000** |

---

## 11. FLUJO COMPLETO — DE CANDIDATO A PROPIETARIO

```
[1] DESCUBRIMIENTO
    └── Llega a la landing · Simula su plan · Ve cuánto pagaría por día

[2] POSTULACIÓN (KYC)
    └── Llena datos · Sube documentos · Acepta términos

[3] VALIDACIÓN (Admin)
    └── Equipo revisa documentos · Aprueba en 24h · Firma contrato digital

[4] ENTREGA DE LA MOTO
    └── Moto entregada con GPS instalado · Acceso activado al App del Conductor

[5] OPERACIÓN DIARIA
    └── Recibe pedidos de domicilio · Completa servicios · Genera ingresos
    └── Paga su cuota RTO (diaria o semanal) · Ve su progreso en el app

[6] SEGUIMIENTO
    └── GPS activo · Chat de soporte · Alertas de cuota · Reporte de pagos

[7] PROPIEDAD
    └── Último pago completado · Carta de propiedad emitida · Moto 100% suya
    └── Puede seguir usando el Marketplace como conductor independiente
```

---

## 12. ESTADO ACTUAL DE DESARROLLO

| Plataforma / Módulo | Estado | Canal |
|---|---|---|
| Landing Page pública | ✅ Producción | Web |
| Simulador RTO v3 (6/12/18 meses) | ✅ Producción | Web |
| Formulario de Postulación + KYC | ✅ Producción | Web |
| Marketplace QR (pedidos de domicilio) | ✅ Beta | Web |
| Tracking de pedidos en tiempo real | ✅ Beta | Web |
| Chat en tiempo real | 🟡 Base funcional | Web |
| App del Conductor (portal pagos) | 🟡 Vista básica | Web |
| Panel Administrativo | 🟡 Dashboard base | Web |
| Motor de Contratos y Cuotas | 🔴 En desarrollo | Backend |
| Gestión de Flota y Documentos | 🔴 Schema definido | Backend |
| Integración GPS hardware | 🔴 Fase 2 | IoT |
| Notificaciones WhatsApp Business | 🔴 Fase 2 | API |
| Pasarela de pagos (PSE/Nequi) | 🔴 Fase 2 | API |
| App nativa Android | 🔴 Fase 3 | Mobile |

---

## 13. HOJA DE RUTA

### Fase 1 — MVP (Actual ✅)
Plataforma en producción · Simulador financiero · Postulación digital · Marketplace QR · Tracking de pedidos

### Fase 2 — Operación Real (Q4 2026)
App del conductor completa · Gestión de contratos y mora · GPS hardware integrado · Notificaciones WhatsApp · Pasarela de pagos · Primeras 10 motos en operación

### Fase 3 — Escala (Q1–Q2 2027)
App Android nativa · Integración contable (SIIGO/Alegra) · Score crediticio interno · 50 motos · 2 ciudades · Alianzas con comercios para el Marketplace

### Fase 4 — Ecosistema (Q3 2027+)
Score crediticio propio como producto (préstamos a conductores ya verificados) · Expansión B2B (flotas empresariales) · Ecuador y Perú

---

## 14. REQUERIMIENTO DE INVERSIÓN Y RETORNO

| Rubro | Inversión |
|---|---|
| Flota inicial (10 motos Boxer CT 100 con docs) | $79.700.000 |
| GPS hardware (10 unidades + instalación) | $3.000.000 |
| Desarrollo tecnológico Fase 2 | $25.000.000 |
| Operación y equipo (6 meses) | $30.000.000 |
| Marketing y adquisición de conductores | $10.000.000 |
| **TOTAL INVERSIÓN FASE 2** | **$147.700.000** |

**Retorno proyectado con 10 motos (RTO + Marketplace):**

| Fuente | Ingreso mensual | Ingreso 18 meses |
|---|---|---|
| RTO (alquiler diario) | $6.050.000 | $108.900.000 |
| Marketplace (comisiones) | $4.725.000 | $85.050.000 |
| **Total** | **$10.775.000** | **$193.950.000** |

$$\text{ROI} = \frac{\$193.950.000}{\$147.700.000} \approx \mathbf{131\%} \text{ en 18 meses}$$

> Punto de equilibrio estimado: **mes 7** con 10 motos activas en ambas plataformas.

---

## 15. DIFERENCIADORES FRENTE A LA COMPETENCIA

| Factor | dosR / Financieras tradicionales | Rappi / PedidosYa | **TuMotoTus Sueños** |
|---|---|---|---|
| Financia la moto | ✅ | ❌ | ✅ |
| Da trabajo al conductor | ❌ | ✅ | ✅ |
| El conductor construye patrimonio | ❌ | ❌ | ✅ |
| Sin app para el cliente | ❌ | ❌ | ✅ (solo QR) |
| GPS + control del activo | ❌ | N/A | ✅ |
| Chat integrado | ❌ | ✅ | ✅ |
| Score crediticio propio | ❌ | ❌ | ✅ (Fase 3) |
| Comisión al comercio | N/A | 25%–30% | Configurable (menor) |
| Plataforma 100% digital | Parcial | ✅ | ✅ |

---

## 16. VENTAJA ESTRUCTURAL

La ventaja más importante de TuMotoTus Sueños no es la tecnología. Es la **posición única en la cadena de valor**:

1. Somos dueños del activo (la moto) hasta que el conductor termina de pagar → **garantía real**
2. Somos el canal por el que el conductor genera los ingresos para pagar → **control del flujo de caja**
3. Somos la plataforma de comunicación entre conductor y cliente → **datos valiosos del comportamiento**
4. Somos los que verifican la identidad y el historial del conductor → **base de datos crediticia propia**

Ningún actor del mercado hoy tiene estas cuatro posiciones al mismo tiempo.

---

*Documento preparado por el equipo técnico de TuMotoTus Sueños · v2.0 · Septiembre 2026*
*Confidencial — No distribuir sin autorización expresa*
