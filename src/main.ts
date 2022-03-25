import { LoggerService } from './logger/logger.service';
import { INVERSIFY_TYPES } from './config/inversify.types';
import { Container } from "inversify";
import { App } from "./app";

function bootstrap(): void {
  const container = new Container();
  container.bind<LoggerService>(INVERSIFY_TYPES.LoggerService).to(LoggerService);
  container.bind<App>(INVERSIFY_TYPES.App).to(App);

  const app = container.get<App>(INVERSIFY_TYPES.App);
  app.init();
}

bootstrap();