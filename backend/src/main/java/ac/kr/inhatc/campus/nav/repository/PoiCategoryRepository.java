package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.PoiCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoiCategoryRepository extends JpaRepository<PoiCategory, Long> {
    Optional<PoiCategory> findByCode(String code);
    List<PoiCategory> findByNameContainingIgnoreCase(String keyword);
    Optional<PoiCategory> findById(Long id);
}

