// Banner carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        console.log('Searching for:', searchTerm);
        // Here you would typically send the search query to your backend
        alert(`검색어: ${searchTerm}`);
    }
}

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = 'login.html';
});

// Product card click handlers
const productCards = document.querySelectorAll('.product-card');

productCards.forEach((card, index) => {
    card.addEventListener('click', function() {
        console.log(`Product ${index + 1} clicked`);
        // Here you would typically navigate to the product detail page
        alert(`상품 ${index + 1} 클릭됨`);
    });
});

// Header icon handlers
const iconBtns = document.querySelectorAll('.icon-btn');

iconBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
        if (index === 0) {
            // Shopping cart clicked
            console.log('Shopping cart clicked');
            alert('장바구니');
        } else if (index === 1) {
            // User profile clicked
            console.log('User profile clicked');
            alert('사용자 프로필');
        }
    });
});

// Smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    const userType = localStorage.getItem('userType');
    const headerIcons = document.querySelector('.header-icons');

    if (userType === 'seller') {
    // 장바구니 버튼 제거
    const cartWrapper = headerIcons.querySelector('.icon-wrapper:first-child');
    if (cartWrapper) {
    cartWrapper.remove();
    }

    // 판매자 센터 버튼 추가
    const sellerBtn = document.createElement('button');
    sellerBtn.classList.add('seller-center-btn');
    sellerBtn.textContent = '판매자 센터';
    sellerBtn.addEventListener('click', function() {
    window.location.href = 'seller-center.html';
    });

    headerIcons.appendChild(sellerBtn);
}

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize first slide as active
    showSlide(0);
});

// Add loading animation for product images
const productImages = document.querySelectorAll('.product-image img');

productImages.forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.src = '/placeholder.svg?height=200&width=200&text=이미지 없음';
    });
});