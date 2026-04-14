# 아키텍처

## 프로젝트 구조

```
Valubox/                          # 모노레포 루트
├── apps/
│   ├── frontend/                 # React + Vite 앱
│   │   ├── src/
│   │   │   ├── components/       # 재사용 UI 컴포넌트
│   │   │   │   ├── ui/           # shadcn/ui 기본 컴포넌트
│   │   │   │   └── shared/       # 프로젝트 공통 컴포넌트
│   │   │   ├── pages/            # 페이지 컴포넌트
│   │   │   │   ├── products/     # 상품 관련 페이지
│   │   │   │   ├── cart/         # 장바구니 페이지
│   │   │   │   └── payment/      # 결제 관련 페이지
│   │   │   ├── hooks/            # 커스텀 훅
│   │   │   ├── api/              # API 호출 함수
│   │   │   ├── types/            # TypeScript 타입 정의
│   │   │   └── lib/              # 유틸리티 함수
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── backend/                  # Fastify 서버
│       ├── src/
│       │   ├── routes/           # API 라우트
│       │   │   ├── products/     # 상품 API
│       │   │   ├── cart/         # 장바구니 API
│       │   │   ├── orders/       # 주문 API
│       │   │   └── payments/     # 결제 API
│       │   ├── services/         # 비즈니스 로직
│       │   ├── schemas/          # Zod 요청/응답 스키마
│       │   ├── plugins/          # Fastify 플러그인
│       │   └── app.ts            # 앱 진입점
│       ├── prisma/
│       │   ├── schema.prisma     # 데이터베이스 스키마
│       │   └── migrations/       # 마이그레이션 파일
│       └── package.json
│
├── docker-compose.yml            # 로컬 개발 / 배포
├── package.json                  # pnpm 워크스페이스 루트
├── .gitignore
└── docs/                         # 프로젝트 문서
```

---

## 데이터베이스 스키마

```
Product (상품)
├── id
├── name          상품명
├── description   상품 설명
├── price         가격
├── stock         재고
├── images        이미지 URL 목록 (JSONB)
├── createdAt
└── updatedAt

Cart (장바구니)
├── id
├── sessionId     비로그인 세션 기반 식별
├── createdAt
└── updatedAt

CartItem (장바구니 항목)
├── id
├── cartId        → Cart
├── productId     → Product
├── quantity      수량
└── createdAt

Order (주문)
├── id
├── totalAmount   총 결제 금액
├── status        PENDING | PAID | CANCELLED
├── createdAt
└── updatedAt

OrderItem (주문 항목)
├── id
├── orderId       → Order
├── productId     → Product
├── quantity      수량
├── price         주문 시점 가격 (스냅샷)
└── createdAt

Payment (결제)
├── id
├── orderId       → Order
├── paymentKey    Toss 결제 키
├── amount        결제 금액
├── status        PENDING | DONE | FAILED
└── createdAt
```

---

## 서비스 흐름

### 상품 등록
```
관리 페이지 → POST /api/products → Prisma → PostgreSQL
```

### 상품 조회
```
상품 목록 페이지 → GET /api/products → Prisma → PostgreSQL
상품 상세 페이지 → GET /api/products/:id → Prisma → PostgreSQL
```

### 장바구니
```
상품 상세 → POST /api/cart/items (sessionId 기반)
장바구니 페이지 → GET /api/cart
항목 삭제 → DELETE /api/cart/items/:id
```

### 결제
```
장바구니 → Toss SDK 결제 요청 (Frontend)
              ↓
        Toss 결제 완료 콜백
              ↓
        POST /api/payments/confirm (Backend)
              ↓
        Toss API 결제 승인 요청
              ↓
        Order + Payment 저장
              ↓
        결제 완료 페이지
```

---

## Docker 구성

```yaml
services:
  postgres:    # PostgreSQL 데이터베이스
  backend:     # Fastify API 서버
  frontend:    # React 앱 (nginx)
```
