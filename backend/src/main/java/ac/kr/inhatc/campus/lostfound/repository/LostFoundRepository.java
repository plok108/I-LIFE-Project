package ac.kr.inhatc.campus.lostfound.repository;

import ac.kr.inhatc.campus.lostfound.domain.LostFound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostFoundRepository extends JpaRepository<LostFound, Long> {

    // 타입별 (LOST / FOUND) 최신순
    List<LostFound> findByTypeOrderByCreatedAtDesc(LostFound.Type type);

    // 상태별 (OPEN / MATCHED / CLOSED) 최신순
    List<LostFound> findByStatusOrderByCreatedAtDesc(LostFound.Status status);

    // 작성자(올린 사람)별 최신순
    List<LostFound> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
