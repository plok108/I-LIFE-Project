package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "poi_image")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class PoiImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint
    
    @Column(name = "poi_id", nullable = false)
    private Long poiId; // bigint
    
    @Column(nullable = false, length = 500)
    private String url; // varchar(500)
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false; // tinyint(1)
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // datetime
    
    @PrePersist
    protected void onCreate() {
        if (isPrimary == null) {
            isPrimary = false;
        }
    }
}

