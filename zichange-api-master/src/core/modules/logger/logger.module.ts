import * as Pino from 'pino';
import { Logger } from '@nestjs/common';

export class PinoLogger {
  private readonly pino: Pino.Logger;
  private readonly moduleName: string;

  public constructor(moduleName: string) {
    this.pino = Pino();
    this.moduleName = moduleName;
  }

  private getViewForNestLogger(obj?: object, msg?: string, ...args: any[]) {
    obj = obj || {};
    const fields = Object.getOwnPropertyNames(obj);

    // @ts-ignore
    const objView = fields.map(el => `${el}: ${JSON.stringify(obj[el])}`).join(', ');
    const argsView = args.map(el => JSON.stringify(el)).join(' ');

    return `${this.moduleName}: ${msg} ${objView} ${argsView}`;
  }

  public error(msg: string, obj?: object, ...args: any[]) {
    this.pino.error({
      ...obj,
      moduleName: this.moduleName,
    }, msg, ...args);

    Logger.error(this.getViewForNestLogger(obj, msg, ...args));
  }

  public info(msg: string, obj?: object, ...args: any[]) {
    this.pino.info({
      ...obj,
      moduleName: this.moduleName,
    }, msg, ...args);

    Logger.log(this.getViewForNestLogger(obj, msg, ...args));
  }

  public warning(msg: string, obj?: object, ...args: any[]) {
    this.pino.warn({
      ...obj,
      moduleName: this.moduleName,
    }, msg, ...args);

    Logger.warn(this.getViewForNestLogger(obj, msg, ...args));
  }

  public debug(msg: string, obj?: object, ...args: any[]) {
    this.pino.debug({
      ...obj,
      moduleName: this.moduleName,
    }, msg, ...args);

    Logger.log(this.getViewForNestLogger(obj, msg, ...args));
  }
}