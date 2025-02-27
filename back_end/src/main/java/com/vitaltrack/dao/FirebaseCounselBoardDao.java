package com.vitaltrack.dao;

import com.vitaltrack.model.CounselBoard;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Repository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Log4j2
@Repository
public class FirebaseCounselBoardDao {

  private Firestore db = FirestoreClient.getFirestore();

  public List<Map<String, Object>> boardList(Map<String, Object> pmap) throws ExecutionException, InterruptedException {
    log.info("boardList 호출");
    ApiFuture<QuerySnapshot> query = db.collection("boards").get();
    List<QueryDocumentSnapshot> documents = query.get().getDocuments();
    return documents.stream().map(DocumentSnapshot::getData).toList();
  }

  public int boardInsert(CounselBoard board) {
    log.info("boardInsert 호출");
    ApiFuture<WriteResult> future = db.collection("boards").document().set(board);
    try {
      future.get();
      return 1;
    } catch (InterruptedException | ExecutionException e) {
      log.error("boardInsert 실패", e);
      return -1;
    }
  }

  public void hitCount(Map<String, Object> pmap) {
    log.info("hitCount 호출");
    String documentId = (String) pmap.get("id");
    DocumentReference docRef = db.collection("boards").document(documentId);
    ApiFuture<WriteResult> future = docRef.update("hitCount", FieldValue.increment(1));
    try {
      future.get();
    } catch (InterruptedException | ExecutionException e) {
      log.error("hitCount 실패", e);
    }
  }

  public List<Map<String, Object>> commentList(Map<String, Object> pmap)
      throws ExecutionException, InterruptedException {
    log.info("commentList 호출 성공");
    String boardId = (String) pmap.get("boardId");
    ApiFuture<QuerySnapshot> query = db.collection("boards").document(boardId).collection("comments").get();
    List<QueryDocumentSnapshot> documents = query.get().getDocuments();
    return documents.stream().map(DocumentSnapshot::getData).toList();
  }

  public int boardDelete(String documentId) {
    log.info("boardDelete 호출");
    ApiFuture<WriteResult> future = db.collection("boards").document(documentId).delete();
    try {
      future.get();
      return 1;
    } catch (InterruptedException | ExecutionException e) {
      log.error("boardDelete 실패", e);
      return -1;
    }
  }

  public int boardUpdate(Map<String, Object> pmap) {
    log.info("boardUpdate 호출");
    String documentId = (String) pmap.get("id");
    DocumentReference docRef = db.collection("boards").document(documentId);
    ApiFuture<WriteResult> future = docRef.update(pmap);
    try {
      future.get();
      return 1;
    } catch (InterruptedException | ExecutionException e) {
      log.error("boardUpdate 실패", e);
      return -1;
    }
  }

  public int commentInsert(Map<String, Object> pmap) {
    log.info("commentInsert 호출");
    String boardId = (String) pmap.get("boardId");
    ApiFuture<WriteResult> future = db.collection("boards").document(boardId).collection("comments").document()
        .set(pmap);
    try {
      future.get();
      return 1;
    } catch (InterruptedException | ExecutionException e) {
      log.error("commentInsert 실패", e);
      return -1;
    }
  }

  public int commentUpdate(Map<String, Object> pmap) {
    log.info("commentUpdate 호출");
    String boardId = (String) pmap.get("boardId");
    String commentId = (String) pmap.get("commentId");
    DocumentReference docRef = db.collection("boards").document(boardId).collection("comments").document(commentId);
    ApiFuture<WriteResult> future = docRef.update(pmap);
    try {
      future.get();
      return 1;
    } catch (InterruptedException | ExecutionException e) {
      log.error("commentUpdate 실패", e);
      return -1;
    }
  }

  public int commentDelete(String boardId, String commentId) {
    log.info("commentDelete 호출");
    ApiFuture<WriteResult> future = db.collection("boards").document(boardId).collection("comments").document(commentId)
        .delete();
    try {
      future.get();
      return 1;
    } catch (InterruptedException | ExecutionException e) {
      log.error("commentDelete 실패", e);
      return -1;
    }
  }
}