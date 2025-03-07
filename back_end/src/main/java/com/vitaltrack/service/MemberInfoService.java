package com.vitaltrack.service;

import com.vitaltrack.model.MemberInfo;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class MemberInfoService {
    private final Firestore firestore;

    public List<MemberInfo> getAllMembers() throws ExecutionException, InterruptedException {
        List<MemberInfo> members = new ArrayList<>();
        for (QueryDocumentSnapshot doc : firestore.collection("members").get().get().getDocuments()) {
            members.add(doc.toObject(MemberInfo.class));
        }
        return members;
    }
}