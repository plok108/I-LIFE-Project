package ac.kr.inhatc.campus.lostfound.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateLostFoundRequest {
    // "LOST" 또는 "FOUND"
    private String type;

    private String title;
    private String description;
    private String category;

    // yyyy-MM-dd 같은 날짜 문자열을 넘기면 Jackson이 LocalDate로 바인딩 가능하게
    // 컨트롤러에서 수동으로 파싱해도 되고, 여기선 컨트롤러에서 접근하도록 String으로 둬도 된다.
    private String lostDate;       // ex "2025-10-28"

    private Long buildingId;
    private Double lat;
    private Double lng;

    // "OPEN", "MATCHED", "CLOSED" 중에서 기본은 OPEN으로 줄 예정이라 굳이 안 보내도 됨.
    private String status;

    private String contact;

    // 로그인 붙기 전까지는 프론트에서 그냥 authorId 보내게
    private Long authorId;
}
