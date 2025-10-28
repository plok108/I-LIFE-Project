package ac.kr.inhatc.campus.lostfound.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lost_found_image")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor
@Builder
public class LostFoundImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK -> lost_found.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_found_id", nullable = false)
    private LostFound lostFound;

    @Column(name = "url", nullable = false, length = 500)
    private String url;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (isPrimary == null) isPrimary = false;
    }
}
