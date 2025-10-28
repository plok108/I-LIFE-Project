package ac.kr.inhatc.campus.lostfound.repository;

import ac.kr.inhatc.campus.lostfound.domain.LostFoundImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostFoundImageRepository extends JpaRepository<LostFoundImage, Long> {

    // 특정 분실물 글의 이미지들: 대표(is_primary=true) 먼저
    List<LostFoundImage> findByLostFound_IdOrderByIsPrimaryDescIdAsc(Long lostFoundId);

    void deleteByLostFound_Id(Long lostFoundId);
}
