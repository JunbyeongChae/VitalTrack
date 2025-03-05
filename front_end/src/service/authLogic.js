import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Firebase 설정 파일 가져오기

// Firestore에 사용자 데이터 저장
export const saveUserData = async (uid, formData) => {
  try {
    const bmiResult = await infoBMI(formData);
    const calorie = await infoCalorie(formData);
    const nutrition = await infoNutrition({ ...formData, calorie });

    await setDoc(
      doc(db, 'users', uid),
      {
        gender: formData.gender,
        birthDate: formData.birthDate,
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
        height: formData.height,
        weight: formData.weight,
        activityLevel: formData.activityLevel,
        bmiResult,
        calorie,
        nutrition
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Firestore 저장 에러:', err);
    throw err;
  }
};

// 사용자데이터 수정 - 미구현 : 채준병
export const updateUserData = async (uid, formData) => {
  try {
    const bmiResult = await infoBMI(formData);
    const calorie = await infoCalorie(formData);
    const nutrition = await infoNutrition({ ...formData, calorie });

    await setDoc(
      doc(db, 'users', uid),
      {
        gender: formData,
        birthDate: formData.birthDate,
        name: formData.name,
        email: formData.email,
        height: formData.height,
        weight: formData.weight,
        activityLevel: formData.activityLevel,
        bmiResult,
        calorie,
        nutrition
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Firestore 수정 에러:', err);
  }
};

export const handleSignup = async (formData, isGoogleSignup, prefilledData, agreed) => {
  if (formData.password !== formData.confirmPassword) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  if (!agreed) {
    throw new Error('개인정보 처리방침에 동의해야 합니다.');
  }

  try {
    let uid;
    if (isGoogleSignup) {
      uid = prefilledData.uid;
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await saveUserData(uid, formData);
        return '회원정보가 업데이트되었습니다.';
      } else {
        await saveUserData(uid, formData);
        return '회원가입이 완료되었습니다.';
      }
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      uid = userCredential.user.uid;
      await saveUserData(uid, formData);
      return '회원가입이 완료되었습니다.';
    }
  } catch (err) {
    throw new Error(`회원가입 실패: ${err.message}`);
  }
};

/*------------------------- 건강정보데이터 계산 : 채준병 -------------------------*/
//BMI 계산
export const infoBMI = async (userData) => {
  //BMI 계산
  const bmi = userData.weight / ((userData.height / 100) * (userData.height / 100));
  //BMI 결과 저장
  let bmiResult = '';
  if (bmi < 18.5) {
    bmiResult = '저체중';
  } else if (bmi < 23) {
    bmiResult = '정상';
  } else if (bmi < 25) {
    bmiResult = '과체중';
  } else if (bmi < 30) {
    bmiResult = '경도비만';
  } else if (bmi < 35) {
    bmiResult = '중등도비만';
  } else {
    bmiResult = '고도비만';
  }
  //BMI 결과 반환
  return bmiResult;
};
//에너지필요추정량(EER) 계산
export const infoCalorie = async (userData) => {
  //에너지필요추정량(EER)＝α+β×연령(세)+PA×[γ×체중(kg)+δ×신장(m)]
  //남성 : α=662, β=-9.53, γ=15.91, δ=539.6
  //여성 : α=354, β=-6.91, γ=9.36, δ=726
  let calorie = 0;
  if (userData.gender === '남성') {
    if (userData.activityLevel === '비활동적') {
      calorie = 662 - 9.53 * userData.age + 1.0 * (userData.weight + 539.6 * userData.height);
    } else if (userData.activityLevel === '저활동적') {
      calorie = 662 - 9.53 * userData.age + 1.11 * (userData.weight + 539.6 * userData.height);
    } else if (userData.activityLevel === '활동적') {
      calorie = 662 - 9.53 * userData.age + 1.25 * (userData.weight + 539.6 * userData.height);
    } else if (userData.activityLevel === '매우 활동적') {
      calorie = 662 - 9.53 * userData.age + 1.48 * (userData.weight + 539.6 * userData.height);
    }
  } else {
    if (userData.activityLevel === '비활동적') {
      calorie = 354 - 6.91 * userData.age + 1.0 * (userData.weight + 726 * userData.height);
    } else if (userData.activityLevel === '저활동적') {
      calorie = 354 - 6.91 * userData.age + 1.12 * (userData.weight + 726 * userData.height);
    } else if (userData.activityLevel === '활동적') {
      calorie = 354 - 6.91 * userData.age + 1.27 * (userData.weight + 726 * userData.height);
    } else if (userData.activityLevel === '매우 활동적') {
      calorie = 354 - 6.91 * userData.age + 1.45 * (userData.weight + 726 * userData.height);
    }
  }
  return calorie;
};
//영양소 섭취필요량 계산
export const infoNutrition = async (userData) => {
  //영양소 섭취량 계산
  //탄수화물 : 55~65%, 단백질 : 15~20%, 지방 : 15~30%, 포화지방 : 7%이하, 트랜스지방 : 1%이하, 콜레스테롤 : 300mg이하
  let nutrition = {
    minCarbohydrate: 0,
    maxCarbohydrate: 0,
    minProtein: 0,
    maxProtein: 0,
    minFat: 0,
    maxFat: 0,
    saturFat: 0,
    transFat: 0,
    chole: 0
  };
  nutrition.minCarbohydrate = userData.calorie * 0.55;
  nutrition.maxCarbohydrate = userData.calorie * 0.65;
  nutrition.minProtein = userData.calorie * 0.15;
  nutrition.maxProtein = userData.calorie * 0.2;
  nutrition.minFat = userData.calorie * 0.15;
  nutrition.maxFat = userData.calorie * 0.3;
  nutrition.saturFat = userData.calorie * 0.07; //7% 이하
  nutrition.transFat = userData.calorie * 0.01;
  nutrition.chole = 300; //mg 이하
  return nutrition;
};
/*------------------------- end of 건강정보데이터 계산 : 채준병 -------------------------*/
