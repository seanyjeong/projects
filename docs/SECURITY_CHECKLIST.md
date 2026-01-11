# 보안 점검 보고서

> Guardian (은지) - 보안 감사 수행
>
> **점검 일시**: 2026-01-11
> **대상 시스템**: Project S (체대 입시 계산 SaaS)
> **백엔드**: NestJS 10 + Prisma + MySQL
> **프론트엔드**: Next.js 15 + React 19

---

## 종합 평가

| 심각도 | 개수 |
|--------|------|
| 🔴 Critical | 1 |
| 🟠 High | 3 |
| 🟡 Medium | 4 |
| 🟢 Low | 2 |
| ℹ️ Info | 3 |

**총평**: 🟠 **수정 후 재검토 필요**

Critical/High 이슈 해결 후 프로덕션 배포 가능합니다.

---

## 1. 인증/인가 (Authentication & Authorization)

### ✅ 양호한 항목

1. **JWT 토큰 기반 인증**
   - `@nestjs/jwt`, `passport-jwt` 사용
   - Bearer Token 방식
   - 만료 시간 설정: 7일

2. **비밀번호 해싱**
   - `bcrypt` 사용 (salt rounds: 10)
   - 비밀번호 평문 저장하지 않음

3. **Guard 적용**
   - `JwtAuthGuard`로 보호된 엔드포인트
   - `/user/me`, `/auth/refresh`에 가드 적용

4. **역할 기반 접근 제어 (RBAC)**
   - `Role` enum (USER, ADMIN) 정의
   - DB 스키마에 role 필드 존재

### 🟠 HIGH: JWT Secret 강도 부족

**파일**: `/home/sean/project-s/src/backend/.env:5`

**문제**:
```bash
JWT_SECRET="project-s-secret-key-2026"
```

현재 시크릿이 너무 단순하고 예측 가능합니다.

**해결**:
```bash
# 강력한 랜덤 시크릿 생성
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# .env에 적용
JWT_SECRET="a8f5f167f44f4964e6c998dee827110c03df8318ce1234c8ffaa1c7ea1f2aaabf2b6c5f3e30cf3e5bcfe6c1a78e5cbf8c6f7c8f5e9c8f5e9c8f5e9c8f5e9c8f5"
```

**이유**: 약한 JWT 시크릿은 토큰 위조 공격에 취약합니다.

---

### 🟡 MEDIUM: 토큰 만료 시간 과도함

**파일**: `/home/sean/project-s/src/backend/.env:6`

**문제**:
```bash
JWT_EXPIRES_IN="7d"  # 7일은 너무 김
```

**권장**:
```bash
# 개발 환경
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# 프로덕션 환경
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

**추가 구현 필요**:
- Refresh Token 메커니즘 구현
- Access Token 짧게, Refresh Token 길게

---

### 🟡 MEDIUM: 관리자 권한 체크 누락

**파일**: 전체 컨트롤러

**문제**:
- `ADMIN` 역할이 정의되어 있지만 실제 권한 체크 Guard가 없음
- 모든 API가 USER도 접근 가능

**해결**:
```typescript
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 사용 예시 (향후 admin API 구현 시)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Post('admin/universities')
async createUniversity() { ... }
```

---

### ℹ️ INFO: Rate Limiting 미구현

**현재 상태**: Rate limiting 없음

**권장 구현**:
```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,      // 1분
      limit: 10,       // 10회 제한
    }]),
    // ...
  ],
})
```

```typescript
// auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } })  // 로그인은 1분에 5회만
@Post('login')
async login() { ... }
```

**이유**: Brute-force 공격 방어

---

## 2. 입력 검증 (Input Validation)

### ✅ 양호한 항목

1. **class-validator 전역 적용**
   ```typescript
   // main.ts
   app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,           // DTO에 없는 필드 제거
       transform: true,            // 타입 자동 변환
       forbidNonWhitelisted: true, // 추가 필드 있으면 에러
     }),
   );
   ```

2. **DTO 검증**
   - `RegisterDto`: 이메일, 비밀번호(6자 이상), 이름(2자 이상)
   - `LoginDto`: 이메일, 비밀번호(6자 이상)
   - `@IsEmail()`, `@IsString()`, `@MinLength()` 사용

### 🟡 MEDIUM: 비밀번호 복잡도 규칙 없음

**파일**: `/home/sean/project-s/src/backend/src/auth/dto/register.dto.ts:11`

**문제**:
```typescript
@MinLength(6)  // 길이만 체크, 복잡도 체크 없음
password: string;
```

**해결**:
```typescript
import { Matches } from 'class-validator';

