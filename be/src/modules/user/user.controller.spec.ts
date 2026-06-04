/**
 * UNIT TEST - UserController
 *
 * Muc tieu: Test controller goi dung service method,
 * truyen dung tham so, va tra ve dung ket qua.
 *
 * Su khac biet voi test Service:
 * - Test Service: mock database (PrismaService) -> test logic xu ly
 * - Test Controller: mock service (UserService) -> test lop dieu huong request
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;

  // Mock UserService - controller phu thuoc service nen ta mock no
  const mockUserService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================================================
  // GET /user - findAll()
  // =========================================================
  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, name: 'An', email: 'an@gmail.com' },
        { id: 2, name: 'Binh', email: 'binh@gmail.com' },
      ];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users', async () => {
      mockUserService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  // =========================================================
  // GET /user/:id - findById()
  // =========================================================
  describe('findById()', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'An', email: 'an@gmail.com' };
      mockUserService.findById.mockResolvedValue(user);

      // Controller nhan param la STRING '1' tu URL
      const result = await controller.findById('1');

      expect(result).toEqual(user);
      // Kiem tra: controller da convert string -> number truoc khi goi service
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });

    it('should convert string param to number', async () => {
      mockUserService.findById.mockResolvedValue({ id: 42 });

      await controller.findById('42');

      // Service phai nhan NUMBER 42, khong phai STRING '42'
      expect(mockUserService.findById).toHaveBeenCalledWith(42);
      expect(mockUserService.findById).not.toHaveBeenCalledWith('42');
    });

    it('should propagate NotFoundException from service', async () => {
      // Khi service throw error, controller khong catch
      // -> error "bubble up" len, NestJS xu ly tra ve 404
      mockUserService.findById.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  // =========================================================
  // POST /user - create()
  // =========================================================
  describe('create()', () => {
    it('should create and return a new user', async () => {
      const dto = { name: 'Cuong', email: 'cuong@gmail.com' };
      const createdUser = { id: 1, ...dto, createdAt: new Date() };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(result).toEqual(createdUser);
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Cuong');
    });

    it('should pass the dto to service correctly', async () => {
      const dto = { name: 'Test', email: 'test@gmail.com' };
      mockUserService.create.mockResolvedValue({ id: 1, ...dto });

      await controller.create(dto);

      // Kiem tra service.create nhan dung dto ma controller truyen vao
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate error when service fails', async () => {
      const dto = { name: 'Dup', email: 'exists@gmail.com' };
      mockUserService.create.mockRejectedValue(new Error('Email already exists'));

      await expect(controller.create(dto)).rejects.toThrow('Email already exists');
    });
  });
});
