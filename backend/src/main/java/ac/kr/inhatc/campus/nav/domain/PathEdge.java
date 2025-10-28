package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "path_edge")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PathEdge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint

    @Column(name = "from_node_id", nullable = false)
    private Long fromNodeId; // bigint

    @Column(name = "to_node_id", nullable = false)
    private Long toNodeId; // bigint

    @Column(name = "distance_m", nullable = false)
    private Double distanceM; // double

    @Column(nullable = false)
    private Double weight; // double

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true; // tinyint(1)

    @PrePersist
    protected void onCreate() {
        if (isActive == null) {
            isActive = true;
        }
    }
}
