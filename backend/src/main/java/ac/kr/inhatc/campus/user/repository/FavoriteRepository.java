package ac.kr.inhatc.campus.user.repository;

import ac.kr.inhatc.campus.user.domain.Favorite;
import ac.kr.inhatc.campus.user.domain.Favorite.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Favorite> findByUserIdAndTargetType(Long userId, TargetType targetType);
    Optional<Favorite> findByUserIdAndTargetTypeAndTargetId(Long userId, TargetType targetType, Long targetId);
    long deleteByUserIdAndTargetTypeAndTargetId(Long userId, TargetType targetType, Long targetId);
    boolean existsByUserIdAndTargetTypeAndTargetId(Long userId, TargetType targetType, Long targetId);
}


