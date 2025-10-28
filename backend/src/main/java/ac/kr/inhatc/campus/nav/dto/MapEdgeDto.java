package ac.kr.inhatc.campus.nav.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MapEdgeDto {
    private Long edgeId;
    private Long srcNodeId;
    private Long dstNodeId;
    private double distanceMeter;
    private boolean bidirectional;
    private String walkwayType;
    private boolean accessibleOnly;
}
