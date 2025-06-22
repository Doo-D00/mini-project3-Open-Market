document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initForm();
});

function initTabs() {
  initTabSwitch('.tab', (tab, idx) => {
    document.getElementById('sellerFields').style.display = idx === 1 ? 'block' : 'none';
  });
}

function initForm() {
  document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const isSeller = document.querySelector('.tab.active').textContent.includes('판매회원가입');
    if (isSeller) await handleSellerSignup();
    else await handleBuyerSignup();
  });
}

async function handleBuyerSignup() {
  const payload = getBuyerPayload();
  await sendSignupRequest('accounts/buyer/signup/', payload, '구매회원');
}

async function handleSellerSignup() {
  const payload = getSellerPayload();
  await sendSignupRequest('accounts/seller/signup/', payload, '판매회원');
}

function getBuyerPayload() {
  return {
    username: val('userId'),
    password: val('password'),
    name: val('name'),
    phone_number: val('phonePrefix') + val('phoneMiddle') + val('phoneLast')
  };
}

function getSellerPayload() {
  return {
    ...getBuyerPayload(),
    company_registration_number: val('bizNumber'),
    store_name: val('storeName')
  };
}

async function sendSignupRequest(path, payload, label) {
  try {
    const data = await apiRequest(`https://api.weniops.co.kr/services/open-market/${path}`, 'POST', payload);
    alert(`${label} 회원가입 성공: ${data.username}`);
    location.href = 'index.html';
  } catch (err) {
    alert(`${label} 회원가입 실패: ${err.message}`);
  }
}

async function validateUsername(username) {
  return apiRequest(`https://api.weniops.co.kr/services/open-market/accounts/validate-username/`, 'POST', { username });
}

async function validateRegistrationNumber(regNumber) {
  return apiRequest(`https://api.weniops.co.kr/services/open-market/accounts/seller/validate-registration-number/`, 'POST', { company_registration_number: regNumber });
}

document.querySelector('.check-btn').addEventListener('click', () => {
  const username = val('userId');
  if (username) validateUsername(username).then(data => alert(data.message));
});

document.querySelector('#bizNumber').parentNode.querySelector('.check-btn').addEventListener('click', () => {
  const regNumber = val('bizNumber');
  if (regNumber) validateRegistrationNumber(regNumber).then(data => alert(data.message));
});

function val(id) {
  return document.getElementById(id).value.trim();
}

function initTabSwitch(selector, callback) {
  document.querySelectorAll(selector).forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll(selector).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (callback) callback(tab, idx);
    });
  });
}

async function apiRequest(url, method = 'GET', payload = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (payload) options.body = JSON.stringify(payload);
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API 오류');
  return data;
}
