# 개발 가이드

## 환경 설정

### 사전 요구 사항

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### 로컬 개발 환경 시작

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 3. PostgreSQL 실행 (Docker)
docker-compose up postgres -d

# 4. 데이터베이스 마이그레이션
pnpm --filter backend prisma migrate dev

# 5. 개발 서버 실행
pnpm dev
```

### Docker로 전체 실행

```bash
docker-compose up
```

---

## 커밋 규칙

### 커밋 단위

> **가장 작은 함수 단위로 커밋한다.**

하나의 기능을 구현할 때 여러 함수가 필요하더라도,  
**함수 하나 완성 → 커밋** 순서로 진행한다.

```
# 올바른 예시 (함수별 개별 커밋)
feat: add getProducts service function
feat: add getProductById service function
feat: add createProduct service function

# 잘못된 예시 (여러 함수를 한 번에 커밋)
feat: add product service functions
```

### 커밋 메시지 형식

```
<type>: <description>

type 종류:
- feat     새로운 기능
- fix      버그 수정
- refactor 리팩토링
- docs     문서 수정
- style    코드 포맷팅
- test     테스트 코드
- chore    빌드/설정 변경
```

---

## 프로젝트 스크립트

```bash
# 전체 개발 서버 실행
pnpm dev

# Frontend만 실행
pnpm --filter frontend dev

# Backend만 실행
pnpm --filter backend dev

# 빌드
pnpm build

# Prisma 마이그레이션 생성
pnpm --filter backend prisma migrate dev --name <migration-name>

# Prisma Studio (DB GUI)
pnpm --filter backend prisma studio
```

---

## 환경 변수

### Backend (`apps/backend/.env`)

```env
DATABASE_URL="postgresql://valubox:valubox@localhost:5432/valubox"
TOSS_SECRET_KEY="your_toss_secret_key"
PORT=8000
```

### Frontend (`apps/frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_TOSS_CLIENT_KEY="your_toss_client_key"
```

---

## 폴더 컨벤션

### Frontend

- `components/ui/` — shadcn/ui 기본 컴포넌트 (수정 금지)
- `components/shared/` — 프로젝트 공통 컴포넌트
- `pages/` — 라우트와 1:1 대응하는 페이지 컴포넌트
- `hooks/` — `use` 접두사, 단일 책임 원칙
- `api/` — 백엔드 API 호출 함수 (TanStack Query와 연동)

### Backend

- `routes/` — 라우트 핸들러, 비즈니스 로직 없이 서비스 호출만
- `services/` — 실제 비즈니스 로직, Prisma 쿼리
- `schemas/` — Zod 스키마, 요청/응답 타입 정의
