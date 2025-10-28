package ac.kr.inhatc.campus.market.repository;

import ac.kr.inhatc.campus.market.domain.MarketImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketImageRepository extends JpaRepository<MarketImage, Long> {

    // 특정 게시글의 이미지들: 대표 이미지(is_primary=true) 먼저 나오게, 그 다음 id 오름차순
    List<MarketImage> findByPost_IdOrderByIsPrimaryDescIdAsc(Long postId);

    // 게시글 이미지 전체 삭제 등
    void deleteByPost_Id(Long postId);
}
