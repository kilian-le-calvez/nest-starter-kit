import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock the dependencies
const mockJwtService = {
  sign: jest.fn().mockReturnValue('jwt_token'),
};

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user and return a success message', async () => {
      const registerDto = { email: 'test@example.com', password: 'password' };
      const mockCreate = jest.fn().mockResolvedValue({
        email: registerDto.email,
      });
      mockPrismaService.user.create = mockCreate;

      const result = await service.register(registerDto);

      expect(result).toBe('test@example.com');
      expect(mockCreate).toHaveBeenCalledWith({
        data: { email: registerDto.email, password: expect.any(String) },
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      mockPrismaService.user.findUnique = jest.fn().mockResolvedValue({
        email: loginDto.email,
        password: 'hashedpassword',
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a JWT token on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'correctpassword',
      };
      const mockFindUnique = jest.fn().mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash('correctpassword', 10),
      });
      mockPrismaService.user.findUnique = mockFindUnique;

      const result = await service.login(loginDto);

      expect(result).toBe('jwt_token');
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: expect.any(Number),
        email: loginDto.email,
      });
    });
  });
});
