package ac.kr.inhatc.campus.nav.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MapNodeDto {
    private Long nodeId;
    private Long buildingId;
    private Integer floor;
    private double lat;
    private double lng;
    private String kind;
}
