import { AppError } from "@/types/result";

export class ApplicationError extends Error implements AppError {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500, details?: unknown) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  static badRequest(message = "البيانات المدخلة غير صحيحة", details?: unknown): ApplicationError {
    return new ApplicationError(message, "BAD_REQUEST", 400, details);
  }

  static unauthorized(message = "يرجى تسجيل الدخول أولاً"): ApplicationError {
    return new ApplicationError(message, "UNAUTHORIZED", 401);
  }

  static forbidden(message = "ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء"): ApplicationError {
    return new ApplicationError(message, "FORBIDDEN", 403);
  }

  static notFound(message = "العنصر المطلوب غير موجود"): ApplicationError {
    return new ApplicationError(message, "NOT_FOUND", 404);
  }

  static conflict(message = "يوجد تعارض مع بيانات مسجلة مسبقاً"): ApplicationError {
    return new ApplicationError(message, "CONFLICT", 409);
  }

  static internal(message = "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً"): ApplicationError {
    return new ApplicationError(message, "INTERNAL_SERVER_ERROR", 500);
  }
}
