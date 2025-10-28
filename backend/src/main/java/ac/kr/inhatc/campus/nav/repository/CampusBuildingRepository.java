package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.CampusBuilding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampusBuildingRepository extends JpaRepository<CampusBuilding, Long> {
    boolean existsByCode(String code);
}
