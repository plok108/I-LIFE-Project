package ac.kr.inhatc.campus.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorite")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint

    @Column(name = "user_id", nullable = false)
    private Long userId; // bigint

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 20)
    private TargetType targetType; // enum('POI','MARKET','LOST_FOUND')

    @Column(name = "target_id", nullable = false)
    private Long targetId; // bigint

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // datetime

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TargetType {
        POI,
        MARKET,
        LOST_FOUND
    }
}


