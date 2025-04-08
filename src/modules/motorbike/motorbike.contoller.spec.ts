import { Test, TestingModule } from '@nestjs/testing';
import { MotorbikesController } from './motorbike.controller';
import { MotorbikesService } from './motorbike.service';

describe('MotorbikesController', () => {
  let controller: MotorbikesController;

  const mockMotorbikesService = {
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Honda CBR',
      price: 50000,
      brand_id: 1,
    }),
    findAll: jest
      .fn()
      .mockResolvedValue([
        { id: 1, name: 'Honda CBR', price: 50000, brand_id: 1 },
      ]),
    findOne: jest.fn().mockResolvedValue({
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
    remove: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Honda CBR',
      price: 50000,
      brand_id: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotorbikesController],
      providers: [
        { provide: MotorbikesService, useValue: mockMotorbikesService },
      ],
    }).compile();

    controller = module.get<MotorbikesController>(MotorbikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a motorbike', async () => {
      const dto = { name: 'Honda CBR', price: 50000, brand_id: 1 };
      const result = await controller.create(dto);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of motorbikes', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Honda CBR', price: 50000, brand_id: 1 },
      ]);
      expect(mockMotorbikesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single motorbike', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      });
      expect(mockMotorbikesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a motorbike', async () => {
      const dto = { name: 'Honda CBR Updated', price: 60000 };
      const result = await controller.update(1, dto);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR Updated',
        price: 60000,
        brand_id: 1,
      });
      expect(mockMotorbikesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete a motorbike', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({
        id: 1,
        name: 'Honda CBR',
        price: 50000,
        brand_id: 1,
      });
      expect(mockMotorbikesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
