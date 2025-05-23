import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  RegistrationUserCommand,
  RegistrationUserUseCase,
} from '../application/use-cases/registration.user.use-case';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UserEntity } from '../domain/entities/user.entity';

describe('RegistrationUserUseCase', () => {
  let registrationUserUseCase: RegistrationUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            getUserByField: jest.fn(), // создание заглушки
            saveUser: jest.fn(), // создание заглушки
          },
        },
      ],
    }).compile();

    registrationUserUseCase = module.get<RegistrationUserUseCase>(
      RegistrationUserUseCase,
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should not registrate user and throw BadRequestException if password and password confirmation do not match', async () => {
    const command = new RegistrationUserCommand({
      userName: 'Soprano',
      email: 'soprano@gmail.com',
      password: 'Soprano777',
      passwordConfirmation: 'Soprano789',
    });

    await expect(registrationUserUseCase.execute(command)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not registrate an article and throw BadRequestException if email is exist', async () => {
    const email = 'soprano@gmail.com';

    const command = new RegistrationUserCommand({
      userName: 'Soprano',
      email,
      password: 'Soprano777',
      passwordConfirmation: 'Soprano777',
    });

    const searchUserByEmailResult: UserEntity | null = {
      id: 1,
      userName: 'Antony',
      email,
      passwordHash: 'passwordHash',
    } as unknown as UserEntity;
    jest
      .spyOn(userRepository, 'getUserByField')
      .mockResolvedValue(searchUserByEmailResult);

    await expect(registrationUserUseCase.execute(command)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not registrate an article and throw BadRequestException if user name is exist', async () => {
    const userName = 'Soprano';

    const command = new RegistrationUserCommand({
      userName,
      email: 'soprano@gmail.com',
      password: 'Soprano777',
      passwordConfirmation: 'Soprano777',
    });

    const searchUserByUserNameResult: UserEntity | null = {
      id: 1,
      userName,
      email: 'antony@gmail.com',
      passwordHash: 'passwordHash',
    } as unknown as UserEntity;
    jest
      .spyOn(userRepository, 'getUserByField')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(searchUserByUserNameResult);

    await expect(registrationUserUseCase.execute(command)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should registrate user', async () => {
    const userName = 'Soprano';
    const email = 'soprano@gmail.com';

    const command = new RegistrationUserCommand({
      userName,
      email,
      password: 'Soprano777',
      passwordConfirmation: 'Soprano777',
    });

    jest
      .spyOn(userRepository, 'getUserByField')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const savingUserResult = { id: '1' };
    jest.spyOn(userRepository, 'saveUser').mockResolvedValue(savingUserResult);

    const result = await registrationUserUseCase.execute(command);

    expect(userRepository.saveUser).toHaveBeenCalledWith(
      expect.objectContaining({
        userName,
        email,
        passwordHash: expect.any(String),
      }),
    );

    expect(result).toEqual(savingUserResult);
  });
});
