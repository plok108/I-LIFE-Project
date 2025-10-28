package ac.kr.inhatc.campus.nav.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class RouteStepDto {
    private Long nodeId;
    private Integer floor;
    private String instruction;
    private double distanceMeter;
}
