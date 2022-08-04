export abstract class BaseError {
  code: number;

  name: string;

  title: string;

  description: string;

  originalName: string;

  stackTrace: string;

  // eslint-disable-next-line no-useless-constructor
  constructor(code: number, name: string, title: string, description: string, originalName = '', stackTrace = '') {
    this.code = code;
    this.name = name;
    this.title = title;
    this.description = description;
    this.originalName = originalName;
    this.stackTrace = stackTrace;
  }

  public toPlainObject(): object {
    return {
      code: this.code,
      name: this.name,
      title: this.title,
      description: this.description,
    };
  }
}
