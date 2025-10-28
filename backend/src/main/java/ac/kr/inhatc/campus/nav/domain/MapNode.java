package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "map_nodes")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MapNode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nodeId;
    
    @Column(name = "building_id", nullable = false)
    private Long buildingId;
    
    @Column(nullable = false)
    private Integer floor;
    
    @Column(nullable = false)
    private Double lat;
    
    @Column(nullable = false)
    private Double lng;
    
    @Column(length = 50)
    private String kind;
}
