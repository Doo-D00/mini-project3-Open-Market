document.addEventListener('DOMContentLoaded', () => {
  initQuantity();
  initTabs();
  initSearch();
});

function initQuantity() {
  const quantityInput = document.getElementById('quantity');
  const totalQuantity = document.getElementById('total-quantity');
  const totalPrice = document.getElementById('total-price');
  const basePrice = 17500;

  const update = () => {
    const qty = parseInt(quantityInput.value) || 1;
    totalQuantity.textContent = qty;
    totalPrice.textContent = (qty * basePrice).toLocaleString() + '원';
  };

  document.querySelector('.quantity-btn[onclick="decreaseQuantity()"]').addEventListener('click', () => {
    if (quantityInput.value > 1) quantityInput.value--;
    update();
  });

  document.querySelector('.quantity-btn[onclick="increaseQuantity()"]').addEventListener('click', () => {
    quantityInput.value++;
    update();
  });

  quantityInput.addEventListener('input', update);

  update();
}

function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function initSearch() {
  const input = document.querySelector('.search-input');
  const btn = document.querySelector('.search-btn');

  btn.addEventListener('click', () => alert(`검색어: ${input.value.trim()}`));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}
