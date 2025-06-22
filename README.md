# mini-project3-Open-Market


# Open Market Frontend

본 프로젝트는 [weniops Open Market API](https://api.weniops.co.kr/services/open-market/)를 연동하여 
구매자/판매자 회원가입, 로그인, 상품 조회, 판매자 상품 등록 기능을 제공합니다.

![Open Market](https://via.placeholder.com/1000x300?text=Open+Market+Banner)

---

## 프로젝트 구조
```
📦 js/
 ┣ login.js          → 로그인 로직
 ┣ seller.js         → 구매/판매 회원가입, 아이디/사업자등록번호 검증
 ┣ script.js         → 메인 페이지 (상품 목록, 배너, 공통 기능)
 ┣ product-register.js → 상품 등록 (판매자 전용)
📄 index.html         → 메인 페이지
📄 login.html         → 로그인 페이지
📄 seller.html        → 회원가입 페이지
📄 product.html       → 상품 상세 (추후 개발)
```

---

## 주요 기능
### 회원가입
- 구매자: `/accounts/buyer/signup/`
- 판매자: `/accounts/seller/signup/`
- 아이디 중복확인: `/accounts/validate-username/`
- 사업자등록번호 검증: `/accounts/seller/validate-registration-number/`

### 로그인
- `/accounts/login/`  
- 성공 시 JWT 토큰(`access`, `refresh`) 저장  
- access: 5분, refresh: 1일 유효

### 상품
- 전체 조회: `GET /products/`
- 판매자별 조회: `GET /<seller_name>/products/`
- 등록: `POST /products/` (판매자만 가능)

---

## 로그인 코드 예시
```javascript
const presetCredentials = { username: 'seller1', password: 'weniv1234' };

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await loginUser(presetCredentials.username, presetCredentials.password);
});

async function loginUser(username, password) {
  const res = await fetch('https://api.weniops.co.kr/services/open-market/accounts/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userType', data.user.user_type);
    alert(`로그인 성공: ${data.user.username}`);
    location.href = 'index.html';
  } else {
    alert(data.error || '로그인 실패');
  }
}
```

---

## 상품 조회 코드 예시
```javascript
async function fetchProducts() {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('https://api.weniops.co.kr/services/open-market/products/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (res.ok) {
    console.log('상품 목록', data.results);
  } else {
    alert('상품 조회 실패');
  }
}
```
> 💡 Bearer 토큰 필요

---

## 상품 등록 코드 예시
```javascript
async function registerProduct(formData) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('https://api.weniops.co.kr/services/open-market/products/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const data = await res.json();
  if (res.ok) {
    alert(`등록 성공: ${data.name}`);
  } else {
    alert(data.detail || JSON.stringify(data));
  }
}
```
폼은 `multipart/form-data`, `image` 필드에 파일 필수

---

## 설정 화면 이미지 예시
회원가입 / 로그인  
![Login](https://via.placeholder.com/400x300?text=Login+Form)
![Register](https://via.placeholder.com/400x300?text=Register+Form)

상품 카드  
![Product](https://via.placeholder.com/400x300?text=Product+Card)

---

## API 주요 엔드포인트
| 엔드포인트 | 메서드 | 설명 |
|-------------|---------|-------|
| `/accounts/login/` | POST | 로그인 (JWT 토큰 발급) |
| `/accounts/buyer/signup/` | POST | 구매자 회원가입 |
| `/accounts/seller/signup/` | POST | 판매자 회원가입 |
| `/accounts/validate-username/` | POST | 아이디 중복 확인 |
| `/accounts/seller/validate-registration-number/` | POST | 사업자등록번호 중복 확인 |
| `/products/` | GET | 상품 전체 조회 |
| `/products/` | POST | 상품 등록 (판매자 전용) |
| `/<seller_name>/products/` | GET | 판매자 상품 조회 |

---

## 실행 방법
1️⃣ API 연동을 위한 accessToken 발급 (로그인)  
2️⃣ localStorage에 저장된 accessToken → 이후 요청 시 Bearer 인증  
3️⃣ `index.html` → 상품 조회  
4️⃣ `seller.html` → 회원가입, 검증  
5️⃣ 로그인 preset 계정:
```
seller1 / weniv1234  
buyer1 / weniv1234
```

---

## 주의사항
- accessToken 만료 시 refreshToken으로 재발급 필요 (추후 추가)
- CORS / HTTPS 환경에서 테스트 권장

