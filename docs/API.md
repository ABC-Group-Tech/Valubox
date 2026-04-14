# API 문서

Base URL: `http://localhost:8000/api`

---

## 상품 (Products)

### 상품 목록 조회

```
GET /products
```

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | number | 아니오 | 페이지 번호 (기본값: 1) |
| limit | number | 아니오 | 페이지당 항목 수 (기본값: 20) |

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "상품명",
      "price": 10000,
      "stock": 100,
      "images": ["https://..."],
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

---

### 상품 상세 조회

```
GET /products/:id
```

**Response 200**
```json
{
  "id": "uuid",
  "name": "상품명",
  "description": "상품 설명",
  "price": 10000,
  "stock": 100,
  "images": ["https://..."],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### 상품 등록

```
POST /products
```

**Request Body**
```json
{
  "name": "상품명",
  "description": "상품 설명",
  "price": 10000,
  "stock": 100,
  "images": ["https://..."]
}
```

**Response 201**
```json
{
  "id": "uuid",
  "name": "상품명",
  "price": 10000,
  "stock": 100
}
```

---

## 장바구니 (Cart)

### 장바구니 조회

```
GET /cart
```

**Headers**

| 헤더 | 설명 |
|------|------|
| X-Session-Id | 세션 ID (비로그인 식별자) |

**Response 200**
```json
{
  "id": "uuid",
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "상품명",
        "price": 10000,
        "images": ["https://..."]
      },
      "quantity": 2
    }
  ],
  "totalAmount": 20000
}
```

---

### 장바구니 상품 추가

```
POST /cart/items
```

**Request Body**
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

**Response 201**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "quantity": 1
}
```

---

### 장바구니 상품 수량 변경

```
PATCH /cart/items/:id
```

**Request Body**
```json
{
  "quantity": 3
}
```

---

### 장바구니 상품 삭제

```
DELETE /cart/items/:id
```

**Response 204**

---

## 주문 / 결제 (Orders & Payments)

### 주문 생성

```
POST /orders
```

**Request Body**
```json
{
  "cartId": "uuid"
}
```

**Response 201**
```json
{
  "orderId": "uuid",
  "totalAmount": 20000,
  "items": [...]
}
```

---

### 결제 승인 (Toss Payments 콜백)

```
POST /payments/confirm
```

**Request Body**
```json
{
  "paymentKey": "toss_payment_key",
  "orderId": "uuid",
  "amount": 20000
}
```

**Response 200**
```json
{
  "paymentKey": "toss_payment_key",
  "orderId": "uuid",
  "status": "DONE",
  "amount": 20000
}
```

---

## 에러 응답 형식

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "에러 메시지"
}
```

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청 |
| 404 | 리소스 없음 |
| 409 | 재고 부족 등 충돌 |
| 500 | 서버 오류 |
