import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return welcome message', () => {
    expect(controller.getHello()).toEqual({ message: 'Welcome to PinjamanBuku API' });
  });

  it('should return health status', () => {
    expect(controller.getHealth()).toEqual({ status: 'ok', message: 'PinjamanBuku API is running' });
  });
});
