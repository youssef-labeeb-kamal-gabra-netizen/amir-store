/**
 * Standard Result pattern type for deterministic, type-safe error handling
 * without throwing unhandled exceptions across application layers.
 */
export type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export interface AppError {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}
