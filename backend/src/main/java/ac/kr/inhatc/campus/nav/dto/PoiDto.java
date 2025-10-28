package ac.kr.inhatc.campus.nav.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class PoiDto {
    private Long id;
    private Long buildingId;
    private Long categoryId;
    private String name;
    private String description;
    private Double lat;
    private Double lng;
    private Integer floor;
    private Boolean isActive;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
