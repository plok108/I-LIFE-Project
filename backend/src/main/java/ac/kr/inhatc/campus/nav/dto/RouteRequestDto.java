package ac.kr.inhatc.campus.nav.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class RouteRequestDto {
    private Long startNodeId;
    private Long endNodeId;

    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;

    private boolean accessible;
}
