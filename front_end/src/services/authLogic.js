// 공통 authFetch 함수 (JWT 자동 포함)
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const finalOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    },
    credentials: 'include'
  };

  const response = await fetch(url, finalOptions);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '요청 실패');
  }
  return await response.json();
};

// 회원가입
export const registerMember = async (formData) => {
  console.log('회원가입 요청 데이터:', formData);
  formData.admin = 0;

  try {
    const response = await fetch(`${process.env.REACT_APP_SPRING_IP}api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || '회원가입 실패');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 로그인
export const loginMember = async (formData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_SPRING_IP}api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '로그인 실패');
    }

    const result = await response.json();
    const { token, user } = result;

    // 로그인 성공 후 토큰과 함께 만료 시간 저장 (1시간 기준)
    const now = new Date();
    const expiresAt = now.getTime() + 1000 * 60 * 60; // 1시간

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiresAt', expiresAt.toString());

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 구글 로그인(JWT 포함)
export const oauthLogin = async (email) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_SPRING_IP}api/auth/oauth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memEmail: email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '구글 로그인 실패');
    }

    const result = await response.json();
    const { token, user } = result;

    // 로그인 성공 후 토큰과 함께 만료 시간 저장 (1시간 기준)
    const now = new Date();
    const expiresAt = now.getTime() + 1000 * 60 * 60; // 1시간

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiresAt', expiresAt.toString());

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 비밀번호 확인
export const checkPassword = async (memEmail, memPw) => {
  return await authFetch(`${process.env.REACT_APP_SPRING_IP}api/auth/checkPassword`, {
    method: 'POST',
    body: JSON.stringify({ memEmail, memPw })
  });
};

// 회원 정보 업데이트
export const updateUser = async (formData) => {
  const payload = { ...formData };
  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] === null) {
      delete payload[key];
    }
  });

  const response = await authFetch(`${process.env.REACT_APP_SPRING_IP}api/auth/updateUser`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  return response;
};

// 회원 탈퇴
export const deleteUser = async (memEmail) => {
  const result = await authFetch(`${process.env.REACT_APP_SPRING_IP}api/auth/deleteUser`, {
    method: 'DELETE',
    body: JSON.stringify({ memEmail })
  });

  return result;
};

// 아이디 중복 체크
export const checkIdExists = async (memId) => {
  const result = await authFetch(`api/auth/checkId?memId=${memId}`, {
    method: 'GET'
  });
  return result;
};

// 이메일 중복 체크
export const checkEmailExists = async (email) => {
  try {
    const result = await oauthLogin(email); // 또는 user 조회 API
    return result !== null;
  } catch {
    return false;
  }
};

// 체중 변화 데이터 조회
export const getWeightChanges = async (memNo) => {
  return await authFetch(`api/auth/getWeightChanges?memNo=${memNo}`, {
    method: 'GET'
  });
};

// 세션 만료 여부 확인 함수
export const isSessionExpired = () => {
  const expiresAt = localStorage.getItem('expiresAt');
  return !expiresAt || Date.now() > Number(expiresAt);
};
