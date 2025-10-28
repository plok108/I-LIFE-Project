package ac.kr.inhatc.campus.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "report")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint
    
    @Column(name = "reporter_id", nullable = false)
    private Long reporterId; // bigint
    
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType; // enum('MARKET','LOST_FOUND','POI')
    
    @Column(name = "target_id", nullable = false)
    private Long targetId; // bigint
    
    @Column(length = 200)
    private String reason; // varchar(200)
    
    @Column(columnDefinition = "text")
    private String detail; // text
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN; // enum('OPEN','REVIEWING','CLOSED')
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // datetime
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // datetime
    
    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = Status.OPEN;
        }
    }
    
    public enum TargetType {
        MARKET, LOST_FOUND, POI
    }
    
    public enum Status {
        OPEN, REVIEWING, CLOSED
    }
}

