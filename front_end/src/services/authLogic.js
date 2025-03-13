// Firestore에 사용자 데이터 저장 - 삭제 => mySQL로 변경 구현 : 채준병
//회원가입
export const registerMember = async (formData) => {
  console.log('회원가입 요청 데이터:', formData); // 디버깅용 출력

  // 회원가입시 admin 값을 무조건 0으로 설정
  formData.admin = 0;

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    // response.ok가 false면, 에러 처리
    if (!response.ok) {
      throw new Error(result.error || '회원가입 실패');
    }

    // 성공 시 결과 반환
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

//로그인 : 채준병
export const loginMember = async (formData) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '로그인 실패');
    }
    const userInfo = await response.json(); // 로그인 성공 시 사용자 정보 반환

    // 사용자 정보를 localStorage에 저장
    localStorage.setItem(
      'user',
      JSON.stringify({
        memNo: userInfo.memNo,
        memNick: userInfo.memNick,
        admin: userInfo.admin
      })
    );

    return userInfo;
  } catch (error) {
    throw new Error(error.message);
  }
};

//구글 로그인시 가입여부 확인 : 채준병
export const checkUserExists = async (email) => {
  console.log('checkUserExists 호출, 이메일: ', email);

  try {
    const response = await fetch(`/api/auth/checkUser?email=${email}`);

    if (!response.ok) {
      return false;
    }

    const exists = await response.json();
    return exists;
  } catch (error) {
    console.error('사용자 존재 확인 실패:', error);
    return false;
  }
};
