document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initForm();
});

function initTabs() {
  document.querySelectorAll('.tab').forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.getElementById('sellerFields').style.display = idx === 1 ? 'block' : 'none';
    });
  });
}

function initForm() {
  const form = document.getElementById('registrationForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // TODO: API URL에 맞게 변경
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('회원가입 실패');
      alert('회원가입 완료!');
      location.href = 'index.html';
    } catch (err) {
      console.error(err);
      alert('회원가입 중 오류 발생');
    }
  });
}

async function signupBuyer(payload) {
  const url = 'https://api.weniops.co.kr/services/open-market/accounts/buyer/signup/';
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('회원가입 실패:', data);
      alert(`회원가입 실패: ${JSON.stringify(data)}`);
      return;
    }

    console.log('회원가입 성공:', data);
    alert(`회원가입 성공: ${data.username}`);
  } catch (err) {
    console.error('요청 에러:', err);
    alert('네트워크 오류');
  }
}

// submit 이벤트에서 호출
document.getElementById('registrationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const payload = {
    username: document.getElementById('userId').value.trim(),
    password: document.getElementById('password').value.trim(),
    name: document.getElementById('name').value.trim(),
    phone_number: 
      document.getElementById('phonePrefix').value.trim() + 
      document.getElementById('phoneMiddle').value.trim() + 
      document.getElementById('phoneLast').value.trim()
  };

  signupBuyer(payload);
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const activeTab = document.querySelector('.tab.active').textContent;
    if (activeTab.includes('구매회원가입')) {
      handleBuyerSignup();
    } else {
      handleSellerSignup();
    }
  });
});

async function handleBuyerSignup() {
  const url = 'https://api.weniops.co.kr/services/open-market/accounts/buyer/signup/';
  const payload = {
    username: document.getElementById('userId').value.trim(),
    password: document.getElementById('password').value.trim(),
    name: document.getElementById('name').value.trim(),
    phone_number:
      document.getElementById('phonePrefix').value.trim() +
      document.getElementById('phoneMiddle').value.trim() +
      document.getElementById('phoneLast').value.trim()
  };

  await sendSignupRequest(url, payload, '구매회원');
}

async function handleSellerSignup() {
  const url = 'https://api.weniops.co.kr/services/open-market/accounts/seller/signup/';
  const payload = {
    username: document.getElementById('userId').value.trim(),
    password: document.getElementById('password').value.trim(),
    name: document.getElementById('name').value.trim(),
    phone_number:
      document.getElementById('phonePrefix').value.trim() +
      document.getElementById('phoneMiddle').value.trim() +
      document.getElementById('phoneLast').value.trim(),
    company_registration_number: document.getElementById('bizNumber').value.trim(),
    store_name: document.getElementById('storeName').value.trim()
  };

  await sendSignupRequest(url, payload, '판매회원');
}

async function sendSignupRequest(url, payload, userTypeLabel) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(`${userTypeLabel} 회원가입 실패:`, data);
      alert(`회원가입 실패: ${JSON.stringify(data)}`);
      return;
    }

    console.log(`${userTypeLabel} 회원가입 성공:`, data);
    alert(`${userTypeLabel} 회원가입 성공: ${data.username}`);
    location.href = 'index.html';
  } catch (err) {
    console.error('네트워크 에러:', err);
    alert('네트워크 오류');
  }
}

// 중복확인 버튼 클릭 시 동작
document.querySelector('.check-btn').addEventListener('click', async () => {
  const username = document.getElementById('userId').value.trim();
  if (!username) {
    alert('아이디를 입력해주세요.');
    return;
  }
  await validateUsername(username);
});

// 아이디 검증 함수
async function validateUsername(username) {
  const url = 'https://api.weniops.co.kr/services/open-market/accounts/validate-username/';
  const payload = { username };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error('아이디 검증 실패:', data);
      alert(data.error || '아이디 검증 실패');
      return false;
    }

    console.log('아이디 검증 성공:', data);
    alert(data.message);
    return true;

  } catch (err) {
    console.error('네트워크 에러:', err);
    alert('네트워크 오류');
    return false;
  }
}

// 버튼 클릭 이벤트: 사업자등록번호 검증
document.querySelector('#bizNumber').parentNode.querySelector('.check-btn').addEventListener('click', async () => {
  const regNumber = document.getElementById('bizNumber').value.trim();
  if (!regNumber) {
    alert('사업자등록번호를 입력해주세요.');
    return;
  }
  await validateRegistrationNumber(regNumber);
});

// 실제 API 요청 함수
async function validateRegistrationNumber(regNumber) {
  const url = 'https://api.weniops.co.kr/services/open-market/accounts/seller/validate-registration-number/';
  const payload = { company_registration_number: regNumber };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error('사업자등록번호 검증 실패:', data);
      alert(data.error || '사업자등록번호 검증 실패');
      return false;
    }

    console.log('사업자등록번호 검증 성공:', data);
    alert(data.message);
    return true;

  } catch (err) {
    console.error('네트워크 에러:', err);
    alert('네트워크 오류');
    return false;
  }
}
