export class ConfigurationError extends Error {
  public constructor(e) {
    super(e);
    Error.captureStackTrace(this, this.constructor);
    this.message = `${e.message || e}`;
  }
}
