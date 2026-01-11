import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // Mock PrismaService
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  // Mock JwtService
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('올바른 이메일과 비밀번호로 사용자를 검증해야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: '테스트',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBeUndefined(); // 비밀번호는 제거되어야 함
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('존재하지 않는 이메일로 검증하면 UnauthorizedException을 발생시켜야 함', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validateUser('nonexistent@example.com', 'password123'),
      ).rejects.toThrow('이메일 또는 비밀번호가 일치하지 않습니다');
    });

    it('잘못된 비밀번호로 검증하면 UnauthorizedException을 발생시켜야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: '테스트',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow('이메일 또는 비밀번호가 일치하지 않습니다');
    });

    it('반환된 사용자 정보에 비밀번호가 포함되지 않아야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: '테스트',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result.password).toBeUndefined();
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('사용자 정보로 JWT 토큰을 생성해야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        name: '테스트',
        role: 'USER',
      };

      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toBeDefined();
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('반환된 사용자 정보에 필수 필드가 포함되어야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        name: '테스트',
        role: 'USER',
      };

      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.login(mockUser);

      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('name');
      expect(result.user).toHaveProperty('role');
    });
  });

  describe('register', () => {
    it('새로운 사용자를 등록하고 JWT 토큰을 반환해야 함', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: '신규사용자',
      };

      const mockCreatedUser = {
        id: 'user-002',
        email: 'newuser@example.com',
        password: await bcrypt.hash('password123', 10),
        name: '신규사용자',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null); // 기존 사용자 없음
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user.email).toBe('newuser@example.com');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'newuser@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('비밀번호를 해싱하여 저장해야 함', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: '신규사용자',
      };

      const mockCreatedUser = {
        id: 'user-002',
        email: 'newuser@example.com',
        password: 'hashed_password',
        name: '신규사용자',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      await service.register(registerDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      const savedPassword = createCall.data.password;

      // 해싱된 비밀번호가 원본과 다른지 확인
      expect(savedPassword).not.toBe('password123');
      // 해싱된 비밀번호가 bcrypt 형식인지 확인 ($2b$ 또는 $2a$로 시작)
      expect(savedPassword).toMatch(/^\$2[ab]\$/);
    });

    it('이미 존재하는 이메일로 등록하면 UnauthorizedException을 발생시켜야 함', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: '기존사용자',
      };

      const mockExistingUser = {
        id: 'user-001',
        email: 'existing@example.com',
        password: 'hashed_password',
        name: '기존사용자',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockExistingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        '이미 존재하는 이메일입니다',
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('새 사용자의 역할은 USER여야 함', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: '신규사용자',
      };

      const mockCreatedUser = {
        id: 'user-002',
        email: 'newuser@example.com',
        password: 'hashed_password',
        name: '신규사용자',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      await service.register(registerDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.role).toBe('USER');
    });

    it('등록 후 반환된 사용자 정보에 비밀번호가 포함되지 않아야 함', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: '신규사용자',
      };

      const mockCreatedUser = {
        id: 'user-002',
        email: 'newuser@example.com',
        password: 'hashed_password',
        name: '신규사용자',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.register(registerDto);

      expect(result.user).toBeDefined();
      expect(Object.keys(result.user)).not.toContain('password');
    });
  });

  describe('refresh', () => {
    it('기존 사용자로 새 JWT 토큰을 생성해야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        name: '테스트',
        role: 'USER',
      };

      const mockToken = 'new.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.refresh(mockUser);

      expect(result).toBeDefined();
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('Security', () => {
    it('비밀번호 해싱이 10 라운드로 수행되어야 함', async () => {
      const registerDto = {
        email: 'security@example.com',
        password: 'password123',
        name: '보안테스트',
      };

      const mockCreatedUser = {
        id: 'user-003',
        email: 'security@example.com',
        password: 'hashed_password',
        name: '보안테스트',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      // bcrypt.hash를 spy로 감시
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');

      await service.register(registerDto);

      // bcrypt.hash가 10 라운드로 호출되었는지 확인
      expect(bcryptHashSpy).toHaveBeenCalledWith('password123', 10);

      bcryptHashSpy.mockRestore();
    });

    it('JWT 페이로드에 민감한 정보(비밀번호)가 포함되지 않아야 함', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'test@example.com',
        name: '테스트',
        role: 'USER',
      };

      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      await service.login(mockUser);

      const jwtPayload = mockJwtService.sign.mock.calls[0][0];
      expect(jwtPayload).not.toHaveProperty('password');
      expect(jwtPayload).toHaveProperty('sub');
      expect(jwtPayload).toHaveProperty('email');
      expect(jwtPayload).toHaveProperty('role');
    });
  });
});
