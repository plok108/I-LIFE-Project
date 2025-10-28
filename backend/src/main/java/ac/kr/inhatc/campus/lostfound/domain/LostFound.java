package ac.kr.inhatc.campus.lostfound.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lost_found")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Builder
public class LostFound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // enum('LOST','FOUND')
    public enum Type {
        LOST, FOUND
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 10)
    private Type type;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Lob
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    // 분실/습득 날짜
    @Column(name = "lost_date")
    private LocalDate lostDate;

    // 건물/위치
    @Column(name = "building_id")
    private Long buildingId;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lng")
    private Double lng;

    // enum('OPEN','MATCHED','CLOSED')
    public enum Status {
        OPEN, MATCHED, CLOSED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @Column(name = "contact", length = 120)
    private String contact;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 연결된 이미지들
    @OneToMany(mappedBy = "lostFound", fetch = FetchType.LAZY)
    private List<LostFoundImage> images;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (status == null) status = Status.OPEN;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
