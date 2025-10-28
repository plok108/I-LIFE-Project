package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "map_edges")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MapEdge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long edgeId;
    
    @Column(name = "src_node_id", nullable = false)
    private Long srcNodeId;
    
    @Column(name = "dst_node_id", nullable = false)
    private Long dstNodeId;
    
    @Column(name = "distance_meter", nullable = false)
    private Double distanceMeter;
    
    @Column(nullable = false)
    private Boolean bidirectional = false;
    
    @Column(name = "walkway_type", length = 50)
    private String walkwayType;
    
    @Column(name = "accessible_only")
    private Boolean accessibleOnly = false;
}
