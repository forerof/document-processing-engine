# ADR-003 · Estado de Procesamiento

- **Estado:** Aprobado
- **Fecha:** 2026-09-01

## Contexto

El Motor ejecuta pipelines de procesamiento de larga duración sobre colecciones de documentos.

Dado que el procesamiento puede interrumpirse debido a límites de ejecución, fallos de red o errores de servicios externos, el Motor debe preservar el progreso de cada documento de manera independiente.

Sin un estado de procesamiento persistente, cada ejecución tendría que comenzar desde el inicio, generando trabajo duplicado y solicitudes innecesarias a servicios externos.

Este ADR documenta el modelo de estado de procesamiento actualmente implementado por el Motor.

---

## Decisión

El Motor persistirá el estado de procesamiento de cada documento de manera independiente.

Cada documento posee un registro de procesamiento asociado que almacena el resultado de cada etapa completada.

El estado de procesamiento se actualiza inmediatamente después de finalizar cada etapa, independientemente de si esta termina con éxito o con error.

Esto permite que futuras ejecuciones continúen desde el último estado conocido.

---

## Modelo de Estado de Procesamiento

La implementación actual almacena el estado de procesamiento mediante el modelo `ProcessedFileRecord`.

Cada registro se identifica de forma única mediante el identificador del documento.

Actualmente el estado incluye:

- fileId
- pages
- pdfProcessingStatus
- pdfProcessingError
- sheetSyncStatus
- sheetRow
- lastUpdatedAt

---

## Persistencia del Estado

La implementación actual persiste el estado mediante:

- ProcessedFilesRepository

El repositorio es responsable de:

- Crear registros de procesamiento.
- Actualizar registros existentes.
- Recuperar estados previos.
- Hidratar los objetos del dominio.

El Motor nunca administra directamente la persistencia.

---

## Ciclo de Vida del Procesamiento

El estado evoluciona de manera incremental durante la ejecución del pipeline.

Ejemplo:

```text
Documento descubierto

↓

Estado recuperado

↓

Cloud Run ejecutado

↓

pages almacenado

↓

Estado persistido

↓

Google Sheets actualizado

↓

sheetRow almacenado

↓

Estado persistido
```

Cada etapa completada hace avanzar permanentemente el estado del documento.

---

## Estado del Procesamiento

La implementación actual distingue el estado de ejecución de cada etapa.

Actualmente existen los siguientes estados:

- PENDING
- PROCESSING
- SUCCESS
- FAILED

Estos estados describen la ejecución de una etapa específica y no el estado global del Motor.

---

## Estado de Sincronización

El Motor también mantiene el estado de sincronización con sistemas externos.

Actualmente existen:

- PENDING
- SUCCESS
- FAILED

Cada etapa de sincronización mantiene su propio estado de forma independiente.

---

## Errores de Procesamiento

Los errores ocurridos durante una etapa forman parte del estado persistente del documento.

Actualmente se almacena:

- El último error ocurrido.
- La fecha de la última actualización.

El Motor nunca descarta el estado alcanzado durante el procesamiento.

---

## Principios de Diseño

El estado de procesamiento sigue los siguientes principios.

### Independiente

Cada documento mantiene su propio estado.

Un error en un documento nunca afecta a los demás.

---

### Incremental

Cada etapa completada hace avanzar el estado del documento.

---

### Persistente

El estado sobrevive entre distintas ejecuciones.

---

### Recuperable

Las ejecuciones futuras continúan desde la última etapa completada.

---

### Idempotente

El estado existente evita repetir trabajo previamente realizado.

---

## Consecuencias

Persistir el estado proporciona:

- Recuperación de ejecuciones.
- Tolerancia a fallos.
- Procesamiento incremental.
- Reducción de llamadas innecesarias a servicios externos.
- Trazabilidad del procesamiento.

El Motor puede ejecutarse múltiples veces sobre la misma colección de documentos sin reiniciar el trabajo ya completado.

---

## Notas

Este ADR documenta el modelo actual de estado de procesamiento.

No define cómo se almacena físicamente la información.

Futuros Registros de Decisión Arquitectónica podrán reemplazar el mecanismo de persistencia sin modificar el modelo de estado de procesamiento.