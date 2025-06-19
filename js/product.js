const quantityInput = document.getElementById('quantity');
const totalQuantitySpan = document.getElementById('total-quantity');
const totalPriceSpan = document.getElementById('total-price');
const basePrice = 17500;

function updateTotal() {
  const quantity = parseInt(quantityInput.value);
  const total = basePrice * quantity;
  totalQuantitySpan.textContent = quantity;
  totalPriceSpan.textContent = total.toLocaleString() + '원';
}

function increaseQuantity() {
  quantityInput.value = parseInt(quantityInput.value) + 1;
  updateTotal();
}

function decreaseQuantity() {
  const currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
    updateTotal();
  }
}

quantityInput.addEventListener('input', updateTotal);


// Tab functionality
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    alert('검색어: ' + searchTerm);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});
