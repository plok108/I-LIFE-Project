package ac.kr.inhatc.campus.market.repository;

import ac.kr.inhatc.campus.market.domain.MarketPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketPostRepository extends JpaRepository<MarketPost, Long> {

    // 카테고리별 최신순
    List<MarketPost> findByCategoryOrderByCreatedAtDesc(String category);

    // 작성자(author_id)별 최신순
    List<MarketPost> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
