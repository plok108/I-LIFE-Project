package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.PathEdge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PathEdgeRepository extends JpaRepository<PathEdge, Long> {
    List<PathEdge> findByIsActiveTrue();
    List<PathEdge> findByFromNodeIdAndIsActiveTrue(Long fromNodeId);
    List<PathEdge> findByToNodeIdAndIsActiveTrue(Long toNodeId);
    List<PathEdge> findByFromNodeIdOrToNodeIdAndIsActiveTrue(Long fromNodeId, Long toNodeId);
    List<PathEdge> findByDistanceMLessThanEqualOrderByDistanceM(Double maxDistance);
}
