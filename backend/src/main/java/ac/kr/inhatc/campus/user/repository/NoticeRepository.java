package ac.kr.inhatc.campus.user.repository;

import ac.kr.inhatc.campus.user.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByIsPinnedDescCreatedAtDesc();
    List<Notice> findByIsPinnedTrueOrderByCreatedAtDesc();
    List<Notice> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    List<Notice> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
    List<Notice> findByContentContainingOrderByCreatedAtDesc(String keyword);
}
