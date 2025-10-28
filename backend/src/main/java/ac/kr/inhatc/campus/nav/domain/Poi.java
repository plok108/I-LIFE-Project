package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "poi")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Poi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint
    
    @Column(name = "building_id", nullable = false)
    private Long buildingId; // bigint
    
    @Column(name = "category_id", nullable = false)
    private Long categoryId; // bigint
    
    @Column(nullable = false, length = 150)
    private String name; // varchar(150)
    
    @Column(length = 255)
    private String description; // varchar(255)
    
    @Column(nullable = false)
    private Double lat; // double
    
    @Column(nullable = false)
    private Double lng; // double
    
    @Column(nullable = false)
    private Integer floor; // int
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true; // tinyint(1)
    
    @Column(name = "created_by")
    private Long createdBy; // bigint
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // datetime
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // datetime
    
    @PrePersist
    protected void onCreate() {
        if (isActive == null) {
            isActive = true;
        }
    }
}
