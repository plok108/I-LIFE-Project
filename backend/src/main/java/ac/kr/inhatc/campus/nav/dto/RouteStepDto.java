package ac.kr.inhatc.campus.nav.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStepDto {
    private Long nodeId;

    // 지도에 찍기 위한 좌표
    private Double lat;
    private Double lng;

    // 층 정보 (실내 안내용)
    private Integer floor;

    // "1층 → 2층 이동" 같은 안내문
    private String instruction;

    // 이전 지점에서 여기까지 몇 m 이동했는지
    private double distanceMeter;
}
