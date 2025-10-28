package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.MapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MapNodeRepository extends JpaRepository<MapNode, Long> {
    List<MapNode> findByBuildingIdAndFloor(Long buildingId, Integer floor);
}
