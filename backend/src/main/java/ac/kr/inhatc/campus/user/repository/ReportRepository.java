package ac.kr.inhatc.campus.user.repository;

import ac.kr.inhatc.campus.user.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReporterId(Long reporterId);
    List<Report> findByStatus(Report.Status status);
    List<Report> findByReporterIdAndStatus(Long reporterId, Report.Status status);
    List<Report> findByTargetTypeAndTargetId(Report.TargetType targetType, Long targetId);
    List<Report> findByTargetType(Report.TargetType targetType);
    Optional<Report> findById(Long id);
}

