package com.vitaltrack.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "diet")
public class Diet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mem_no")
    private String memNo;  // Firebase member ID reference

    @Column(name = "date")
    private String date;

    @Column(name = "diet_kcal")
    private Double dietKcal;

    @Column(name = "diet_menu")
    private String dietMenu;
}
