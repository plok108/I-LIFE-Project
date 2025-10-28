package ac.kr.inhatc.campus.nav.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class RouteResponseDto {
    private double totalDistanceMeter;
    private int estimatedSeconds;
    private List<Long> pathNodeIds;
    private List<RouteStepDto> steps;
}
