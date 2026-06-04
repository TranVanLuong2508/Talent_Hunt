/**
 * UNIT TEST - UnitsController
 *
 * Goal: Test that the controller calls the correct service method,
 * passes the correct arguments, and returns the correct result.
 *
 * We MOCK UnitsService here to isolate the controller.
 * Controller is a "thin layer" - it only receives requests and calls service.
 * So tests focus on:
 *   1. Does it call the correct service method?
 *   2. Does it pass the correct arguments? (especially string -> number conversion)
 *   3. Does it return the correct result from the service?
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

describe('UnitsController', () => {
  let controller: UnitsController;

  // Mock UnitsService - create a fake object with jest.fn() methods
  // jest.fn() allows you to:
  //   - Set return values (mockReturnValue / mockResolvedValue)
  //   - Track call count (toHaveBeenCalledTimes)
  //   - Track arguments (toHaveBeenCalledWith)
  const mockUnitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitsController],
      providers: [
        // Replace the real UnitsService with the mock
        { provide: UnitsService, useValue: mockUnitsService },
      ],
    }).compile();

    controller = module.get<UnitsController>(UnitsController);

    // Reset mocks before each test -> ensure test isolation
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================================================
  // POST /units - create()
  // =========================================================
  describe('create()', () => {
    it('should call service.create and return result', () => {
      const dto = {};
      const expected = 'This action adds a new unit';
      mockUnitsService.create.mockReturnValue(expected);

      const result = controller.create(dto);

      expect(result).toBe(expected);
      // Verify service.create was called with the correct dto
      expect(mockUnitsService.create).toHaveBeenCalledWith(dto);
      expect(mockUnitsService.create).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================
  // GET /units - findAll()
  // =========================================================
  describe('findAll()', () => {
    it('should call service.findAll and return result', () => {
      const expected = 'This action returns all units';
      mockUnitsService.findAll.mockReturnValue(expected);

      const result = controller.findAll();

      expect(result).toBe(expected);
      expect(mockUnitsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================
  // GET /units/:id - findOne()
  // =========================================================
  describe('findOne()', () => {
    it('should call service.findOne and return result', () => {
      const expected = 'This action returns a #1 unit';
      mockUnitsService.findOne.mockReturnValue(expected);

      // Controller receives param from URL as STRING '1'
      const result = controller.findOne('1');

      expect(result).toBe(expected);
      // Controller converts string '1' -> number 1 before calling service
      expect(mockUnitsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should convert string id to number before calling service', () => {
      mockUnitsService.findOne.mockReturnValue('');

      controller.findOne('42');

      // Must be number 42, not string '42'
      expect(mockUnitsService.findOne).toHaveBeenCalledWith(42);
      expect(mockUnitsService.findOne).not.toHaveBeenCalledWith('42');
    });
  });

  // =========================================================
  // PATCH /units/:id - update()
  // =========================================================
  describe('update()', () => {
    it('should call service.update with id and dto', () => {
      const dto = {};
      const expected = 'This action updates a #1 unit';
      mockUnitsService.update.mockReturnValue(expected);

      const result = controller.update('1', dto);

      expect(result).toBe(expected);
      // Verify both arguments: id (already converted) and dto
      expect(mockUnitsService.update).toHaveBeenCalledWith(1, dto);
      expect(mockUnitsService.update).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', () => {
      mockUnitsService.update.mockReturnValue('');

      controller.update('99', {});

      expect(mockUnitsService.update).toHaveBeenCalledWith(99, {});
    });
  });

  // =========================================================
  // DELETE /units/:id - remove()
  // =========================================================
  describe('remove()', () => {
    it('should call service.remove and return result', () => {
      const expected = 'This action removes a #1 unit';
      mockUnitsService.remove.mockReturnValue(expected);

      const result = controller.remove('1');

      expect(result).toBe(expected);
      expect(mockUnitsService.remove).toHaveBeenCalledWith(1);
      expect(mockUnitsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', () => {
      mockUnitsService.remove.mockReturnValue('');

      controller.remove('50');

      expect(mockUnitsService.remove).toHaveBeenCalledWith(50);
      expect(mockUnitsService.remove).not.toHaveBeenCalledWith('50');
    });
  });
});