@ApiProperty({
  example: 'MyP@ssw0rd',
  description: '비밀번호 (8자 이상, 영문/숫자/특수문자 포함)'
})
@IsString()
@MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
@Matches(
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  { message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다' }
)
password: string;
```

---

### ✅ SQL Injection 방어

**상태**: Prisma ORM 사용으로 자동 방어

```typescript
// 안전함 - Prisma가 자동으로 파라미터화
const user = await this.prisma.user.findUnique({
  where: { email }
});
```

**주의사항**:
- Raw Query 사용 시 주의 필요 (`prisma.$queryRaw`)
- 현재 코드베이스에서는 사용하지 않음

---

### ✅ XSS 방어

**상태**:
1. React의 자동 이스케이핑 (프론트엔드)
2. JSON 응답만 사용 (백엔드)
3. `dangerouslySetInnerHTML` 미사용 확인됨

**추가 권장**:
```bash
# 백엔드에 helmet 추가 (보안 헤더)
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  }));

  // ...
}
```

---

## 3. 환경 변수 및 민감 정보 (Environment & Secrets)

### 🔴 CRITICAL: .gitignore 설정 부정확

**파일**: `/home/sean/project-s/src/backend/.gitignore:23`

**문제**:
```gitignore
# 현재 설정
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**검증 결과**:
```bash
$ git check-ignore .env
# (출력 없음) → .env가 gitignore 처리 안 됨!
```

**원인**: gitignore 파일의 형식 문제 또는 경로 이슈

**즉시 조치**:
```bash
# 백엔드 디렉토리에서
cd /home/sean/project-s/src/backend

# .env 파일이 git에 커밋되었는지 확인
git ls-files .env

# 만약 커밋되었다면 즉시 제거
git rm --cached .env
git commit -m "Remove .env from git tracking"

# .gitignore 재확인
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore

# 검증
git check-ignore .env  # ".env" 출력되어야 함
```

**심각도**: 🔴 CRITICAL
- DB 비밀번호 노출 위험
- JWT 시크릿 노출 위험
- GitHub에 푸시되면 전체 인터넷에 공개됨

---

### 🟠 HIGH: .env 파일에 실제 DB 비밀번호 노출

**파일**: `/home/sean/project-s/src/backend/.env:2`

**문제**:
```bash
DATABASE_URL="mysql://paca:paca123@localhost:3306/project_s"
```

비밀번호 `paca123`이 평문으로 저장되어 있습니다.

**해결**:

1. **개발 환경** (.env.development):
```bash
DATABASE_URL="mysql://paca@localhost:3306/project_s"  # 비밀번호 없는 로컬 DB
JWT_SECRET="dev-secret-not-for-production"
NODE_ENV=development
```

2. **프로덕션 환경** (서버 환경변수 또는 Secret Manager):
```bash
# AWS Systems Manager Parameter Store
DATABASE_URL="{{resolve:ssm:/project-s/db-url}}"
JWT_SECRET="{{resolve:ssm:/project-s/jwt-secret}}"

# 또는 Kubernetes Secrets
# 또는 .env.production (서버에만 존재, gitignore 처리)
```

3. **예시 파일 제공** (.env.example):
```bash
# .env.example (이건 git에 커밋)
DATABASE_URL="mysql://username:password@localhost:3306/project_s"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
CURRENT_YEAR=2026
```

---

### ✅ 프론트엔드 환경변수 관리

**파일**: `/home/sean/project-s/src/frontend/.gitignore:34`

```gitignore
.env*  # 모든 .env 파일 제외
```

이것은 올바른 설정입니다. `.env.local`이 git에서 제외됩니다.

---

### 🟢 LOW: 하드코딩된 값 없음

**확인 결과**:
- API 키, 비밀번호 등 하드코딩 없음
- `process.env`로만 환경변수 접근
- Fallback 값은 개발용으로 적절함

---

