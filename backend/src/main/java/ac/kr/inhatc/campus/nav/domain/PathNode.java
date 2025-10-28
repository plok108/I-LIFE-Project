package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "path_node")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PathNode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint
    
    @Column(name = "building_id", nullable = false)
    private Long buildingId; // bigint
    
    @Column(nullable = false, length = 100)
    private String label; // varchar(100)
    
    @Column(nullable = false)
    private Double lat; // double
    
    @Column(nullable = false)
    private Double lng; // double
    
    @Column(nullable = false)
    private Integer floor; // int
}

