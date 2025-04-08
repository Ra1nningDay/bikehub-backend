import { Test, TestingModule } from '@nestjs/testing';
import { MotorbikesService } from './motorbike.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MotorbikesService', () => {
  let service: MotorbikesService;

  // Mock PrismaService
  const mockPrismaService = {
    motorbikes: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      }),
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 1, name: 'Honda CBR', price: 50000, brand_id: 1 },
        ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Honda CBR Updated',
        price: 60000,
        brand_id: 1,
      }),
      delete: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MotorbikesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MotorbikesService>(MotorbikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a motorbike', async () => {
      const dto = { name: 'Honda CBR', price: 50000, brand_id: 1 };
      const result = await service.create(dto);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      });
      expect(mockPrismaService.motorbikes.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          price: dto.price,
          brand: { connect: { id: dto.brand_id } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of motorbikes', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Honda CBR', price: 50000, brand_id: 1 },
      ]);
      expect(mockPrismaService.motorbikes.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single motorbike', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      });
      expect(mockPrismaService.motorbikes.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { brand: true },
      });
    });
  });

  describe('update', () => {
    it('should update a motorbike', async () => {
      const dto = { name: 'Honda CBR Updated', price: 60000 };
      const result = await service.update(1, dto);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR Updated',
        price: 60000,
        brand_id: 1,
      });
      expect(mockPrismaService.motorbikes.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: dto.name, price: dto.price, brand: undefined },
      });
    });
  });

  describe('remove', () => {
    it('should delete a motorbike', async () => {
      const result = await service.remove(1);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      });
      expect(mockPrismaService.motorbikes.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
