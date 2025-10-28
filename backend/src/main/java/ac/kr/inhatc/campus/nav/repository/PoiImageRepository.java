package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.PoiImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoiImageRepository extends JpaRepository<PoiImage, Long> {
    List<PoiImage> findByPoiId(Long poiId);
    List<PoiImage> findByPoiIdOrderByIsPrimaryDescCreatedAtAsc(Long poiId);
    Optional<PoiImage> findByPoiIdAndIsPrimaryTrue(Long poiId);
    List<PoiImage> findByIsPrimaryTrue();
}

