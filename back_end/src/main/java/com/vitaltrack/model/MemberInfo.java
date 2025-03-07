package com.vitaltrack.model;

import lombok.Data;

@Data
public class MemberInfo {
    private String memId;
    private String memNick;
    private String memPhone;
    private String memEmail;
    private Double memWeight;
    private Double memHeight;
    private Integer memAge;
    private Double memBmi;
}
