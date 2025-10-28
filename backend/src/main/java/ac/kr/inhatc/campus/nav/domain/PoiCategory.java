package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "poi_category")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PoiCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint
    
    @Column(nullable = false, unique = true, length = 50)
    private String code; // varchar(50)
    
    @Column(nullable = false, length = 100)
    private String name; // varchar(100)
}

