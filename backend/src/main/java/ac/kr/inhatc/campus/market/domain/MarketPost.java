package ac.kr.inhatc.campus.market.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "market_post")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Builder
public class MarketPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint PK

    // enum('SELL','BUY')
    public enum Type {
        SELL, BUY
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 10)
    private Type type;

    @Column(name = "title", nullable = false, length = 200)
    private String title; // varchar(200)

    @Lob
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description; // text

    @Column(name = "price_krw", nullable = false)
    private Integer priceKrw; // int

    @Column(name = "category", length = 50)
    private String category; // varchar(50)

    // status: enum('ACTIVE','RESERVED','SOLD','DELETED')
    // ACTIVE    = 판매중
    // RESERVED  = 예약중
    // SOLD      = 판매완료
    // DELETED   = 숨김/삭제됨
    public enum Status {
        ACTIVE, RESERVED, SOLD, DELETED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @Column(name = "author_id", nullable = false)
    private Long authorId; // bigint

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // datetime

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // datetime

    // post <-> image (1:N)
    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<MarketImage> images;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (status == null) status = Status.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
