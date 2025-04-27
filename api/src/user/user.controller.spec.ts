import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CurrentUserRequest } from '@common/decorators/current-user.decorator';
import { UserResponse } from './user.response';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    mockUserService = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get me', () => {
    it('should return the id and email of the current user', async () => {
      const resultUser: UserResponse = {
        id: 1,
        email: 'test@example.com',
      };
      const fakeCurrentUser: CurrentUserRequest = {
        id: 1,
        email: 'test@example.com',
      };

      mockUserService.findById.mockResolvedValue(resultUser);
      const result = await controller.getMe(fakeCurrentUser);

      expect(result).toEqual(resultUser);
      expect(mockUserService.findById).toHaveBeenCalledWith(fakeCurrentUser.id);
    });
  });

  describe('get all users', () => {
    it('should return the id and email of the current user', async () => {
      const resultUserList: UserResponse[] = [
        {
          id: 1,
          email: 'test@example.com',
        },
      ];

      mockUserService.findAll.mockResolvedValue(resultUserList);
      const result = await controller.findAll();
      expect(result).toEqual(resultUserList);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });
});
