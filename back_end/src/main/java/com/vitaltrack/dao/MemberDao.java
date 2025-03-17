package com.vitaltrack.dao;

import com.vitaltrack.model.MemberInfo;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberDao {
  // 회원가입 (데이터 저장)
  int insertMember(MemberInfo member);

  // ID 중복 검사
  int existsById(@Param("memId") String memId);

  // 이메일로 회원 조회
  MemberInfo findByEmail(@Param("memEmail") String memEmail);

  // 회원 정보 수정
  int updateMember(MemberInfo member);

  // 회원 정보 삭제
  int deleteByEmail(@Param("memEmail") String memEmail);

  int deleteWeightChangeByMemNo(@Param("memNo") Integer memNo);

  // 체중 변화 기록
  int insertOrUpdateWeightChange(@Param("memNo") Integer memNo, @Param("weightDate") String weightDate,
      @Param("weight") Double weight);

  // 아이디로 회원 조회
  MemberInfo findById(String memId);

  // 체중 변화 데이터 가져오기
List<Map<String, Object>> getWeightChanges(@Param("memNo") Integer memNo);
}
