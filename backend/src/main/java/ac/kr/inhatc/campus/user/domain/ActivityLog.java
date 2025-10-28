package ac.kr.inhatc.campus.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint

    @Column(name = "user_id", nullable = false)
    private Long userId; // bigint

    @Column(nullable = false, length = 100)
    private String action; // varchar(100)

    @Column(name = "target_type", length = 50)
    private String targetType; // varchar(50)

    @Column(name = "target_id")
    private Long targetId; // bigint

    // MySQL JSON 컬럼 매핑: TEXT에 저장하거나, 지원되는 경우 columnDefinition 이용
    @Column(name = "meta_json", columnDefinition = "json")
    private String metaJson; // json

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // datetime

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}


