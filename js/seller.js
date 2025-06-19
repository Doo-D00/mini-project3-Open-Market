// 이미 가입된 ID 목록 (예시)
const existingIds = ['weniv001', 'testuser', 'sample123'];
const existingPhones = ['01012345678', '01088889999', '01122223333'];

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');
  const inputs = Array.from(form.querySelectorAll('input[required]'));
  const submitBtn = document.getElementById('submitBtn');
  const agreeCheckbox = document.getElementById('agreeTerms');
  const userIdInput = document.getElementById('userId');
  const pwInput = document.getElementById('password');
  const pwConfirmInput = document.getElementById('passwordConfirm');
  const pwIcon = pwInput.parentNode.querySelector('.check-icon');
  const pwConfirmIcon = pwConfirmInput.parentNode.querySelector('.check-icon');

  // 중복확인 버튼
  document.querySelector('.check-btn').addEventListener('click', function () {
    checkDuplicate(userIdInput);
    validateForm();
  });

  // 전화번호 이벤트 연결
  document.getElementById('phonePrefix').addEventListener('input', checkPhoneDuplicate);
  document.getElementById('phoneMiddle').addEventListener('input', checkPhoneDuplicate);
  document.getElementById('phoneLast').addEventListener('input', checkPhoneDuplicate);

  // input 이벤트 처리
  inputs.forEach((input, index) => {
    input.addEventListener('input', function () {
      clearError(input);

      // 상위 input 비어 있으면 '필수 정보입니다' 표시
      for (let i = 0; i < index; i++) {
        if (!inputs[i].value.trim()) {
          showError(inputs[i], '필수 정보입니다.');
          inputs[i].style.borderColor = '#ff4d4f';
        }
      }

      if (input === pwInput) {
        checkPasswordStrength(pwInput, pwIcon);
      }

      if (input === pwConfirmInput) {
        validatePasswordConfirm(pwInput, pwConfirmInput, pwConfirmIcon);
      }

      validateForm();
    });

    input.addEventListener('blur', validateForm);
  });

  if (agreeCheckbox) {
    agreeCheckbox.addEventListener('change', validateForm);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitBtn.classList.contains('active')) {
      alert('회원가입이 완료되었습니다!');
      window.location.href = 'index.html';
    }
  });

  updateSubmitBtn(false);
});

// 탭 전환
function switchTab(index) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  const sellerFields = document.getElementById('sellerFields');

  if (index === 1) {
    // 판매회원가입
    sellerFields.style.display = 'block';
  } else {
    // 구매회원가입
    sellerFields.style.display = 'none';
  }

  // 폼 상태 초기화
  validateForm();
}

// 아이디 중복확인
function checkDuplicate(userIdInput) {
  const userId = userIdInput.value.trim();
  clearError(userIdInput);
  userIdInput.style.borderColor = '#ddd';

  const idRegex = /^[A-Za-z0-9]{1,20}$/;

  if (!userId) {
    showError(userIdInput, '아이디를 입력해주세요.');
    userIdInput.style.borderColor = '#ff4d4f';
    return;
  }

  if (!idRegex.test(userId)) {
    showError(userIdInput, '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.');
    userIdInput.style.borderColor = '#ff4d4f';
    return;
  }

  if (existingIds.includes(userId)) {
    showError(userIdInput, '이미 사용 중인 아이디입니다.');
    userIdInput.style.borderColor = '#ff4d4f';
    return;
  }

  showSuccess(userIdInput, '멋진 아이디네요 :)');
  userIdInput.style.borderColor = '#21bf48';
}

// 비밀번호 유효성 + 아이콘 + 테두리
function checkPasswordStrength(input, icon) {
  const value = input.value.trim();
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  clearError(input);

  if (regex.test(value)) {
    input.style.borderColor = '#21bf48';
    if (icon) icon.src = './img/icon-check-on.svg';
    return true;
  } else {
    showError(input, '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
    input.style.borderColor = '#ff4d4f';
    if (icon) icon.src = './img/icon-check-off.svg';
    return false;
  }
}

// 비밀번호 재확인 유효성
function validatePasswordConfirm(pwInput, pwConfirmInput, icon) {
  const pw = pwInput.value.trim();
  const pwConfirm = pwConfirmInput.value.trim();

  clearError(pwConfirmInput);

  if (!pwConfirm) {
    pwConfirmInput.style.borderColor = '#ddd';
    if (icon) icon.src = './img/icon-check-off.svg';
    return false;
  }

  if (pw && pwConfirm && pw === pwConfirm) {
    pwConfirmInput.style.borderColor = '#21bf48';
    if (icon) icon.src = './img/icon-check-on.svg';
    return true;
  } else {
    pwConfirmInput.style.borderColor = '#ff4d4f';
    if (icon) icon.src = './img/icon-check-off.svg';
    showError(pwConfirmInput, '비밀번호가 일치하지 않습니다.');
    return false;
  }
}

// 전화번호 중복 확인
function checkPhoneDuplicate() {
  const prefix = document.getElementById('phonePrefix').value.trim();
  const middle = document.getElementById('phoneMiddle').value.trim();
  const last = document.getElementById('phoneLast').value.trim();
  const phone = prefix + middle + last;

  const phoneGroup = document.getElementById('phoneMiddle').closest('.form-group');
  if (!phoneGroup) return;

  const existingMsg = phoneGroup.querySelector('.error-msg');
  if (existingMsg) existingMsg.remove();

  document.getElementById('phoneMiddle').style.borderColor = '#ddd';
  document.getElementById('phoneLast').style.borderColor = '#ddd';
  document.getElementById('phonePrefix').style.borderColor = '#ddd';

  if (existingPhones.includes(phone)) {
    const msg = document.createElement('div');
    msg.className = 'error-msg';
    msg.style.color = '#ff4d4f';
    msg.style.fontSize = '12px';
    msg.style.marginTop = '5px';
    msg.textContent = '해당 사용자 전화번호는 이미 존재합니다.';
    phoneGroup.appendChild(msg);

    document.getElementById('phoneMiddle').style.borderColor = '#ff4d4f';
    document.getElementById('phoneLast').style.borderColor = '#ff4d4f';
    document.getElementById('phonePrefix').style.borderColor = '#ff4d4f';

    return false;
  }

  return true;
}

// 폼 전체 유효성 검사
function validateForm() {
  const inputs = Array.from(document.querySelectorAll('input[required]'));
  const submitBtn = document.getElementById('submitBtn');
  const agreeCheckbox = document.getElementById('agreeTerms');
  const pwInput = document.getElementById('password');
  const pwConfirmInput = document.getElementById('passwordConfirm');
  const pwIcon = pwInput.parentNode.querySelector('.check-icon');
  const pwConfirmIcon = pwConfirmInput.parentNode.querySelector('.check-icon');

  let allValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      allValid = false;
    }
  });

  let pwValid = true;
  if (pwInput.value.trim()) {
    pwValid = checkPasswordStrength(pwInput, pwIcon);
    if (!pwValid) allValid = false;
  }

  let pwConfirmValid = true;
  if (pwConfirmInput.value.trim()) {
    pwConfirmValid = validatePasswordConfirm(pwInput, pwConfirmInput, pwConfirmIcon);
    if (!pwConfirmValid) allValid = false;
  }

  if (!checkPhoneDuplicate()) {
    allValid = false;
  }

  if (allValid && pwValid && pwConfirmValid && agreeCheckbox && agreeCheckbox.checked) {
    updateSubmitBtn(true);
  } else {
    updateSubmitBtn(false);
  }
}

