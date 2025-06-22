document.addEventListener('DOMContentLoaded', () => {
    initBanner();
    initSearch('.search-input', '.search-btn');
    initProductCards();
    initHeaderUI();
    fetchProducts();
});

function initBanner() {
    let current = 0;
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');

    const show = (idx) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[idx]) {
        slides[idx].classList.add('active');
        dots[idx].classList.add('active');
    }
    current = idx;
};

    document.querySelector('.banner-nav.prev')?.addEventListener('click', () => show((current - 1 + slides.length) % slides.length));
    document.querySelector('.banner-nav.next')?.addEventListener('click', () => show((current + 1) % slides.length));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

    show(0);
    setInterval(() => show((current + 1) % slides.length), 5000);
}

function initSearch(inputSelector, buttonSelector) {
    const input = document.querySelector(inputSelector);
    const btn = document.querySelector(buttonSelector);
    btn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) return;
    alert(`검색어: ${query}`);
    // 실제 API 호출로 대체 가능
});
    input.addEventListener('keypress', (e) => e.key === 'Enter' && btn.click());
}

function initProductCards() {
    document.querySelectorAll('.product-card').forEach((card, i) => {
    card.addEventListener('click', () => alert(`상품 ${i + 1} 클릭됨`));
});
}

function initHeaderUI() {
    const userType = localStorage.getItem('userType');
    const headerIcons = document.querySelector('.header-icons');

    if (userType === 'seller') {
    headerIcons.querySelector('.icon-wrapper')?.remove();
    const btn = document.createElement('button');
    btn.className = 'seller-center-btn';
    btn.textContent = '판매자 센터';
    btn.addEventListener('click', () => location.href = 'seller-center.html');
    headerIcons.appendChild(btn);
}

    document.getElementById('loginBtn').addEventListener('click', () => location.href = 'login.html');
}

async function fetchProducts() {
    try {
    const data = await apiRequest('https://api.weniops.co.kr/services/open-market/products/');
    renderProducts(data.results);
} catch {}
}

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
        </div>`;
    container.appendChild(div);
});
}

async function apiRequest(url, method = 'GET', payload = null) {
    const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
};
    const token = localStorage.getItem('accessToken');
    if (token) options.headers.Authorization = `Bearer ${token}`;
    if (payload) options.body = JSON.stringify(payload);

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API 오류');
    return data;
}
