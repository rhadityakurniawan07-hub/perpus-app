import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let controller: AppController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return welcome message', () => {
    expect(controller.getHello()).toEqual({ message: 'PERPUS API is running' });
  });

  it('should return health status with database connected', async () => {
    const result = await controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
  });
});