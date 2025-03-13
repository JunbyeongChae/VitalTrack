package com.vitaltrack.dao;

import com.vitaltrack.model.MemberInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface MemberDao {
    // 회원가입 (데이터 저장)
    int insertMember(MemberInfo member);

    // 이메일로 회원 조회
    MemberInfo findByEmail(@Param("memEmail")String memEmail);

    // 아이디로 회원 조회
    MemberInfo findById(String memId);

    @Update("UPDATE memberinfo SET memId = #{memId}, memEmail = #{memEmail}, memNick = #{memNick}, memPhone = #{memPhone}, memAge = #{memAge}, memHeight = #{memHeight}, memWeight = #{memWeight}, memBmi = #{memBmi}, memKcal = #{memKcal}, carbMin = #{carbMin}, carbMax = #{carbMax}, proteinMin = #{proteinMin}, proteinMax = #{proteinMax}, fatMin = #{fatMin}, fatMax = #{fatMax}, admin = #{admin} WHERE memId = #{memId}")
    int updateMember(MemberInfo member);

}

