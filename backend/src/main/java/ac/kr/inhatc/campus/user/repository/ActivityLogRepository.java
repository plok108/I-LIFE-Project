package ac.kr.inhatc.campus.user.repository;

import ac.kr.inhatc.campus.user.domain.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}


