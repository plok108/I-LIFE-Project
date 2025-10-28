package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.PathNode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PathNodeRepository extends JpaRepository<PathNode, Long> {
    List<PathNode> findByBuildingId(Long buildingId);
    List<PathNode> findByBuildingIdAndFloor(Long buildingId, Integer floor);
    Optional<PathNode> findById(Long id);
    List<PathNode> findByFloor(Integer floor);
    List<PathNode> findByLabelContaining(String keyword);
}

