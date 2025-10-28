package ac.kr.inhatc.campus.nav.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingDto {
    private Long id;                // bigint
    private String code;            // varchar(32)
    private String name;            // varchar(100)
    private String description;     // varchar(255)
    private Double lat;             // double
    private Double lng;             // double
    private LocalDateTime createdAt; // datetime (CURRENT_TIMESTAMP)
    private LocalDateTime updatedAt; // datetime (on update CURRENT_TIMESTAMP)
}
