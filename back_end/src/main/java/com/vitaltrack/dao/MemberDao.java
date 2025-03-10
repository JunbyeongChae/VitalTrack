package com.vitaltrack.dao;

import com.vitaltrack.model.MemberInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberDao {
    // 회원가입 (데이터 저장)
    int insertMember(MemberInfo member);

    // 이메일로 회원 조회
    MemberInfo findByEmail(String email);

    // 아이디로 회원 조회
    MemberInfo findById(String memId);
}
