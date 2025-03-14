package com.vitaltrack.dao;

import com.vitaltrack.model.MemberInfo;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberDao {
  // 회원가입 (데이터 저장)
  int insertMember(MemberInfo member);

  // 이메일로 회원 조회
  MemberInfo findByEmail(@Param("memEmail") String memEmail);

  // 아이디로 회원 조회
  MemberInfo findById(@Param("memId") String memId);

  // 회원 정보 수정
  int updateMember(MemberInfo member);

  // 회원 정보 삭제
  int deleteByEmail(@Param("memEmail") String memEmail);
}
