// Tab switching functionality
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', function () {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const tabType = this.getAttribute('data-tab');
    console.log(`Switched to ${tabType} login`);
  });
});

// Form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
  const errorMessage = document.getElementById('errorMessage');

  // 기본: 메시지 초기화
  errorMessage.textContent = '';

  if (!username && !password) {
    errorMessage.textContent = '아이디를 입력해 주세요.';
    return;
  }

  if (!username && password) {
    errorMessage.textContent = '아이디를 입력해 주세요.';
    return;
  }

  if (username && !password) {
    errorMessage.textContent = '비밀번호를 입력해 주세요.';
    return;
  }

  if (username !== 'hodu' || password !== '1234') {
    errorMessage.textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
    return;
  }

  // 로그인 성공
  errorMessage.textContent = '';
  alert(`${activeTab === 'buyer' ? '구매회원' : '판매회원'} 로그인 성공!\n아이디: ${username}`);
});

// Footer link handlers
document.getElementById('signupLink').addEventListener('click', function (e) {
  e.preventDefault();
  window.location.href = 'seller.html';
});

document.getElementById('forgotPasswordLink').addEventListener('click', function (e) {
  e.preventDefault();
  alert('비밀번호 찾기 페이지로 이동');
});

// Input focus effects
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
  input.addEventListener('focus', function () {
    this.style.borderColor = '#21BF48';
  });

  input.addEventListener('blur', function () {
    if (!this.value) {
      this.style.borderColor = '#e0e0e0';
    }
  });
});
