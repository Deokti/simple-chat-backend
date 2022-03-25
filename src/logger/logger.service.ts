import { Logger as LoggerTslog, } from 'tslog';
import "reflect-metadata";
import { injectable } from 'inversify';

@injectable()
export class LoggerService {
  logger: LoggerTslog;

  constructor() {
    this.logger = new LoggerTslog({
      displayFilePath: "hidden",
    });
  }

  info(message: string) {
    this.logger.info(message);
  }
}