// 버튼 활성화/비활성화
function updateSubmitBtn(active) {
  const submitBtn = document.getElementById('submitBtn');
  if (active) {
    submitBtn.classList.add('active');
    submitBtn.disabled = false;
  } else {
    submitBtn.classList.remove('active');
    submitBtn.disabled = true;
  }
}

// 메시지 표시
function showError(input, message) {
  clearError(input);
  const msg = document.createElement('div');
  msg.className = 'error-msg';
  msg.style.color = '#ff4d4f';
  msg.style.fontSize = '12px';
  msg.style.marginTop = '5px';
  msg.textContent = message;

  const formGroup = input.closest('.form-group');
  if (formGroup) {
    formGroup.appendChild(msg);
  }
}

function showSuccess(input, message) {
  clearError(input);
  const msg = document.createElement('div');
  msg.className = 'success-msg';
  msg.style.color = '#21bf48';
  msg.style.fontSize = '12px';
  msg.style.marginTop = '5px';
  msg.textContent = message;

  const formGroup = input.closest('.form-group');
  if (formGroup) {
    formGroup.appendChild(msg);
  }
}

// 메시지 제거
function clearError(input) {
  const formGroup = input.closest('.form-group');
  if (formGroup) {
    const error = formGroup.querySelector('.error-msg');
    if (error) error.remove();
    const success = formGroup.querySelector('.success-msg');
    if (success) success.remove();
  }
  input.style.borderColor = '#ddd';

  const icon = input.parentNode.querySelector('.check-icon');
  if (icon) icon.src = './img/icon-check-off.svg';
}

// 판매자

document.addEventListener('DOMContentLoaded', function () {
  const bizNumberInput = document.getElementById('bizNumber');
  const storeNameInput = document.getElementById('storeName');
  const bizCheckBtn = bizNumberInput.parentNode.querySelector('.check-btn');

  // 사업자 등록번호 인증 버튼
  bizCheckBtn.addEventListener('click', function () {
    clearMessage(bizNumberInput);
    const bizNumber = bizNumberInput.value.trim();

    if (!bizNumber) {
      showError(bizNumberInput, '사업자 등록번호를 입력해주세요.');
      bizNumberInput.style.borderColor = '#ff4d4f';
      return;
    }

    if (!/^\d{10}$/.test(bizNumber)) {
      showError(bizNumberInput, '10자리 숫자만 입력 가능합니다.');
      bizNumberInput.style.borderColor = '#ff4d4f';
      return;
    }

    showSuccess(bizNumberInput, '인증 완료되었습니다.');
    bizNumberInput.style.borderColor = '#21bf48';
  });

  // 입력 시 메시지 제거
  [bizNumberInput, storeNameInput].forEach(input => {
    input.addEventListener('input', function () {
      clearMessage(input);
      validateForm();
    });
  });

  // 기존의 validateForm 함수에 추가적으로 bizNumber, storeName 체크되도록 하면 됩니다
  // 예를 들어 아래처럼:
  window.validateForm = function () {
    const submitBtn = document.getElementById('submitBtn');
    const agreeCheckbox = document.getElementById('agreeTerms');
    let valid = true;

    // 공통 필수 input
    const inputs = Array.from(document.querySelectorAll('input[required], select[required]'));
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
      }
    });

    // 판매회원일 때 biz/storeName 확인
    if (document.getElementById('sellerFields').style.display !== 'none') {
      if (!bizNumberInput.value.trim() || !storeNameInput.value.trim()) {
        valid = false;
      }
    }

    if (!agreeCheckbox.checked) valid = false;

    updateSubmitBtn(valid);
  };
});
