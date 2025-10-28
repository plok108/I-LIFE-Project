package ac.kr.inhatc.campus.nav.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "room")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint
    
    @Column(name = "building_id", nullable = false)
    private Long buildingId; // bigint
    
    @Column(name = "room_code", nullable = false, length = 50)
    private String roomCode; // varchar(50)
    
    @Column(nullable = false, length = 100)
    private String name; // varchar(100)
    
    @Column(nullable = false)
    private Integer floor; // int
    
    @Column(nullable = false)
    private Double lat; // double
    
    @Column(nullable = false)
    private Double lng; // double
}

