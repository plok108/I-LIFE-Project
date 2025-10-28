package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.MapEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MapEdgeRepository extends JpaRepository<MapEdge, Long> {
    List<MapEdge> findBySrcNodeId(Long srcNodeId);
    List<MapEdge> findByDstNodeId(Long dstNodeId);
}
