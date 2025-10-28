package ac.kr.inhatc.campus.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ac.kr.inhatc.campus.domain.Building;

public interface BuildingRepo extends JpaRepository<Building, Long> {
    Optional<Building> findByCode(String code);
}
