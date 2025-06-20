document.addEventListener('DOMContentLoaded', () => {
    initBanner();
    initSearch();
    initProductCards();
    initHeaderUI();
});

function initBanner() {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');

    const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    currentSlideIndex = index;
};

document.querySelectorAll('.banner-nav.prev').forEach(btn => btn.addEventListener('click', () => {
    showSlide((currentSlideIndex - 1 + slides.length) % slides.length);
}));
    document.querySelectorAll('.banner-nav.next').forEach(btn => btn.addEventListener('click', () => {
    showSlide((currentSlideIndex + 1) % slides.length);
}));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

    showSlide(0);
    setInterval(() => showSlide((currentSlideIndex + 1) % slides.length), 5000);
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    const performSearch = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      // TODO: 실제 API 주소로 변경
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('검색 실패');
        const data = await res.json();
        console.log('검색 결과:', data);
        alert(`검색어: ${query}`);
    } catch (err) {
        console.error(err);
        alert('검색 중 오류 발생');
    }
};

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});
}

function initProductCards() {
    document.querySelectorAll('.product-card').forEach((card, i) => {
    card.addEventListener('click', () => {
        alert(`상품 ${i + 1} 클릭됨`);
      // location.href = `/product-detail/${i + 1}`;
    });
});
}

function initHeaderUI() {
    const userType = localStorage.getItem('userType');
    const headerIcons = document.querySelector('.header-icons');

    if (userType === 'seller') {
    const cart = headerIcons.querySelector('.icon-wrapper:first-child');
    if (cart) cart.remove();

    const btn = document.createElement('button');
    btn.className = 'seller-center-btn';
    btn.textContent = '판매자 센터';
    btn.addEventListener('click', () => location.href = 'seller-center.html');
    headerIcons.appendChild(btn);
}

    document.getElementById('loginBtn').addEventListener('click', () => location.href = 'login.html');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    const url = 'https://api.weniops.co.kr/services/open-market/products/';
    const token = localStorage.getItem('accessToken');

    try {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
    });

    const data = await res.json();

    if (!res.ok) {
        console.error('상품 조회 실패:', data);
        alert('상품 목록을 불러오지 못했습니다.');
        return;
    }

    console.log('상품 목록:', data);
    renderProducts(data.results);

    } catch (err) {
    console.error('네트워크 에러:', err);
    alert('네트워크 오류');
    }
}

// 렌더링용 예시 함수
function renderProducts(products) {
    const container = document.querySelector('.products-grid');
    container.innerHTML = '';

    products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-info">
        <p class="product-category">${product.seller.store_name}</p>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${product.price.toLocaleString()}원</p>
        </div>
    `;
    container.appendChild(div);
    });
}


document.addEventListener('DOMContentLoaded', () => {
  const sellerName = '홍길동'; // 실제 seller name 값으로 대체
    fetchSellerProducts(sellerName);
});

async function fetchSellerProducts(sellerName) {
    const url = `https://api.weniops.co.kr/services/open-market/${encodeURIComponent(sellerName)}/products/`;
    const token = localStorage.getItem('accessToken');

    try {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
    });

    const data = await res.json();

    if (!res.ok) {
        console.error('판매자 상품 조회 실패:', data);
        alert(data.detail || '판매자 상품을 불러오지 못했습니다.');
        return;
    }

    console.log('판매자 상품 목록:', data);
    renderProducts(data.results);

    } catch (err) {
    console.error('네트워크 에러:', err);
    alert('네트워크 오류');
    }
}
