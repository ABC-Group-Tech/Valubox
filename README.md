# Valubox

> **Value + Box** — 가성비 상품을 박스처럼 모아놓은 도소매 판매 플랫폼

## 프로젝트 소개

Valubox는 도소매 사이트에서 상품을 수집하여 한 곳에서 편리하게 구매할 수 있는 플랫폼입니다.  
가치(Value) 있는 상품들을 하나의 박스(Box)에 담는다는 컨셉으로 기획되었습니다.

## 주요 기능

| 기능 | 상태 |
|------|------|
| 상품 등록 | 1차 구현 |
| 상품 목록 / 상세 조회 | 1차 구현 |
| 장바구니 | 1차 구현 |
| 결제 (Toss Payments) | 1차 구현 |
| 상품 크롤링 자동화 | 추후 구현 |
| 회원 / 로그인 | 추후 구현 |
| 관리자 패널 | 추후 구현 |

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# Docker로 전체 실행
docker-compose up
```

## 문서

- [기술 스택](docs/TECH_STACK.md)
- [아키텍처](docs/ARCHITECTURE.md)
- [개발 가이드](docs/DEVELOPMENT.md)
- [API 문서](docs/API.md)

## 기술 스택 요약

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Fastify + TypeScript + Prisma
- **Database**: PostgreSQL
- **결제**: Toss Payments SDK
- **배포**: Docker
