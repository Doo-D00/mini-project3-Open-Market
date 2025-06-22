document.addEventListener('DOMContentLoaded', () => {
  initQuantity();
  initTabs('.tab');
  initSearch('.search-input', '.search-btn');
});

function initQuantity() {
  const quantityInput = document.getElementById('quantity');
  const totalQuantity = document.getElementById('total-quantity');
  const totalPrice = document.getElementById('total-price');
  const basePrice = 17500;

  const update = () => {
    const qty = Math.max(1, parseInt(quantityInput.value) || 1);
    quantityInput.value = qty;
    totalQuantity.textContent = qty;
    totalPrice.textContent = (qty * basePrice).toLocaleString() + '원';
  };

  document.querySelector('.quantity-btn[onclick="decreaseQuantity()"]')
    .addEventListener('click', () => {
      quantityInput.value = Math.max(1, quantityInput.value - 1);
      update();
    });

  document.querySelector('.quantity-btn[onclick="increaseQuantity()"]')
    .addEventListener('click', () => {
      quantityInput.value++;
      update();
    });

  quantityInput.addEventListener('input', update);
  update();
}

function initTabs(selector) {
  document.querySelectorAll(selector).forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll(selector).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function initSearch(inputSelector, buttonSelector) {
  const input = document.querySelector(inputSelector);
  const btn = document.querySelector(buttonSelector);

  btn.addEventListener('click', () => {
    const query = input.value.trim();
    if (query) alert(`검색어: ${query}`);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}
