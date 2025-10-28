package ac.kr.inhatc.campus.market.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "market_image")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Builder
public class MarketImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint PK

    // FK → market_post.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private MarketPost post;

    @Column(name = "url", nullable = false, length = 500)
    private String url; // varchar(500)

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary; // tinyint(1) -> boolean으로 매핑

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // datetime

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (isPrimary == null) isPrimary = false;
    }
}
