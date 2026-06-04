/**
 * UNIT TEST - UnitsService
 *
 * Goal: Test each method of UnitsService in isolation.
 *
 * Since this service has no database connection (methods only return strings),
 * there is NO NEED to mock any dependency. This is the simplest form of
 * unit test - a good starting point for beginners.
 *
 * Pattern used: AAA (Arrange -> Act -> Assert)
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnitsService } from './units.service';

describe('UnitsService', () => {
  let service: UnitsService;

  // beforeEach: runs before each test case
  // -> ensures each test starts with a fresh, clean service instance
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitsService],
    }).compile();

    service = module.get<UnitsService>(UnitsService);
  });

  // Basic test: ensure the service is instantiated successfully
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =========================================================
  // create() - POST /units
  // =========================================================
  describe('create()', () => {
    it('should return confirmation string', () => {
      // Arrange - create empty dto (CreateUnitDto has no fields yet)
      const dto = {};

      // Act - call the method
      const result = service.create(dto);

      // Assert - verify the result
      expect(result).toBe('This action adds a new unit');
    });

    // Verify the return type
    it('should return a string type', () => {
      const result = service.create({});
      expect(typeof result).toBe('string');
    });
  });

  // =========================================================
  // findAll() - GET /units
  // =========================================================
  describe('findAll()', () => {
    it('should return all units string', () => {
      const result = service.findAll();
      expect(result).toBe('This action returns all units');
    });

    it('should return a string type', () => {
      const result = service.findAll();
      expect(typeof result).toBe('string');
    });
  });

  // =========================================================
  // findOne() - GET /units/:id
  // =========================================================
  describe('findOne()', () => {
    it('should return string containing the id', () => {
      const result = service.findOne(1);
      expect(result).toBe('This action returns a #1 unit');
    });

    // Test with different ids to ensure the id is passed correctly
    it('should include the correct id in return string', () => {
      expect(service.findOne(5)).toContain('5');
      expect(service.findOne(99)).toContain('99');
    });

    it('should return different string for different ids', () => {
      const result1 = service.findOne(1);
      const result2 = service.findOne(2);
      // 2 different ids must return 2 different strings
      expect(result1).not.toBe(result2);
    });
  });

  // =========================================================
  // update() - PATCH /units/:id
  // =========================================================
  describe('update()', () => {
    it('should return update confirmation string', () => {
      const dto = {};
      const result = service.update(1, dto);
      expect(result).toBe('This action updates a #1 unit');
    });

    it('should include the correct id in return string', () => {
      const result = service.update(42, {});
      expect(result).toContain('42');
    });
  });

  // =========================================================
  // remove() - DELETE /units/:id
  // =========================================================
  describe('remove()', () => {
    it('should return removal confirmation string', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 unit');
    });

    it('should include the correct id in return string', () => {
      const result = service.remove(10);
      expect(result).toContain('10');
    });
  });
});
