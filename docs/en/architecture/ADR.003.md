# ADR-003 · Processing State

- **Status:** Accepted
- **Date:** 2026-09-01

## Context

The Engine executes long-running processing pipelines over collections of documents.

Since processing may be interrupted by execution limits, network failures or external service errors, the Engine must preserve the progress of every document independently.

Without persistent processing state, every execution would need to restart from the beginning, producing duplicated work and unnecessary requests to external services.

This ADR documents the current processing state model implemented by the Engine.

---

## Decision

The Engine shall persist the processing state of every document independently.

Each document has an associated processing record that stores the outcome of every completed stage.

The processing state is updated immediately after each stage completes, regardless of whether the stage succeeds or fails.

This allows future executions to continue from the latest known state.

---

## Processing State Model

The current implementation stores the processing state using the `ProcessedFileRecord` model.

Each record is uniquely identified by the document identifier.

Current state includes:

- fileId
- pages
- pdfProcessingStatus
- pdfProcessingError
- sheetSyncStatus
- sheetRow
- lastUpdatedAt

---

## State Persistence

The current implementation persists processing state through:

- ProcessedFilesRepository

The repository is responsible for:

- Creating processing records.
- Updating existing records.
- Recovering previous state.
- Hydrating domain objects.

The Engine never manages raw persistence directly.

---

## Processing Lifecycle

The processing state evolves incrementally during pipeline execution.

Example:

```text
Document discovered

↓

Processing state loaded

↓

Cloud Run executed

↓

pages stored

↓

Processing state persisted

↓

Google Sheets updated

↓

sheetRow stored

↓

Processing state persisted
```

Each completed stage permanently advances the document state.

---

## Processing Status

The current implementation distinguishes the execution state of individual stages.

Current processing statuses include:

- PENDING
- PROCESSING
- SUCCESS
- FAILED

These statuses describe the execution of a processing stage rather than the overall execution of the Engine.

---

## Synchronization Status

The Engine also tracks synchronization with external systems.

Current synchronization states include:

- PENDING
- SUCCESS
- FAILED

Each synchronization stage maintains its own state independently.

---

## Processing Errors

Failures occurring during a stage are preserved as part of the processing state.

Current implementation stores:

- Latest processing error.
- Timestamp of the latest update.

The Engine never discards processing history during execution.

---

## Design Principles

The processing state follows these principles.

### Independent

Each document maintains its own state.

A failure in one document never affects another.

---

### Incremental

Every completed stage advances the processing state.

---

### Persistent

Processing state survives independent executions.

---

### Recoverable

Future executions continue from the latest completed stage.

---

### Idempotent

Existing processing state prevents duplicated work.

---

## Consequences

Persisting processing state provides:

- Execution recovery.
- Fault tolerance.
- Incremental processing.
- Reduced external requests.
- Processing traceability.

The Engine can safely execute multiple times over the same document collection without restarting completed work.

---

## Notes

This ADR documents the current processing state model.

It does not define how processing records are physically stored.

Future Architectural Decision Records may replace the persistence mechanism without changing the processing state model.