document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initForm();
  initLinks();
});

function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

function initForm() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = '';

    if (!username || !password) {
      errorMsg.textContent = '아이디와 비밀번호를 모두 입력하세요.';
      return;
    }

    try {
      // TODO: 실제 로그인 API 주소와 방식 맞게 수정
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type: activeTab })
      });
      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();

      localStorage.setItem('userType', data.type);
      alert(`${data.type === 'buyer' ? '구매회원' : '판매회원'} 로그인 성공`);
      location.href = 'index.html';
    } catch (err) {
      console.error(err);
      errorMsg.textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
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

// 임의로 지정된 로그인 아이디와 비밀번호
const presetCredentials = {
  username: 'seller1', 
  password: 'weniv1234'
};

// 로그인 폼 submit 이벤트
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('아이디와 비밀번호를 입력해주세요.');
    return;
  }

  await loginUser(username, password);
});

// 실제 API 요청 함수
async function loginUser(username, password) {
  const url = 'https://api.weniops.co.kr/services/open-market/accounts/login/';
  const payload = { username, password };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error('로그인 실패:', data);
      alert(data.error || '로그인 실패');
      return false;
    }

    console.log('로그인 성공:', data);
    alert(`로그인 성공! ${data.user.username} (${data.user.user_type})`);

    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userType', data.user.user_type);
    localStorage.setItem('username', data.user.username);

    location.href = 'index.html';
    return true;

  } catch (err) {
    console.error('네트워크 에러:', err);
    alert('네트워크 오류');
    return false;
  }
}
