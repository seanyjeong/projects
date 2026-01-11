# Project S 배포 가이드

## 개요

| 구성 요소 | 배포 위치 | 방법 |
|----------|----------|------|
| Frontend | Vercel | git push → 자동 배포 |
| Backend | 우리 서버 | Caddy + systemd |
| Database | 우리 서버 | MySQL (기존) |

---

## 1. Backend 배포 (Caddy + systemd)

### 1.1 빌드
```bash
cd /home/sean/project-s/src/backend
npm install --production
npm run build
```

### 1.2 systemd 서비스 등록
```bash
# 서비스 파일 복사
sudo cp project-s.service /etc/systemd/system/

# 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable project-s
sudo systemctl start project-s

# 상태 확인
sudo systemctl status project-s
```

### 1.3 Caddy 설정
```bash
# Caddyfile에 추가 (예: /etc/caddy/Caddyfile)
api.projects.chejump.com {
    reverse_proxy localhost:3001
}

# Caddy 재시작
sudo systemctl reload caddy
```

### 1.4 환경변수 (.env)
```bash
DATABASE_URL="mysql://paca:paca123@localhost:3306/project_s"
JWT_SECRET="[프로덕션용 시크릿]"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://projects.vercel.app"
CURRENT_YEAR=2026
```

---

## 2. Frontend 배포 (Vercel)

### 2.1 Vercel 연결
1. https://vercel.com 에서 프로젝트 import
2. GitHub repo: `seanyjeong/projects`
3. Root Directory: `src/frontend`
4. Framework: Next.js (자동 감지)

### 2.2 환경변수 설정
```
NEXT_PUBLIC_API_URL=https://api.projects.chejump.com
```

### 2.3 배포
```bash
git push  # 자동 배포
```

---

## 3. 빠른 명령어

### Backend
```bash
# 재시작
sudo systemctl restart project-s

# 로그 확인
sudo journalctl -u project-s -f

# 상태 확인
sudo systemctl status project-s
```

### Frontend
```bash
# 수동 배포 (필요시)
cd src/frontend
npx vercel --prod
```

---

## 4. 도메인 설정 (TODO)

| 용도 | 도메인 | 설정 |
|------|--------|------|
| Frontend | projects.chejump.com | Vercel CNAME |
| Backend API | api.projects.chejump.com | 서버 IP A 레코드 |

---

## 5. 모니터링

- Frontend: Vercel 대시보드
- Backend: `journalctl -u project-s -f`
- DB: `mysql -u paca project_s`

---

**Last Updated**: 2026-01-11
