package com.vitaltrack.controller;

import com.vitaltrack.model.MemberInfo;
import com.vitaltrack.model.Diet;
import com.vitaltrack.service.MemberInfoService;
import com.vitaltrack.repository.DietRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberInfoService memberInfoService;
    private final DietRepository dietRepository;

    // Fetch member info from Firestore
    @GetMapping
    public List<MemberInfo> getAllMembers() throws ExecutionException, InterruptedException {
        return memberInfoService.getAllMembers();
    }

    // Fetch diet records from MySQL by member ID
    @GetMapping("/{memNo}/diet")
    public List<Diet> getMemberDiet(@PathVariable String memNo) {
        return dietRepository.findByMemNo(memNo);
    }
}
