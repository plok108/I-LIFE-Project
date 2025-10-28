package ac.kr.inhatc.campus.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint

    @Column(nullable = false, length = 200)
    private String title; // varchar(200)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content; // text

    @Column(name = "author_id")
    private Long authorId; // bigint

    @Column(name = "is_pinned", nullable = false)
    private Boolean isPinned = false; // tinyint(1)

    @Column(name = "created_at")
    private LocalDateTime createdAt; // datetime

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // datetime

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isPinned == null) {
            isPinned = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
