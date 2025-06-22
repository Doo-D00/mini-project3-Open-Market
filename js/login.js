document.addEventListener('DOMContentLoaded', () => {
  initTabSwitch('.tab');
  initForm();
  initLinks();
});

function initForm() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = val('username');
    const password = val('password');
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = '';

    if (!username || !password) {
      errorMsg.textContent = '아이디와 비밀번호를 모두 입력하세요.';
      return;
    }

    try {
      const data = await apiRequest('https://api.weniops.co.kr/services/open-market/accounts/login/', 'POST', { username, password });
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('userType', data.user.user_type);
      localStorage.setItem('username', data.user.username);
      alert(`로그인 성공! ${data.user.username} (${data.user.user_type})`);
      location.href = 'index.html';
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}

function initLinks() {
  document.getElementById('signupLink').addEventListener('click', (e) => {
    e.preventDefault();
    location.href = 'seller.html';
  });
  document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert('비밀번호 찾기 페이지로 이동');
  });
}

function initTabSwitch(selector) {
  document.querySelectorAll(selector).forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll(selector).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function val(id) {
  return document.getElementById(id).value.trim();
}

async function apiRequest(url, method = 'GET', payload = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (payload) options.body = JSON.stringify(payload);
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API 오류');
  return data;
}
