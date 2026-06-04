/**
 * UNIT TEST - UserService
 *
 * Muc tieu: Test logic cua UserService mot cach doc lap,
 * khong phu thuoc vao database that.
 *
 * Cach tiep can:
 * - Mock PrismaService (gia lap database)
 * - Moi test case theo pattern AAA: Arrange -> Act -> Assert
 * - Test ca truong hop thanh cong va that bai
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  // Tao mock cho PrismaService - thay the database that bang object gia
  // jest.fn() tao ra 1 ham gia, co the theo doi so lan goi va tham so truyen vao
  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  // beforeEach chay truoc MOI test case -> dam bao moi test doc lap
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<UserService>(UserService);

    // Reset tat ca mock ve trang thai ban dau truoc moi test
    jest.clearAllMocks();
  });

  // --- Test co ban: service duoc khoi tao thanh cong ---
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =========================================================
  // findAll() - Lay danh sach tat ca users
  // =========================================================
  describe('findAll()', () => {
    it('should return an array of users', async () => {
      // Arrange - chuan bi du lieu gia
      const users = [
        { id: 1, name: 'An', email: 'an@gmail.com', createdAt: new Date() },
        { id: 2, name: 'Binh', email: 'binh@gmail.com', createdAt: new Date() },
      ];
      mockPrisma.user.findMany.mockResolvedValue(users);

      // Act - goi method can test
      const result = await service.findAll();

      // Assert - kiem tra ket qua
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  // =========================================================
  // findById() - Tim user theo ID
  // =========================================================
  describe('findById()', () => {
    it('should return a user when found', async () => {
      const user = { id: 1, name: 'An', email: 'an@gmail.com', createdAt: new Date() };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findById(1);

      expect(result).toEqual(user);
      // Kiem tra findUnique duoc goi voi dung tham so
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // findUnique tra ve null -> user khong ton tai
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Voi ham async throw error, dung rejects.toThrow()
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw error with message "User not found"', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Kiem tra ca noi dung message loi
      await expect(service.findById(1)).rejects.toThrow('User not found');
    });
  });

  // =========================================================
  // create() - Tao user moi
  // =========================================================
  describe('create()', () => {
    it('should create and return a new user', async () => {
      const dto = { name: 'Cuong', email: 'cuong@gmail.com' };
      const createdUser = { id: 1, ...dto, createdAt: new Date() };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(result).toEqual(createdUser);
      expect(result.id).toBeDefined();
      // Kiem tra prisma.create nhan dung format { data: dto }
      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate error when database fails', async () => {
      const dto = { name: 'Dup', email: 'exists@gmail.com' };
      // Gia lap loi tu database (vi du: email bi trung)
      mockPrisma.user.create.mockRejectedValue(
        new Error('Unique constraint failed on the fields: (`email`)'),
      );

      await expect(service.create(dto)).rejects.toThrow();
    });
  });

  // =========================================================
  // findOne() - Tra ve string mo ta (chua ket noi DB)
  // =========================================================
  describe('findOne()', () => {
    it('should return correct string with user id', () => {
      // Day la ham sync -> khong can await
      const result = service.findOne(5);
      expect(result).toBe('This action returns a #5 user');
    });
  });

  // =========================================================
  // update() - Cap nhat user (chua ket noi DB)
  // =========================================================
  describe('update()', () => {
    it('should return the update dto', () => {
      const updateDto = { name: 'Updated' };
      const result = service.update(1, updateDto);
      expect(result).toEqual(updateDto);
    });

    it('should handle empty dto', () => {
      const result = service.update(1, {});
      expect(result).toEqual({});
    });
  });

  // =========================================================
  // remove() - Xoa user (chua ket noi DB)
  // =========================================================
  describe('remove()', () => {
    it('should return correct removal string', () => {
      const result = service.remove(3);
      expect(result).toBe('This action removes a #3 user');
    });
  });
});