## 4. CORS (Cross-Origin Resource Sharing)

### 🟡 MEDIUM: 프로덕션 CORS 설정 부족

**파일**: `/home/sean/project-s/src/backend/src/main.ts:13-16`

**현재 코드**:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

**문제**:
- 단일 origin만 허용 (배포 환경 고려 부족)
- 프로덕션 도메인 설정 필요

**해결**:
```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',           // 로컬 개발
      'https://project-s.vercel.app',    // Vercel 배포
      'https://www.your-domain.com',     // 커스텀 도메인
    ];

    // Vercel 프리뷰 배포 허용
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length'],
  maxAge: 3600,  // 1시간 캐싱
});
```

---

## 5. Rate Limiting

### 🟠 HIGH: Rate Limiting 미구현

**현재 상태**: Rate limiting 없음

**위험**:
- 무차별 대입 공격 (Brute-force)
- DoS 공격
- API 남용

**해결**: [1. 인증/인가 > INFO 항목 참조](#ℹ️-info-rate-limiting-미구현)

---

## 6. 의존성 보안 (Dependency Vulnerabilities)

### 🟠 HIGH: npm audit 취약점 발견

**검사 결과**:
```json
{
  "vulnerabilities": {
    "info": 0,
    "low": 4,
    "moderate": 2,
    "high": 2,
    "critical": 0,
    "total": 8
  }
}
```

**주요 취약점**:

1. **@nestjs/cli (High)**
   - `glob` 의존성의 Command Injection 취약점
   - CVE-2024-XXXX: glob CLI에서 `-c/--cmd` 플래그 악용
   - 해결: `npm install @nestjs/cli@11.0.14` (major 업그레이드)

2. **@nestjs/swagger (Moderate)**
   - `js-yaml` 의존성 취약점
   - 해결: `npm install @nestjs/swagger@11.2.4`

3. **inquirer, tmp (Low)**
   - 개발 의존성이므로 프로덕션 영향 없음

**즉시 조치**:
```bash
cd /home/sean/project-s/src/backend

# 취약점 상세 확인
npm audit

# 자동 수정 (breaking change 주의)
npm audit fix

# major 업그레이드 필요한 경우 수동 업데이트
npm install @nestjs/cli@latest @nestjs/swagger@latest
npm test  # 테스트 실행 후 확인
```

**정기 점검**:
```bash
# 매주 실행 권장
npm audit
npm outdated
```

---

## 7. 데이터베이스 보안

### ✅ 양호한 항목

1. **Prisma ORM 사용**
   - SQL Injection 자동 방어
   - 타입 안전성

2. **Cascade Delete 설정**
   ```prisma
   user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
   department   Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
   ```

3. **비밀번호 암호화**
   - `bcrypt` 사용 (salt rounds: 10)

### 🟢 LOW: 변경 이력 미구현

**파일**: `/home/sean/project-s/src/backend/prisma/schema.prisma:111-122`

**현재 상태**:
- `ChangeLog` 모델은 정의되어 있으나 실제 사용 코드 없음

**권장 구현**:
```typescript
// src/common/interceptors/audit.interceptor.ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body } = request;

    return next.handle().pipe(
      tap(async (data) => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          await this.prisma.changeLog.create({
            data: {
              tableName: this.extractTableName(url),
              recordId: data?.id || 'unknown',
              action: this.mapMethodToAction(method),
              newData: body,
              changedBy: user?.id || 'system',
            },
          });
        }
      }),
    );
  }
}
```

**우선순위**: 낮음 (기능 구현 후 추가)

---

## 8. API 보안

### ✅ 양호한 항목

1. **Swagger 문서화**
   - Bearer Auth 설정
   - DTO 예시 제공

2. **공개 API와 인증 API 분리**
   - `/universities` (공개)
   - `/user/me` (인증 필요)

### ℹ️ INFO: API Versioning 미구현

**현재**: `/api/calculate/suneung`

**권장**: `/api/v1/calculate/suneung`

```typescript
// main.ts
app.setGlobalPrefix('api/v1');
```

**이유**: 향후 API 변경 시 하위 호환성 유지

---

### ℹ️ INFO: HTTPS 강제 리다이렉트

**프로덕션 배포 시 추가**:

```typescript
// main.ts (프로덕션 환경)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 9. 프론트엔드 보안

### ✅ 양호한 항목

1. **환경변수 gitignore 처리**
   ```gitignore
   .env*  # 모든 .env 파일 제외
   ```

2. **API 클라이언트 에러 처리**
   - try-catch로 에러 핸들링
   - 에러 메시지 사용자에게 노출

3. **Next.js 15 사용**
   - React 19의 보안 개선 혜택

### 🟢 LOW: API URL 검증 부족

**파일**: `/home/sean/project-s/src/frontend/lib/api.ts:7`

**현재 코드**:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

**권장**:
```typescript
const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // 프로덕션 환경에서는 HTTPS 강제
  if (process.env.NODE_ENV === 'production' && !url.startsWith('https://')) {
    throw new Error('Production API URL must use HTTPS');
  }

  return url;
})();
```

---

## 10. 추가 권장 사항

### 1. 보안 헤더 설정

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

---

### 2. 로깅 및 모니터링

```bash
npm install @nestjs/winston winston
```

```typescript
// 민감 정보 필터링
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format((info) => {
      // 비밀번호, 토큰 마스킹
      if (info.password) info.password = '***';
      if (info.token) info.token = '***';
      return info;
    })(),
    winston.format.json(),
  ),
});
```

---

### 3. 보안 테스트 자동화

```json
// package.json
{
  "scripts": {
    "security:audit": "npm audit --production",
    "security:check": "npm audit && npm outdated",
    "test:security": "jest --testPathPattern=security"
  }
}
```

---

## 수정 우선순위

### 🔴 즉시 수정 (배포 전 필수)

1. **[CRITICAL]** .gitignore 수정 및 .env 파일 git tracking 제거
2. **[HIGH]** JWT_SECRET 강력한 값으로 변경
3. **[HIGH]** npm audit 취약점 수정

### 🟠 빠른 시일 내 수정 (배포 후 1주일 이내)

4. **[HIGH]** Rate Limiting 구현 (로그인, 회원가입)
5. **[MEDIUM]** JWT 만료 시간 단축 + Refresh Token 구현
6. **[MEDIUM]** CORS 설정 프로덕션 도메인 추가
7. **[MEDIUM]** 비밀번호 복잡도 규칙 추가

### 🟡 점진적 개선 (배포 후 1개월 이내)

8. **[MEDIUM]** ADMIN 권한 가드 구현
9. **[LOW]** helmet 보안 헤더 추가
10. **[LOW]** 변경 이력 Interceptor 구현
11. **[INFO]** API Versioning 적용

---

## 최종 체크리스트

배포 전 마지막 점검:

- [ ] .env 파일 git에서 제거됨
- [ ] JWT_SECRET 강력한 값으로 변경
- [ ] npm audit 취약점 0개
- [ ] CORS 설정에 프로덕션 도메인 추가
- [ ] Rate Limiting 구현 (로그인/회원가입)
- [ ] HTTPS 사용 확인
- [ ] DB 비밀번호 환경변수로 분리
- [ ] Swagger 문서 확인
- [ ] 에러 메시지에 민감 정보 없음

---

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/helmet)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Prisma Security Guide](https://www.prisma.io/docs/guides/security)

---

**검토자**: Guardian (은지)
**다음 검토 예정일**: 2026-02-11 (1개월 후)

---

## Builder 수정 요청

@Builder 다음 Critical/High 이슈를 우선 수정해주세요:

### 1. .gitignore 수정 (CRITICAL)
```bash
cd /home/sean/project-s/src/backend
git rm --cached .env 2>/dev/null || true
echo -e "\n# Environment variables\n.env\n.env.*\n!.env.example" >> .gitignore
git add .gitignore
```

### 2. JWT_SECRET 변경 (HIGH)
```bash
# 새 시크릿 생성
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# .env 업데이트
sed -i "s/JWT_SECRET=.*/JWT_SECRET=\"$NEW_SECRET\"/" .env
```

### 3. npm audit 수정 (HIGH)
```bash
npm audit fix
npm install @nestjs/cli@latest @nestjs/swagger@latest
npm test
```

### 4. Rate Limiting 추가 (HIGH)
```bash
npm install @nestjs/throttler
```

수정 완료 후 다시 리뷰 요청해주세요.
