package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.Poi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoiRepository extends JpaRepository<Poi, Long> {
    List<Poi> findByBuildingId(Long buildingId);
    List<Poi> findByBuildingIdAndFloor(Long buildingId, Integer floor);
    List<Poi> findByBuildingIdAndIsActiveTrue(Long buildingId);
    List<Poi> findByCategoryId(Long categoryId);
    List<Poi> findByCategoryIdAndIsActiveTrue(Long categoryId);
    List<Poi> findByIsActiveTrue();
    List<Poi> findByNameContainingIgnoreCase(String keyword);
    List<Poi> findByNameContainingIgnoreCaseAndIsActiveTrue(String keyword);
    Optional<Poi> findById(Long id);
}
