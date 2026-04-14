# 기술 스택

## Frontend

| 기술 | 버전 | 역할 |
|------|------|------|
| React | 최신 | UI 컴포넌트 라이브러리 |
| TypeScript | 최신 | 타입 안정성 |
| Vite | 최신 | 빌드 도구 / 개발 서버 |
| Tailwind CSS | 최신 | 유틸리티 기반 CSS 프레임워크 |
| shadcn/ui | 최신 | 재사용 가능한 UI 컴포넌트 |
| React Router | 최신 | 클라이언트 사이드 라우팅 |
| TanStack Query | 최신 | 서버 상태 관리 / API 캐싱 |

### 선택 이유

- **Vite**: Create React App 대비 개발 서버 속도 10배 이상 빠름
- **Tailwind CSS**: 인라인 스타일 방식으로 별도 CSS 파일 관리 불필요
- **shadcn/ui**: 복사-붙여넣기 방식으로 커스터마이징 완전 자유, 번들 사이즈 최소화
- **TanStack Query**: 서버 상태와 클라이언트 상태를 명확히 분리, 캐싱/리페치 자동화

---

## Backend

| 기술 | 버전 | 역할 |
|------|------|------|
| Fastify | 최신 | 웹 프레임워크 |
| TypeScript | 최신 | 타입 안정성 |
| Prisma | 최신 | ORM (Object-Relational Mapping) |
| Zod | 최신 | 런타임 스키마 검증 |

### 선택 이유

- **Fastify**: Express 대비 약 2~3배 빠른 성능, TypeScript 네이티브 지원
- **Prisma**: TypeScript와 완벽한 타입 추론, 직관적인 스키마 정의, 마이그레이션 관리
- **Zod**: 런타임에서 요청 데이터 유효성 검증, TypeScript 타입과 자동 동기화

---

## Database

| 기술 | 역할 |
|------|------|
| PostgreSQL | 메인 데이터베이스 |

### 선택 이유

- ACID 트랜잭션 완벽 지원 (결제 시스템에 필수)
- JSONB 타입으로 불규칙한 상품 데이터 처리 유연
- Prisma와의 궁합 최적

---

## 결제

| 기술 | 역할 |
|------|------|
| Toss Payments SDK | 결제 처리 |

### 결제 플로우

```
장바구니 → 결제 요청 (Frontend SDK) → 결제 승인 (Backend API) → 주문 저장
```

---

## 인프라 / 배포

| 기술 | 역할 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 로컬 개발 환경 / 배포 오케스트레이션 |

---

## 개발 환경

| 기술 | 역할 |
|------|------|
| pnpm | 패키지 매니저 (모노레포 워크스페이스) |
| ESLint | 코드 린팅 |
| Prettier | 코드 포맷팅 |
