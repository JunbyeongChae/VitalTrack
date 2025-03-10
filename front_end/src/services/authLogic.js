// Firestore에 사용자 데이터 저장 - 삭제 => mySQL로 변경 구현 : 채준병
//회원가입입
export const registerMember = async (formData) => {
  console.log("회원가입 요청 데이터:", formData); // 디버깅용 출력
  try {
    const response = await fetch('http://localhost:8000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let errorMessage = '회원가입 실패';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        console.error('JSON 파싱 실패:', jsonError);
      }
      throw new Error(errorMessage);
    }

    return await response.text(); // "회원가입 성공" 메시지 반환
  } catch (error) {
    throw new Error(error.message);
  }
};

//로그인 : 채준병
export const loginMember = async (formData) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '로그인 실패');
    }

    return await response.json(); // 로그인 성공 시 사용자 정보 반환
  } catch (error) {
    throw new Error(error.message);
  }
};

//구글 로그인시 가입여부 확인 : 채준병
export const checkUserExists = async (email) => {
  try {
    const response = await fetch(`http://localhost:8000/api/checkUser?email=${email}`);

    if (!response.ok) {
      return false; // 사용자가 존재하지 않음
    }

    const exists = await response.json(); // ✅ undefined 방지: JSON 응답을 정상적으로 파싱
    return exists; // true 또는 false 반환
  } catch (error) {
    console.error('사용자 존재 확인 실패:', error);
    return false;
  }
};